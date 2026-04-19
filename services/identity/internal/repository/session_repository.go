package repository

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"

	"github.com/omnilingo/omnilingo/services/identity/internal/domain"
)

// SessionRepository persists and manages refresh token sessions.
type SessionRepository interface {
	Create(ctx context.Context, s *domain.Session) error
	FindByRefreshToken(ctx context.Context, rawToken string) (*domain.Session, error)
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Session, error)
	Revoke(ctx context.Context, sessionID uuid.UUID) error
	RevokeAllForUser(ctx context.Context, userID uuid.UUID) error
	ListActiveByUser(ctx context.Context, userID uuid.UUID) ([]*domain.Session, error)
	CountActive(ctx context.Context) (int, error)
}

type sessionRepository struct {
	rdb *redis.Client
	db  *pgxpool.Pool
}

// NewSessionRepository creates a SessionRepository backed by Redis (hot path) + PostgreSQL (persistence).
func NewSessionRepository(rdb *redis.Client, db *pgxpool.Pool) SessionRepository {
	return &sessionRepository{rdb: rdb, db: db}
}

func (r *sessionRepository) Create(ctx context.Context, s *domain.Session) error {
	const q = `
		INSERT INTO sessions (id, user_id, refresh_token_hash, device_id, device_info, ip, created_at, expires_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	now := time.Now().UTC()
	s.CreatedAt = now

	_, err := r.db.Exec(ctx, q,
		s.ID, s.UserID, s.RefreshTokenHash,
		s.DeviceID, s.DeviceInfo, s.IP,
		s.CreatedAt, s.ExpiresAt,
	)
	if err != nil {
		return fmt.Errorf("sessionRepo.Create: %w", err)
	}

	// Cache in Redis for fast lookup: key = hash(token) → sessionID, TTL = expiry
	ttl := time.Until(s.ExpiresAt)
	key := redisSessionKey(s.RefreshTokenHash)
	return r.rdb.Set(ctx, key, s.ID.String(), ttl).Err()
}

func (r *sessionRepository) FindByRefreshToken(ctx context.Context, rawToken string) (*domain.Session, error) {
	tokenHash := hashToken(rawToken)

	// Fast path: Redis
	key := redisSessionKey(tokenHash)
	sessionIDStr, err := r.rdb.Get(ctx, key).Result()
	if err == nil && sessionIDStr != "" {
		sessionID, parseErr := uuid.Parse(sessionIDStr)
		if parseErr == nil {
			return r.FindByID(ctx, sessionID)
		}
	}

	// Fallback: PostgreSQL
	return r.findByTokenHash(ctx, tokenHash)
}

func (r *sessionRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Session, error) {
	const q = `
		SELECT id, user_id, refresh_token_hash, device_id, device_info, ip, created_at, expires_at, revoked_at
		FROM sessions WHERE id = $1
	`
	s := &domain.Session{}
	err := r.db.QueryRow(ctx, q, id).Scan(
		&s.ID, &s.UserID, &s.RefreshTokenHash,
		&s.DeviceID, &s.DeviceInfo, &s.IP,
		&s.CreatedAt, &s.ExpiresAt, &s.RevokedAt,
	)
	if err != nil {
		return nil, domain.ErrTokenInvalid
	}
	return s, nil
}

func (r *sessionRepository) findByTokenHash(ctx context.Context, tokenHash string) (*domain.Session, error) {
	const q = `
		SELECT id, user_id, refresh_token_hash, device_id, device_info, ip, created_at, expires_at, revoked_at
		FROM sessions WHERE refresh_token_hash = $1
	`
	s := &domain.Session{}
	err := r.db.QueryRow(ctx, q, tokenHash).Scan(
		&s.ID, &s.UserID, &s.RefreshTokenHash,
		&s.DeviceID, &s.DeviceInfo, &s.IP,
		&s.CreatedAt, &s.ExpiresAt, &s.RevokedAt,
	)
	if err != nil {
		return nil, domain.ErrTokenInvalid
	}
	return s, nil
}

func (r *sessionRepository) Revoke(ctx context.Context, sessionID uuid.UUID) error {
	_, err := r.db.Exec(ctx, `UPDATE sessions SET revoked_at = NOW() WHERE id = $1`, sessionID)
	return err
}

func (r *sessionRepository) RevokeAllForUser(ctx context.Context, userID uuid.UUID) error {
	_, err := r.db.Exec(ctx,
		`UPDATE sessions SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL`, userID)
	return err
}

func (r *sessionRepository) ListActiveByUser(ctx context.Context, userID uuid.UUID) ([]*domain.Session, error) {
	const q = `
		SELECT id, user_id, device_id, device_info, ip, created_at, expires_at, revoked_at
		FROM sessions
		WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > NOW()
		ORDER BY created_at DESC
		LIMIT 20
	`
	rows, err := r.db.Query(ctx, q, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	sessions := make([]*domain.Session, 0)
	for rows.Next() {
		s := &domain.Session{}
		if err := rows.Scan(&s.ID, &s.UserID, &s.DeviceID, &s.DeviceInfo,
			&s.IP, &s.CreatedAt, &s.ExpiresAt, &s.RevokedAt); err != nil {
			return nil, err
		}
		sessions = append(sessions, s)
	}
	return sessions, nil
}

func (r *sessionRepository) CountActive(ctx context.Context) (int, error) {
	var count int
	err := r.db.QueryRow(ctx,
		`SELECT COUNT(*) FROM sessions WHERE revoked_at IS NULL AND expires_at > NOW()`).
		Scan(&count)
	return count, err
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

func hashToken(rawToken string) string {
	h := sha256.Sum256([]byte(rawToken))
	return hex.EncodeToString(h[:])
}

func redisSessionKey(tokenHash string) string {
	return "session:" + tokenHash
}
