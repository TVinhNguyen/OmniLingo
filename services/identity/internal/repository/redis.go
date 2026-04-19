package repository

import (
	"fmt"

	"github.com/redis/go-redis/v9"
)

// NewRedis creates a new Redis client from a URL (e.g. "redis://localhost:6379/0").
func NewRedis(url string) *redis.Client {
	opts, err := redis.ParseURL(url)
	if err != nil {
		panic(fmt.Sprintf("invalid REDIS_URL: %v", err))
	}
	return redis.NewClient(opts)
}
