package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/omnilingo/omnilingo/services/identity/internal/domain"
)

// UserRepository defines the persistence contract for User entities.
type UserRepository interface {
	Create(ctx context.Context, u *domain.User) error
	FindByEmail(ctx context.Context, email string) (*domain.User, error)
	FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status domain.UserStatus) error
	SetEmailVerified(ctx context.Context, id uuid.UUID) error
	GetRoles(ctx context.Context, userID uuid.UUID) ([]domain.Role, error)
	// Brute force
	IncrementFailedLogin(ctx context.Context, id uuid.UUID) (int, error)
	ResetFailedLogin(ctx context.Context, id uuid.UUID) error
	SetLockedUntil(ctx context.Context, id uuid.UUID, until time.Time) error
	// Profile
	UpdateProfile(ctx context.Context, id uuid.UUID, req domain.UpdateMeRequest) error
	// GDPR
	MarkPendingDeletion(ctx context.Context, id uuid.UUID) error
	// Email verification
	CreateEmailVerification(ctx context.Context, ev *domain.EmailVerification) error
	FindEmailVerificationByHash(ctx context.Context, tokenHash string) (*domain.EmailVerification, error)
	MarkEmailVerificationUsed(ctx context.Context, id uuid.UUID) error
	// Password reset
	CreatePasswordResetToken(ctx context.Context, prt *domain.PasswordResetToken) error
	FindPasswordResetByHash(ctx context.Context, tokenHash string) (*domain.PasswordResetToken, error)
	MarkPasswordResetUsed(ctx context.Context, id uuid.UUID) error
	UpdatePasswordHash(ctx context.Context, userID uuid.UUID, newHash string) error
}

type userRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, u *domain.User) error {
	now := time.Now().UTC()
	u.CreatedAt = now
	u.UpdatedAt = now

	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("userRepo.Create begin tx: %w", err)
	}
	defer tx.Rollback(ctx) //nolint:errcheck

	const insertUser = `
		INSERT INTO users (id, email, password_hash, display_name, ui_language, timezone, status, email_verified, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`
	_, err = tx.Exec(ctx, insertUser,
		u.ID, u.Email, u.PasswordHash, u.DisplayName,
		u.UILanguage, u.Timezone, u.Status, u.EmailVerified,
		u.CreatedAt, u.UpdatedAt,
	)
	if err != nil {
		if isUniqueViolation(err) {
			return domain.ErrEmailTaken
		}
		return fmt.Errorf("userRepo.Create insert user: %w", err)
	}

	for _, role := range u.Roles {
		const assignRole = `
			INSERT INTO user_roles (user_id, role_id)
			SELECT $1, id FROM roles WHERE name = $2
			ON CONFLICT DO NOTHING
		`
		if _, err := tx.Exec(ctx, assignRole, u.ID, string(role)); err != nil {
			return fmt.Errorf("userRepo.Create assign role %s: %w", role, err)
		}
	}

	return tx.Commit(ctx)
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	const q = `
		SELECT id, email, password_hash, display_name, ui_language, timezone, status,
		       email_verified, mfa_enabled, failed_login_count, locked_until,
		       daily_goal_minutes, reminder_time, learning_languages,
		       created_at, updated_at
		FROM users WHERE email = $1 AND status != 'deleted'
	`
	u := &domain.User{}
	err := r.db.QueryRow(ctx, q, email).Scan(
		&u.ID, &u.Email, &u.PasswordHash, &u.DisplayName,
		&u.UILanguage, &u.Timezone, &u.Status,
		&u.EmailVerified, &u.MFAEnabled, &u.FailedLoginCount, &u.LockedUntil,
		&u.DailyGoalMinutes, &u.ReminderTime, &u.LearningLanguages,
		&u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrUserNotFound
		}
		return nil, fmt.Errorf("userRepo.FindByEmail: %w", err)
	}
	roles, err := r.GetRoles(ctx, u.ID)
	if err != nil {
		return nil, err
	}
	u.Roles = roles
	return u, nil
}

