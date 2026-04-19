package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/omnilingo/gamification-service/internal/domain"
	"github.com/pressly/goose/v3"
)

func NewPostgres(ctx context.Context, dsn string) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, dsn)
	if err != nil { return nil, err }
	if err := pool.Ping(ctx); err != nil { return nil, err }
	return pool, nil
}

func RunMigrations(dsn, dir string) error {
	goose.SetDialect("postgres")
	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil { return err }
	db := stdlib.OpenDB(*cfg.ConnConfig)
	defer db.Close()
	return goose.Up(db, dir)
}

// ─── XP Repository ────────────────────────────────────────────────────────────

type XPRepository interface {
	GetOrCreate(ctx context.Context, userID uuid.UUID) (*domain.UserXP, error)
	AddXP(ctx context.Context, userID uuid.UUID, xp int64) (*domain.UserXP, error)
}

type xpRepo struct{ db *pgxpool.Pool }

func NewXPRepository(db *pgxpool.Pool) XPRepository { return &xpRepo{db: db} }

func (r *xpRepo) GetOrCreate(ctx context.Context, userID uuid.UUID) (*domain.UserXP, error) {
	_, _ = r.db.Exec(ctx, `
		INSERT INTO user_xp (user_id, total_xp, level) VALUES ($1, 0, 1)
		ON CONFLICT (user_id) DO NOTHING`, userID)
	row := r.db.QueryRow(ctx, `SELECT user_id, total_xp, level, updated_at FROM user_xp WHERE user_id=$1`, userID)
	u := &domain.UserXP{}
	if err := row.Scan(&u.UserID, &u.TotalXP, &u.Level, &u.UpdatedAt); err != nil {
		return nil, domain.ErrNotFound
	}
	return u, nil
}

func (r *xpRepo) AddXP(ctx context.Context, userID uuid.UUID, xp int64) (*domain.UserXP, error) {
	row := r.db.QueryRow(ctx, `
		INSERT INTO user_xp (user_id, total_xp, level, updated_at) VALUES ($1, $2, 1, now())
		ON CONFLICT (user_id) DO UPDATE
			SET total_xp = user_xp.total_xp + $2, updated_at = now()
		RETURNING user_id, total_xp, level, updated_at`, userID, xp)
	u := &domain.UserXP{}
	if err := row.Scan(&u.UserID, &u.TotalXP, &u.Level, &u.UpdatedAt); err != nil {
		return nil, err
	}
	// Recompute level
	newLevel := domain.XPToLevel(u.TotalXP)
	if newLevel != u.Level {
		u.Level = newLevel
		_, _ = r.db.Exec(ctx, `UPDATE user_xp SET level=$1 WHERE user_id=$2`, newLevel, userID)
	}
	return u, nil
}

// ─── Streak Repository ────────────────────────────────────────────────────────

type StreakRepository interface {
	GetOrCreate(ctx context.Context, userID uuid.UUID) (*domain.UserStreak, error)
	UpdateStreak(ctx context.Context, userID uuid.UUID, today string) (*domain.UserStreak, error)
	Freeze(ctx context.Context, userID uuid.UUID) error
}

type streakRepo struct{ db *pgxpool.Pool }

func NewStreakRepository(db *pgxpool.Pool) StreakRepository { return &streakRepo{db: db} }

func (r *streakRepo) GetOrCreate(ctx context.Context, userID uuid.UUID) (*domain.UserStreak, error) {
	_, _ = r.db.Exec(ctx, `
		INSERT INTO user_streaks (user_id, current, longest) VALUES ($1, 0, 0)
		ON CONFLICT (user_id) DO NOTHING`, userID)
	return r.get(ctx, userID)
}

func (r *streakRepo) get(ctx context.Context, userID uuid.UUID) (*domain.UserStreak, error) {
	row := r.db.QueryRow(ctx, `
		SELECT user_id, current, longest, last_active_date::TEXT, freezes_left
		FROM user_streaks WHERE user_id=$1`, userID)
	s := &domain.UserStreak{}
	var dateStr *string
	if err := row.Scan(&s.UserID, &s.Current, &s.Longest, &dateStr, &s.FreezesLeft); err != nil {
		return nil, domain.ErrNotFound
	}
	s.LastActiveDate = dateStr
	return s, nil
}

