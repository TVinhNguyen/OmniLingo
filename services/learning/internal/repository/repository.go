package repository

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/omnilingo/learning-service/internal/domain"
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

// ─── Profile Repository ───────────────────────────────────────────────────────

type ProfileRepository interface {
	Get(ctx context.Context, userID uuid.UUID) (*domain.LearningProfile, error)
	Upsert(ctx context.Context, p *domain.LearningProfile) error
}

type profileRepo struct{ db *pgxpool.Pool }

func NewProfileRepository(db *pgxpool.Pool) ProfileRepository { return &profileRepo{db: db} }

func (r *profileRepo) Get(ctx context.Context, userID uuid.UUID) (*domain.LearningProfile, error) {
	row := r.db.QueryRow(ctx, `
		SELECT user_id, primary_language, secondary_languages, starting_level,
		       goals, preferences, daily_goal_minutes, reminder_time, learning_languages,
		       created_at, updated_at
		FROM user_learning_profiles WHERE user_id=$1`, userID)
	p := &domain.LearningProfile{}
	var goalsJSON, prefsJSON []byte
	if err := row.Scan(&p.UserID, &p.PrimaryLanguage, &p.SecondaryLanguages,
		&p.StartingLevel, &goalsJSON, &prefsJSON,
		&p.DailyGoalMinutes, &p.ReminderTime, &p.LearningLanguages,
		&p.CreatedAt, &p.UpdatedAt); err != nil {
		return nil, domain.ErrNotFound
	}
	_ = json.Unmarshal(goalsJSON, &p.Goals)
	_ = json.Unmarshal(prefsJSON, &p.Preferences)
	if p.LearningLanguages == nil { p.LearningLanguages = []string{} }
	return p, nil
}

func (r *profileRepo) Upsert(ctx context.Context, p *domain.LearningProfile) error {
	goalsJSON, _ := json.Marshal(p.Goals)
	prefsJSON, _ := json.Marshal(p.Preferences)
	if p.LearningLanguages == nil { p.LearningLanguages = []string{} }
	now := time.Now().UTC()
	_, err := r.db.Exec(ctx, `
		INSERT INTO user_learning_profiles
			(user_id, primary_language, secondary_languages, starting_level,
			 goals, preferences, daily_goal_minutes, reminder_time, learning_languages,
			 created_at, updated_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10)
		ON CONFLICT (user_id) DO UPDATE SET
			primary_language=EXCLUDED.primary_language,
			secondary_languages=EXCLUDED.secondary_languages,
			starting_level=EXCLUDED.starting_level,
			goals=EXCLUDED.goals,
			preferences=EXCLUDED.preferences,
			daily_goal_minutes=EXCLUDED.daily_goal_minutes,
			reminder_time=EXCLUDED.reminder_time,
			learning_languages=EXCLUDED.learning_languages,
			updated_at=EXCLUDED.updated_at`,
		p.UserID, p.PrimaryLanguage, p.SecondaryLanguages, p.StartingLevel,
		goalsJSON, prefsJSON, p.DailyGoalMinutes, p.ReminderTime, p.LearningLanguages, now)
	return err
}

// ─── Learning Path Repository ─────────────────────────────────────────────────

type PathRepository interface {
	Create(ctx context.Context, path *domain.LearningPath) error
	List(ctx context.Context, userID uuid.UUID) ([]*domain.LearningPath, error)
	GetByID(ctx context.Context, id uuid.UUID) (*domain.LearningPath, error)
	UpdateProgress(ctx context.Context, id uuid.UUID, currentUnit string, pct float64) error
}

type pathRepo struct{ db *pgxpool.Pool }

func NewPathRepository(db *pgxpool.Pool) PathRepository { return &pathRepo{db: db} }

func (r *pathRepo) Create(ctx context.Context, p *domain.LearningPath) error {
	now := time.Now().UTC()
	_, err := r.db.Exec(ctx, `
		INSERT INTO user_learning_paths (id, user_id, language, path_template_id, current_unit_id, progress_pct, created_at, updated_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$7)`,
		p.ID, p.UserID, p.Language, p.PathTemplateID, p.CurrentUnitID, p.ProgressPct, now)
	return err
}