func (r *userRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	const q = `
		SELECT id, email, password_hash, display_name, ui_language, timezone, status,
		       email_verified, mfa_enabled, failed_login_count, locked_until,
		       daily_goal_minutes, reminder_time, learning_languages,
		       created_at, updated_at
		FROM users WHERE id = $1 AND status != 'deleted'
	`
	u := &domain.User{}
	err := r.db.QueryRow(ctx, q, id).Scan(
		&u.ID, &u.Email, &u.PasswordHash, &u.DisplayName,
		&u.UILanguage, &u.Timezone, &u.Status,
		&u.EmailVerified, &u.MFAEnabled, &u.FailedLoginCount, &u.LockedUntil,
		&u.DailyGoalMinutes, &u.ReminderTime, &u.LearningLanguages,
		&u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrUserNotFound
		}
		return nil, fmt.Errorf("userRepo.FindByID: %w", err)
	}
	roles, err := r.GetRoles(ctx, u.ID)
	if err != nil {
		return nil, err
	}
	u.Roles = roles
	return u, nil
}

func (r *userRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.UserStatus) error {
	_, err := r.db.Exec(ctx, `UPDATE users SET status=$1, updated_at=NOW() WHERE id=$2`, status, id)
	return err
}

func (r *userRepository) SetEmailVerified(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `UPDATE users SET email_verified=true, updated_at=NOW() WHERE id=$1`, id)
	return err
}

func (r *userRepository) GetRoles(ctx context.Context, userID uuid.UUID) ([]domain.Role, error) {
	const q = `
		SELECT r.name FROM roles r
		JOIN user_roles ur ON ur.role_id = r.id
		WHERE ur.user_id = $1
	`
	rows, err := r.db.Query(ctx, q, userID)
	if err != nil {
		return nil, fmt.Errorf("userRepo.GetRoles: %w", err)
	}
	defer rows.Close()

	roles := make([]domain.Role, 0)
	for rows.Next() {
		var role domain.Role
		if err := rows.Scan(&role); err != nil {
			return nil, err
		}
		roles = append(roles, role)
	}
	return roles, nil
}

// ─── Brute Force Protection ───────────────────────────────────────────────────

func (r *userRepository) IncrementFailedLogin(ctx context.Context, id uuid.UUID) (int, error) {
	var count int
	err := r.db.QueryRow(ctx,
		`UPDATE users SET failed_login_count = failed_login_count + 1, updated_at = NOW()
		 WHERE id = $1
		 RETURNING failed_login_count`,
		id,
	).Scan(&count)
	return count, err
}

func (r *userRepository) ResetFailedLogin(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx,
		`UPDATE users SET failed_login_count = 0, locked_until = NULL, updated_at = NOW() WHERE id = $1`,
		id,
	)
	return err
}

func (r *userRepository) SetLockedUntil(ctx context.Context, id uuid.UUID, until time.Time) error {
	_, err := r.db.Exec(ctx,
		`UPDATE users SET locked_until = $1, status = 'locked', updated_at = NOW() WHERE id = $2`,
		until, id,
	)
	return err
}

// ─── Profile Update ───────────────────────────────────────────────────────────

func (r *userRepository) UpdateProfile(ctx context.Context, id uuid.UUID, req domain.UpdateMeRequest) error {
	// Build dynamic update (only non-nil fields)
	sets := []string{"updated_at = NOW()"}
	args := []interface{}{}
	argIdx := 1

	if req.DisplayName != nil {
		sets = append(sets, fmt.Sprintf("display_name = $%d", argIdx))
		args = append(args, *req.DisplayName)
		argIdx++
	}
	if req.UILanguage != nil {
		sets = append(sets, fmt.Sprintf("ui_language = $%d", argIdx))
		args = append(args, *req.UILanguage)
		argIdx++
	}
	if req.Timezone != nil {
		sets = append(sets, fmt.Sprintf("timezone = $%d", argIdx))
		args = append(args, *req.Timezone)
		argIdx++
	}
	if req.AvatarURL != nil {
		sets = append(sets, fmt.Sprintf("avatar_url = $%d", argIdx))
		args = append(args, *req.AvatarURL)
		argIdx++
	}
	if req.DailyGoalMinutes != nil {
		sets = append(sets, fmt.Sprintf("daily_goal_minutes = $%d", argIdx))
		args = append(args, *req.DailyGoalMinutes)
		argIdx++
	}
	if req.ReminderTime != nil {
		sets = append(sets, fmt.Sprintf("reminder_time = $%d", argIdx))
		args = append(args, *req.ReminderTime)
		argIdx++
	}
	if req.LearningLanguages != nil {
		sets = append(sets, fmt.Sprintf("learning_languages = $%d", argIdx))
		args = append(args, req.LearningLanguages)
		argIdx++
	}

	args = append(args, id)
	query := fmt.Sprintf("UPDATE users SET %s WHERE id = $%d",
		joinStrings(sets, ", "), argIdx)

	_, err := r.db.Exec(ctx, query, args...)
	return err
}

