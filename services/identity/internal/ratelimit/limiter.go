package ratelimit

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// Limiter is a Redis-backed sliding window rate limiter.
type Limiter struct {
	rdb *redis.Client
}

// NewLimiter creates a new Redis rate limiter.
func NewLimiter(rdb *redis.Client) *Limiter {
	return &Limiter{rdb: rdb}
}

// Result holds the rate limit check result.
type Result struct {
	Allowed    bool
	Remaining  int
	RetryAfter time.Duration
}

// Allow checks whether the given key is within the specified limit and window.
// Uses Redis INCR + EXPIRE sliding counter (simple fixed window approximation).
func (l *Limiter) Allow(ctx context.Context, key string, limit int, window time.Duration) (Result, error) {
	redisKey := "rl:" + key

	pipe := l.rdb.TxPipeline()
	incrCmd := pipe.Incr(ctx, redisKey)
	pipe.Expire(ctx, redisKey, window) // reset TTL on each request (fixed window)

	if _, err := pipe.Exec(ctx); err != nil {
		// On Redis failure, allow the request (fail open) to avoid blocking service
		return Result{Allowed: true, Remaining: limit}, nil
	}

	count := int(incrCmd.Val())
	remaining := limit - count
	if remaining < 0 {
		remaining = 0
	}

	if count > limit {
		// Get remaining TTL for Retry-After header
		ttl, _ := l.rdb.TTL(ctx, redisKey).Result()
		return Result{
			Allowed:    false,
			Remaining:  0,
			RetryAfter: ttl,
		}, nil
	}

	return Result{Allowed: true, Remaining: remaining}, nil
}

// Reset removes the rate limit counter for a key (e.g. after successful login).
func (l *Limiter) Reset(ctx context.Context, key string) error {
	return l.rdb.Del(ctx, "rl:"+key).Err()
}

// ─── Key builders ─────────────────────────────────────────────────────────────

// LoginByIPKey returns a rate limit key for login attempts per IP.
func LoginByIPKey(ip string) string {
	return fmt.Sprintf("login:ip:%s", ip)
}

// LoginByEmailKey returns a rate limit key for login attempts per email.
func LoginByEmailKey(email string) string {
	return fmt.Sprintf("login:email:%s", email)
}

// RegisterByIPKey returns a rate limit key for registration attempts per IP.
func RegisterByIPKey(ip string) string {
	return fmt.Sprintf("register:ip:%s", ip)
}

// FailedLoginKey returns the Redis key for tracking failed login attempts per user.
func FailedLoginKey(email string) string {
	return fmt.Sprintf("failed_login:%s", email)
}
