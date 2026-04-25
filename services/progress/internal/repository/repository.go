package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/omnilingo/progress-service/internal/domain"
	"github.com/pressly/goose/v3"
)

// NewPostgres creates connection pool.
func NewPostgres(ctx context.Context, dsn string) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, dsn)
	if err != nil { return nil, err }
	if err := pool.Ping(ctx); err != nil { return nil, err }
	return pool, nil
}

// RunMigrations runs goose up using pgx stdlib.
func RunMigrations(dsn, dir string) error {
	goose.SetDialect("postgres")
	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil { return err }
	db := stdlib.OpenDB(*cfg.ConnConfig)
	defer db.Close()
	return goose.Up(db, dir)
}

// ─── SkillScore Repository ────────────────────────────────────────────────────

type SkillScoreRepository interface {
	Upsert(ctx context.Context, s *domain.SkillScore) error
	// UpsertWithHistory atomically upserts a skill score AND inserts a history entry.
	UpsertWithHistory(ctx context.Context, s *domain.SkillScore, entry *domain.ScoreHistoryEntry) error
	GetSkillScore(ctx context.Context, userID uuid.UUID, language, skill string) (*domain.SkillScore, error)
	GetOverview(ctx context.Context, userID uuid.UUID, language string) ([]*domain.SkillScore, error)
	RecordHistory(ctx context.Context, entry *domain.ScoreHistoryEntry) error
	GetHistory(ctx context.Context, userID uuid.UUID, language, skill string, limit int) ([]*domain.ScoreHistoryEntry, error)
}

type skillScoreRepo struct{ db *pgxpool.Pool }

func NewSkillScoreRepository(db *pgxpool.Pool) SkillScoreRepository {
	return &skillScoreRepo{db: db}
}

func (r *skillScoreRepo) Upsert(ctx context.Context, s *domain.SkillScore) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO skill_scores (user_id, language, skill, score, ci_low, ci_high, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (user_id, language, skill) DO UPDATE SET
			score=EXCLUDED.score, ci_low=EXCLUDED.ci_low, ci_high=EXCLUDED.ci_high, updated_at=EXCLUDED.updated_at`,
		s.UserID, s.Language, string(s.Skill), s.Score, s.CILow, s.CIHigh, s.UpdatedAt)
	return err
}

// UpsertWithHistory atomically upserts a skill score and inserts a history entry in one transaction.
func (r *skillScoreRepo) UpsertWithHistory(ctx context.Context, s *domain.SkillScore, entry *domain.ScoreHistoryEntry) error {
	return pgx.BeginTxFunc(ctx, r.db, pgx.TxOptions{IsoLevel: pgx.ReadCommitted}, func(tx pgx.Tx) error {
		_, err := tx.Exec(ctx, `
			INSERT INTO skill_scores (user_id, language, skill, score, ci_low, ci_high, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			ON CONFLICT (user_id, language, skill) DO UPDATE SET
				score=EXCLUDED.score, ci_low=EXCLUDED.ci_low, ci_high=EXCLUDED.ci_high, updated_at=EXCLUDED.updated_at`,
			s.UserID, s.Language, string(s.Skill), s.Score, s.CILow, s.CIHigh, s.UpdatedAt)
		if err != nil { return err }

		_, err = tx.Exec(ctx, `
			INSERT INTO skill_score_history (user_id, language, skill, score, delta, event_ref, recorded_at)
			VALUES ($1,$2,$3,$4,$5,$6,$7)`,
			entry.UserID, entry.Language, string(entry.Skill), entry.Score, entry.Delta, entry.EventRef, entry.RecordedAt)
		return err
	})
}


func (r *skillScoreRepo) GetSkillScore(ctx context.Context, userID uuid.UUID, language, skill string) (*domain.SkillScore, error) {
	row := r.db.QueryRow(ctx, `
		SELECT user_id, language, skill, score, ci_low, ci_high, updated_at
		FROM skill_scores WHERE user_id=$1 AND language=$2 AND skill=$3`, userID, language, skill)
	s := &domain.SkillScore{}
	if err := row.Scan(&s.UserID, &s.Language, &s.Skill, &s.Score, &s.CILow, &s.CIHigh, &s.UpdatedAt); err != nil {
		return nil, domain.ErrNotFound
	}
	return s, nil
}

func (r *skillScoreRepo) GetOverview(ctx context.Context, userID uuid.UUID, language string) ([]*domain.SkillScore, error) {
	rows, err := r.db.Query(ctx, `
		SELECT user_id, language, skill, score, ci_low, ci_high, updated_at
		FROM skill_scores WHERE user_id=$1 AND language=$2`, userID, language)
	if err != nil { return nil, err }
	defer rows.Close()
	var scores []*domain.SkillScore
	for rows.Next() {
		s := &domain.SkillScore{}
		if err := rows.Scan(&s.UserID, &s.Language, &s.Skill, &s.Score, &s.CILow, &s.CIHigh, &s.UpdatedAt); err != nil { continue }
		scores = append(scores, s)
	}
	return scores, nil
}

func (r *skillScoreRepo) RecordHistory(ctx context.Context, e *domain.ScoreHistoryEntry) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO skill_score_history (user_id, language, skill, score, delta, event_ref, recorded_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7)`,
		e.UserID, e.Language, string(e.Skill), e.Score, e.Delta, e.EventRef, e.RecordedAt)
	return err
}