func (r *pathRepo) List(ctx context.Context, userID uuid.UUID) ([]*domain.LearningPath, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, user_id, language, path_template_id, current_unit_id, progress_pct, created_at, updated_at
		FROM user_learning_paths WHERE user_id=$1 ORDER BY created_at DESC`, userID)
	if err != nil { return nil, err }
	defer rows.Close()
	var paths []*domain.LearningPath
	for rows.Next() {
		p := &domain.LearningPath{}
		if err := rows.Scan(&p.ID, &p.UserID, &p.Language, &p.PathTemplateID,
			&p.CurrentUnitID, &p.ProgressPct, &p.CreatedAt, &p.UpdatedAt); err != nil { continue }
		paths = append(paths, p)
	}
	return paths, nil
}

func (r *pathRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.LearningPath, error) {
	row := r.db.QueryRow(ctx, `
		SELECT id, user_id, language, path_template_id, current_unit_id, progress_pct, created_at, updated_at
		FROM user_learning_paths WHERE id=$1`, id)
	p := &domain.LearningPath{}
	if err := row.Scan(&p.ID, &p.UserID, &p.Language, &p.PathTemplateID,
		&p.CurrentUnitID, &p.ProgressPct, &p.CreatedAt, &p.UpdatedAt); err != nil {
		return nil, domain.ErrNotFound
	}
	return p, nil
}

func (r *pathRepo) UpdateProgress(ctx context.Context, id uuid.UUID, currentUnit string, pct float64) error {
	_, err := r.db.Exec(ctx, `UPDATE user_learning_paths SET current_unit_id=$1, progress_pct=$2, updated_at=now() WHERE id=$3`,
		currentUnit, pct, id)
	return err
}

// ─── Lesson Attempt Repository ────────────────────────────────────────────────

type AttemptRepository interface {
	Create(ctx context.Context, a *domain.LessonAttempt) error
	Complete(ctx context.Context, id int64, score float64, xp, timeSec int) (*domain.LessonAttempt, error)
	ListByUser(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.LessonAttempt, int, error)
	GetActive(ctx context.Context, userID uuid.UUID, lessonID string) (*domain.LessonAttempt, error)
}

type attemptRepo struct{ db *pgxpool.Pool }

func NewAttemptRepository(db *pgxpool.Pool) AttemptRepository { return &attemptRepo{db: db} }

func (r *attemptRepo) Create(ctx context.Context, a *domain.LessonAttempt) error {
	err := r.db.QueryRow(ctx, `
		INSERT INTO user_lesson_attempts (user_id, lesson_id, lesson_version, path_id, started_at)
		VALUES ($1,$2,$3,$4,$5) RETURNING id`,
		a.UserID, a.LessonID, a.LessonVersion, a.PathID, a.StartedAt).Scan(&a.ID)
	return err
}

func (r *attemptRepo) Complete(ctx context.Context, id int64, score float64, xp, timeSec int) (*domain.LessonAttempt, error) {
	now := time.Now().UTC()
	row := r.db.QueryRow(ctx, `
		UPDATE user_lesson_attempts
		SET completed_at=$1, score=$2, xp_earned=$3, time_spent_sec=$4
		WHERE id=$5
		RETURNING id, user_id, lesson_id, lesson_version, started_at, completed_at, score, xp_earned, time_spent_sec`,
		now, score, xp, timeSec, id)
	a := &domain.LessonAttempt{}
	if err := row.Scan(&a.ID, &a.UserID, &a.LessonID, &a.LessonVersion,
		&a.StartedAt, &a.CompletedAt, &a.Score, &a.XPEarned, &a.TimeSpentSec); err != nil {
		return nil, domain.ErrNotFound
	}
	return a, nil
}

func (r *attemptRepo) ListByUser(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.LessonAttempt, int, error) {
	var total int
	_ = r.db.QueryRow(ctx, `SELECT COUNT(*) FROM user_lesson_attempts WHERE user_id=$1`, userID).Scan(&total)
	rows, err := r.db.Query(ctx, `
		SELECT id, user_id, lesson_id, lesson_version, started_at, completed_at, score, xp_earned, time_spent_sec
		FROM user_lesson_attempts WHERE user_id=$1 ORDER BY started_at DESC LIMIT $2 OFFSET $3`,
		userID, limit, offset)
	if err != nil { return nil, 0, err }
	defer rows.Close()
	var list []*domain.LessonAttempt
	for rows.Next() {
		a := &domain.LessonAttempt{}
		if err := rows.Scan(&a.ID, &a.UserID, &a.LessonID, &a.LessonVersion,
			&a.StartedAt, &a.CompletedAt, &a.Score, &a.XPEarned, &a.TimeSpentSec); err != nil { continue }
		list = append(list, a)
	}
	return list, total, nil
}

func (r *attemptRepo) GetActive(ctx context.Context, userID uuid.UUID, lessonID string) (*domain.LessonAttempt, error) {
	row := r.db.QueryRow(ctx, `
		SELECT id, user_id, lesson_id, lesson_version, started_at
		FROM user_lesson_attempts
		WHERE user_id=$1 AND lesson_id=$2 AND completed_at IS NULL
		ORDER BY started_at DESC LIMIT 1`, userID, lessonID)
	a := &domain.LessonAttempt{}
	if err := row.Scan(&a.ID, &a.UserID, &a.LessonID, &a.LessonVersion, &a.StartedAt); err != nil {
		return nil, domain.ErrNotFound
	}
	return a, nil
}