func (r *streakRepo) UpdateStreak(ctx context.Context, userID uuid.UUID, today string) (*domain.UserStreak, error) {
	streak, _ := r.GetOrCreate(ctx, userID)
	newCurrent := streak.Current
	if streak.LastActiveDate == nil || *streak.LastActiveDate == "" {
		newCurrent = 1
	} else if *streak.LastActiveDate == today {
		// Already recorded today
		return streak, nil
	} else {
		// Check if yesterday
		last, _ := time.Parse("2006-01-02", *streak.LastActiveDate)
		t, _ := time.Parse("2006-01-02", today)
		diff := t.Sub(last)
		if diff.Hours() <= 48 {
			newCurrent++
		} else {
			newCurrent = 1 // reset
		}
	}
	longest := streak.Longest
	if newCurrent > longest { longest = newCurrent }

	_, err := r.db.Exec(ctx, `
		UPDATE user_streaks SET current=$1, longest=$2, last_active_date=$3 WHERE user_id=$4`,
		newCurrent, longest, today, userID)
	if err != nil { return nil, err }
	return r.get(ctx, userID)
}

func (r *streakRepo) Freeze(ctx context.Context, userID uuid.UUID) error {
	res, err := r.db.Exec(ctx, `
		UPDATE user_streaks SET freezes_left = freezes_left - 1
		WHERE user_id=$1 AND freezes_left > 0`, userID)
	if err != nil { return err }
	if res.RowsAffected() == 0 { return domain.Errorf("NO_FREEZES", "no streak freezes available") }
	return nil
}

// ─── Achievement Repository ───────────────────────────────────────────────────

type AchievementRepository interface {
	ListAll(ctx context.Context) ([]*domain.Achievement, error)
	ListByUser(ctx context.Context, userID uuid.UUID) ([]*domain.UserAchievement, error)
	Award(ctx context.Context, userID uuid.UUID, code string) error
	HasAchievement(ctx context.Context, userID uuid.UUID, code string) bool
}

type achievementRepo struct{ db *pgxpool.Pool }

func NewAchievementRepository(db *pgxpool.Pool) AchievementRepository { return &achievementRepo{db: db} }

func (r *achievementRepo) ListAll(ctx context.Context) ([]*domain.Achievement, error) {
	rows, err := r.db.Query(ctx, `SELECT code, name, description, icon, xp_reward FROM achievements ORDER BY xp_reward`)
	if err != nil { return nil, err }
	defer rows.Close()
	var achs []*domain.Achievement
	for rows.Next() {
		a := &domain.Achievement{}
		if err := rows.Scan(&a.Code, &a.Name, &a.Description, &a.Icon, &a.XPReward); err != nil { continue }
		achs = append(achs, a)
	}
	return achs, nil
}

func (r *achievementRepo) ListByUser(ctx context.Context, userID uuid.UUID) ([]*domain.UserAchievement, error) {
	rows, err := r.db.Query(ctx, `
		SELECT ua.user_id, ua.achievement_code, a.name, a.description, a.icon, a.xp_reward, ua.earned_at
		FROM user_achievements ua
		JOIN achievements a ON a.code = ua.achievement_code
		WHERE ua.user_id=$1 ORDER BY ua.earned_at DESC`, userID)
	if err != nil { return nil, err }
	defer rows.Close()
	var list []*domain.UserAchievement
	for rows.Next() {
		ua := &domain.UserAchievement{}
		if err := rows.Scan(&ua.UserID, &ua.AchievementCode,
			&ua.Achievement.Name, &ua.Achievement.Description, &ua.Achievement.Icon, &ua.Achievement.XPReward,
			&ua.EarnedAt); err != nil { continue }
		ua.Achievement.Code = ua.AchievementCode
		list = append(list, ua)
	}
	return list, nil
}

func (r *achievementRepo) Award(ctx context.Context, userID uuid.UUID, code string) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO user_achievements (user_id, achievement_code) VALUES ($1, $2)
		ON CONFLICT DO NOTHING`, userID, code)
	return err
}

func (r *achievementRepo) HasAchievement(ctx context.Context, userID uuid.UUID, code string) bool {
	var count int
	_ = r.db.QueryRow(ctx, `SELECT COUNT(*) FROM user_achievements WHERE user_id=$1 AND achievement_code=$2`, userID, code).Scan(&count)
	return count > 0
}