func (r *skillScoreRepo) GetHistory(ctx context.Context, userID uuid.UUID, language, skill string, limit int) ([]*domain.ScoreHistoryEntry, error) {
	if limit <= 0 || limit > 90 { limit = 30 }
	rows, err := r.db.Query(ctx, `
		SELECT id, user_id, language, skill, score, delta, event_ref, recorded_at
		FROM skill_score_history WHERE user_id=$1 AND language=$2 AND skill=$3
		ORDER BY recorded_at DESC LIMIT $4`, userID, language, skill, limit)
	if err != nil { return nil, err }
	defer rows.Close()
	var entries []*domain.ScoreHistoryEntry
	for rows.Next() {
		e := &domain.ScoreHistoryEntry{}
		var eventRef string
		if err := rows.Scan(&e.ID, &e.UserID, &e.Language, &e.Skill, &e.Score, &e.Delta, &eventRef, &e.RecordedAt); err != nil { continue }
		e.EventRef = eventRef
		entries = append(entries, e)
	}
	return entries, nil
}

// ─── CertPrediction Repository ────────────────────────────────────────────────

type CertPredictionRepository interface {
	Upsert(ctx context.Context, p *domain.CertPrediction) error
	GetByUser(ctx context.Context, userID uuid.UUID) ([]*domain.CertPrediction, error)
	GetByUserAndCert(ctx context.Context, userID uuid.UUID, certCode string) (*domain.CertPrediction, error)
}

type certPredictionRepo struct{ db *pgxpool.Pool }

func NewCertPredictionRepository(db *pgxpool.Pool) CertPredictionRepository {
	return &certPredictionRepo{db: db}
}

func (r *certPredictionRepo) Upsert(ctx context.Context, p *domain.CertPrediction) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO cert_predictions (user_id, cert_code, predicted_score, predicted_band, model_version, computed_at)
		VALUES ($1,$2,$3,$4,$5,$6)
		ON CONFLICT (user_id, cert_code) DO UPDATE SET
			predicted_score=EXCLUDED.predicted_score, predicted_band=EXCLUDED.predicted_band,
			model_version=EXCLUDED.model_version, computed_at=EXCLUDED.computed_at`,
		p.UserID, p.CertCode, p.PredictedScore, p.PredictedBand, p.ModelVersion, p.ComputedAt)
	return err
}

func (r *certPredictionRepo) GetByUser(ctx context.Context, userID uuid.UUID) ([]*domain.CertPrediction, error) {
	rows, err := r.db.Query(ctx, `
		SELECT user_id, cert_code, predicted_score, predicted_band, model_version, computed_at
		FROM cert_predictions WHERE user_id=$1 ORDER BY cert_code`, userID)
	if err != nil { return nil, err }
	defer rows.Close()
	var preds []*domain.CertPrediction
	for rows.Next() {
		p := &domain.CertPrediction{}
		if err := rows.Scan(&p.UserID, &p.CertCode, &p.PredictedScore, &p.PredictedBand, &p.ModelVersion, &p.ComputedAt); err != nil { continue }
		preds = append(preds, p)
	}
	return preds, nil
}

func (r *certPredictionRepo) GetByUserAndCert(ctx context.Context, userID uuid.UUID, certCode string) (*domain.CertPrediction, error) {
	row := r.db.QueryRow(ctx, `
		SELECT user_id, cert_code, predicted_score, predicted_band, model_version, computed_at
		FROM cert_predictions WHERE user_id=$1 AND cert_code=$2`, userID, certCode)
	p := &domain.CertPrediction{}
	if err := row.Scan(&p.UserID, &p.CertCode, &p.PredictedScore, &p.PredictedBand, &p.ModelVersion, &p.ComputedAt); err != nil {
		return nil, domain.ErrNotFound
	}
	return p, nil
}

// timePtr helper
func timePtr(t time.Time) *time.Time { return &t }

// ─── Activity Daily Repository ────────────────────────────────────────────────

// ActivityDailyRepository aggregates daily study activity for the heatmap UI.
type ActivityDailyRepository interface {
	GetHeatmap(ctx context.Context, userID uuid.UUID, days int) ([]*domain.ActivityDay, error)
	// Upsert is called whenever a lesson is completed; increments the daily counters atomically.
	Upsert(ctx context.Context, userID uuid.UUID, minutes, xp, lessonsCompleted int) error
}

type activityDailyRepo struct{ db *pgxpool.Pool }

func NewActivityDailyRepository(db *pgxpool.Pool) ActivityDailyRepository {
	return &activityDailyRepo{db: db}
}

func (r *activityDailyRepo) GetHeatmap(ctx context.Context, userID uuid.UUID, days int) ([]*domain.ActivityDay, error) {
	const q = `
		SELECT date::text, minutes_studied, xp_earned, lessons_done
		FROM user_activity_daily
		WHERE user_id = $1 AND date >= CURRENT_DATE - ($2 - 1)
		ORDER BY date DESC
	`
	rows, err := r.db.Query(ctx, q, userID, days)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []*domain.ActivityDay
	for rows.Next() {
		a := &domain.ActivityDay{}
		if err := rows.Scan(&a.Date, &a.Minutes, &a.Xp, &a.LessonsCompleted); err != nil {
			continue
		}
		items = append(items, a)
	}
	if items == nil {
		items = []*domain.ActivityDay{}
	}
	return items, nil
}

func (r *activityDailyRepo) Upsert(ctx context.Context, userID uuid.UUID, minutes, xp, lessonsCompleted int) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO user_activity_daily (user_id, date, minutes_studied, xp_earned, lessons_done, updated_at)
		VALUES ($1, CURRENT_DATE, $2, $3, $4, NOW())
		ON CONFLICT (user_id, date)
		DO UPDATE SET
			minutes_studied = user_activity_daily.minutes_studied + EXCLUDED.minutes_studied,
			xp_earned       = user_activity_daily.xp_earned + EXCLUDED.xp_earned,
			lessons_done    = user_activity_daily.lessons_done + EXCLUDED.lessons_done,
			updated_at      = NOW()
	`, userID, minutes, xp, lessonsCompleted)
	return err
}