// ─── GDPR Delete ─────────────────────────────────────────────────────────────

func (r *userRepository) MarkPendingDeletion(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx,
		`UPDATE users SET status = 'pending_deletion', email = NULL, updated_at = NOW() WHERE id = $1`,
		id,
	)
	return err
}

// ─── Email Verification ───────────────────────────────────────────────────────

func (r *userRepository) CreateEmailVerification(ctx context.Context, ev *domain.EmailVerification) error {
	_, err := r.db.Exec(ctx,
		`INSERT INTO email_verifications (id, user_id, token_hash, expires_at)
		 VALUES ($1, $2, $3, $4)`,
		ev.ID, ev.UserID, ev.TokenHash, ev.ExpiresAt,
	)
	return err
}

func (r *userRepository) FindEmailVerificationByHash(ctx context.Context, tokenHash string) (*domain.EmailVerification, error) {
	ev := &domain.EmailVerification{}
	err := r.db.QueryRow(ctx,
		`SELECT id, user_id, token_hash, expires_at, used_at, created_at
		 FROM email_verifications WHERE token_hash = $1`,
		tokenHash,
	).Scan(&ev.ID, &ev.UserID, &ev.TokenHash, &ev.ExpiresAt, &ev.UsedAt, &ev.ID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrVerificationInvalid
		}
		return nil, err
	}
	return ev, nil
}

func (r *userRepository) MarkEmailVerificationUsed(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx,
		`UPDATE email_verifications SET used_at = NOW() WHERE id = $1`,
		id,
	)
	return err
}

// ─── Password Reset ───────────────────────────────────────────────────────────

func (r *userRepository) CreatePasswordResetToken(ctx context.Context, prt *domain.PasswordResetToken) error {
	_, err := r.db.Exec(ctx,
		`INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at)
		 VALUES ($1, $2, $3, $4)`,
		prt.ID, prt.UserID, prt.TokenHash, prt.ExpiresAt,
	)
	return err
}

func (r *userRepository) FindPasswordResetByHash(ctx context.Context, tokenHash string) (*domain.PasswordResetToken, error) {
	prt := &domain.PasswordResetToken{}
	err := r.db.QueryRow(ctx,
		`SELECT id, user_id, token_hash, expires_at, used_at
		 FROM password_reset_tokens WHERE token_hash = $1`,
		tokenHash,
	).Scan(&prt.ID, &prt.UserID, &prt.TokenHash, &prt.ExpiresAt, &prt.UsedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrResetTokenInvalid
		}
		return nil, err
	}
	return prt, nil
}

func (r *userRepository) MarkPasswordResetUsed(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx,
		`UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1`,
		id,
	)
	return err
}

func (r *userRepository) UpdatePasswordHash(ctx context.Context, userID uuid.UUID, newHash string) error {
	_, err := r.db.Exec(ctx,
		`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
		newHash, userID,
	)
	return err
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

func isUniqueViolation(err error) bool {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		return pgErr.Code == "23505"
	}
	return false
}

func joinStrings(parts []string, sep string) string {
	result := ""
	for i, p := range parts {
		if i > 0 {
			result += sep
		}
		result += p
	}
	return result
}
