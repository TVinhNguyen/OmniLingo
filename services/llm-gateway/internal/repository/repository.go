package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/omnilingo/llm-gateway/internal/domain"
	"github.com/pressly/goose/v3"
)

func NewPostgres(ctx context.Context, dsn string) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		return nil, err
	}
	return pool, pool.Ping(ctx)
}

func RunMigrations(dsn, dir string) error {
	goose.SetDialect("postgres")
	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return err
	}
	db := stdlib.OpenDB(*cfg.ConnConfig)
	defer db.Close()
	return goose.Up(db, dir)
}

// ─── RequestLogRepository ─────────────────────────────────────────────────────

type RequestLogRepository interface {
	Insert(ctx context.Context, log *domain.LLMRequestLog) error
}

type logRepo struct{ db *pgxpool.Pool }

func NewRequestLogRepository(db *pgxpool.Pool) RequestLogRepository {
	return &logRepo{db: db}
}

func (r *logRepo) Insert(ctx context.Context, l *domain.LLMRequestLog) error {
	l.CreatedAt = time.Now().UTC()
	_, err := r.db.Exec(ctx, `
		INSERT INTO llm_request_logs
			(id, request_id, user_id, caller_service, provider, model,
			 prompt_tokens, output_tokens, cost_usd, cache_hit, latency_ms, error, created_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
		l.ID, l.RequestID, l.UserID, l.CallerSvc, string(l.Provider), l.Model,
		l.PromptTokens, l.OutputTokens, l.CostUSD, l.CacheHit, l.LatencyMs, l.Error, l.CreatedAt)
	return err
}

// ─── BudgetRepository ─────────────────────────────────────────────────────────

type BudgetRepository interface {
	Get(ctx context.Context, userID uuid.UUID, date string) (*domain.DailyBudget, error)
	IncrTokens(ctx context.Context, userID uuid.UUID, date string, tokens int) error
	SetLimit(ctx context.Context, userID uuid.UUID, limit int) error
}

type budgetRepo struct{ db *pgxpool.Pool }

func NewBudgetRepository(db *pgxpool.Pool) BudgetRepository {
	return &budgetRepo{db: db}
}

func (r *budgetRepo) Get(ctx context.Context, userID uuid.UUID, date string) (*domain.DailyBudget, error) {
	row := r.db.QueryRow(ctx, `
		SELECT tokens_used, tokens_limit FROM daily_budgets
		WHERE user_id=$1 AND date=$2`, userID, date)
	b := &domain.DailyBudget{UserID: userID, Date: date}
	if err := row.Scan(&b.TokensUsed, &b.TokensLimit); err != nil {
		if err == pgx.ErrNoRows {
			// No record → new user/new day: default free limit
			b.TokensLimit = 4000
			return b, nil
		}
		return nil, err
	}
	return b, nil
}

func (r *budgetRepo) IncrTokens(ctx context.Context, userID uuid.UUID, date string, tokens int) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO daily_budgets (user_id, date, tokens_used, tokens_limit, updated_at)
		VALUES ($1, $2, $3, 4000, now())
		ON CONFLICT (user_id, date) DO UPDATE
		SET tokens_used = daily_budgets.tokens_used + EXCLUDED.tokens_used,
		    updated_at  = now()`,
		userID, date, tokens)
	return err
}

func (r *budgetRepo) SetLimit(ctx context.Context, userID uuid.UUID, limit int) error {
	today := time.Now().UTC().Format("2006-01-02")
	_, err := r.db.Exec(ctx, `
		INSERT INTO daily_budgets (user_id, date, tokens_used, tokens_limit, updated_at)
		VALUES ($1, $2, 0, $3, now())
		ON CONFLICT (user_id, date) DO UPDATE
		SET tokens_limit = EXCLUDED.tokens_limit,
		    updated_at   = now()`,
		userID, today, limit)
	return err
}
