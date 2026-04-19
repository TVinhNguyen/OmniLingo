package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/omnilingo/payment-service/internal/domain"
	"github.com/pressly/goose/v3"
)

// NewPostgres creates and validates a pgxpool connection.
func NewPostgres(ctx context.Context, dsn string) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		return nil, err
	}
	if err := pool.Ping(ctx); err != nil {
		return nil, err
	}
	return pool, nil
}

// RunMigrations runs goose up against the payment_db.
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

// ─── PaymentIntent Repository ──────────────────────────────────────────────────

type PaymentIntentRepository interface {
	Create(ctx context.Context, intent *domain.PaymentIntent) error
	GetByID(ctx context.Context, id uuid.UUID) (*domain.PaymentIntent, error)
	GetByProviderSession(ctx context.Context, provider domain.ProviderType, sessionID string) (*domain.PaymentIntent, error)
	GetByUserID(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.PaymentIntent, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status domain.IntentStatus) error
}

type intentRepo struct{ db *pgxpool.Pool }

func NewPaymentIntentRepository(db *pgxpool.Pool) PaymentIntentRepository {
	return &intentRepo{db: db}
}

func (r *intentRepo) Create(ctx context.Context, intent *domain.PaymentIntent) error {
	now := time.Now().UTC()
	intent.CreatedAt = now
	intent.UpdatedAt = now
	_, err := r.db.Exec(ctx, `
		INSERT INTO payment_intents
			(id, user_id, plan_code, provider, provider_session_id, amount_cents, currency, interval, status, return_url, metadata)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
		intent.ID, intent.UserID, intent.PlanCode, string(intent.Provider),
		intent.ProviderSessionID, intent.AmountCents, intent.Currency, intent.Interval,
		string(intent.Status), intent.ReturnURL, intent.Metadata)
	return err
}

func (r *intentRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.PaymentIntent, error) {
	row := r.db.QueryRow(ctx, `
		SELECT id, user_id, plan_code, provider, provider_session_id,
		       amount_cents, currency, interval, status, return_url, metadata, created_at, updated_at
		FROM payment_intents WHERE id=$1`, id)
	return scanIntent(row)
}

func (r *intentRepo) GetByProviderSession(ctx context.Context, provider domain.ProviderType, sessionID string) (*domain.PaymentIntent, error) {
	row := r.db.QueryRow(ctx, `
		SELECT id, user_id, plan_code, provider, provider_session_id,
		       amount_cents, currency, interval, status, return_url, metadata, created_at, updated_at
		FROM payment_intents WHERE provider=$1 AND provider_session_id=$2`,
		string(provider), sessionID)
	return scanIntent(row)
}

func (r *intentRepo) GetByUserID(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.PaymentIntent, error) {
	if limit <= 0 || limit > 50 {
		limit = 20
	}
	rows, err := r.db.Query(ctx, `
		SELECT id, user_id, plan_code, provider, provider_session_id,
		       amount_cents, currency, interval, status, return_url, metadata, created_at, updated_at
		FROM payment_intents WHERE user_id=$1
		ORDER BY created_at DESC LIMIT $2 OFFSET $3`, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var intents []*domain.PaymentIntent
	for rows.Next() {
		intent, err := scanIntent(rows)
		if err != nil {
			continue
		}
		intents = append(intents, intent)
	}
	return intents, nil
}

func (r *intentRepo) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.IntentStatus) error {
	_, err := r.db.Exec(ctx, `
		UPDATE payment_intents SET status=$1, updated_at=now() WHERE id=$2`,
		string(status), id)
	return err
}

type scannable interface{ Scan(dest ...any) error }

func scanIntent(row scannable) (*domain.PaymentIntent, error) {
	i := &domain.PaymentIntent{}
	var provider, status string
	var md map[string]string
	if err := row.Scan(
		&i.ID, &i.UserID, &i.PlanCode, &provider, &i.ProviderSessionID,
		&i.AmountCents, &i.Currency, &i.Interval, &status,
		&i.ReturnURL, &md, &i.CreatedAt, &i.UpdatedAt,
	); err != nil {
		return nil, domain.ErrNotFound
	}
	i.Provider = domain.ProviderType(provider)
	i.Status = domain.IntentStatus(status)
	i.Metadata = md
	return i, nil
}

// ─── WebhookEvent Repository (Idempotency Store) ──────────────────────────────

type WebhookEventRepository interface {
	// InsertIfNew inserts the webhook event and returns (true, nil) if it was new.
	// Returns (false, nil) if already exists (duplicate — caller should skip).
	InsertIfNew(ctx context.Context, event *domain.WebhookEvent) (isNew bool, err error)
	MarkProcessed(ctx context.Context, id string) error
	MarkFailed(ctx context.Context, id, errMsg string) error
}

type webhookRepo struct{ db *pgxpool.Pool }

func NewWebhookEventRepository(db *pgxpool.Pool) WebhookEventRepository {
	return &webhookRepo{db: db}
}

func (r *webhookRepo) InsertIfNew(ctx context.Context, event *domain.WebhookEvent) (bool, error) {
	tag, err := r.db.Exec(ctx, `
		INSERT INTO webhook_events (id, provider, event_type, payload, status)
		VALUES ($1, $2, $3, $4, 'pending')
		ON CONFLICT (id) DO NOTHING`,
		event.ID, string(event.Provider), event.EventType, event.Payload)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() == 1, nil
}

func (r *webhookRepo) MarkProcessed(ctx context.Context, id string) error {
	now := time.Now().UTC()
	_, err := r.db.Exec(ctx, `
		UPDATE webhook_events SET status='processed', processed_at=$1 WHERE id=$2`,
		now, id)
	return err
}

func (r *webhookRepo) MarkFailed(ctx context.Context, id, errMsg string) error {
	_, err := r.db.Exec(ctx, `
		UPDATE webhook_events SET status='failed', error_message=$1 WHERE id=$2`,
		errMsg, id)
	return err
}

// ─── PaymentTransaction Repository ────────────────────────────────────────────

type PaymentTransactionRepository interface {
	Create(ctx context.Context, tx *domain.PaymentTransaction) error
	GetByProviderCharge(ctx context.Context, provider domain.ProviderType, chargeID string) (*domain.PaymentTransaction, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status domain.TransactionStatus) error
}

type txRepo struct{ db *pgxpool.Pool }

func NewPaymentTransactionRepository(db *pgxpool.Pool) PaymentTransactionRepository {
	return &txRepo{db: db}
}

func (r *txRepo) Create(ctx context.Context, tx *domain.PaymentTransaction) error {
	tx.CreatedAt = time.Now().UTC()
	tx.UpdatedAt = tx.CreatedAt
	_, err := r.db.Exec(ctx, `
		INSERT INTO payment_transactions
			(id, payment_intent_id, provider, provider_charge_id, amount_cents, currency, status,
			 refund_id, refund_amount_cents, failure_code, failure_message)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
		tx.ID, tx.PaymentIntentID, string(tx.Provider), tx.ProviderChargeID,
		tx.AmountCents, tx.Currency, string(tx.Status),
		tx.RefundID, tx.RefundAmountCents, tx.FailureCode, tx.FailureMessage)
	return err
}

func (r *txRepo) GetByProviderCharge(ctx context.Context, provider domain.ProviderType, chargeID string) (*domain.PaymentTransaction, error) {
	row := r.db.QueryRow(ctx, `
		SELECT id, payment_intent_id, provider, provider_charge_id, amount_cents, currency, status,
		       refund_id, refund_amount_cents, failure_code, failure_message, created_at, updated_at
		FROM payment_transactions WHERE provider=$1 AND provider_charge_id=$2`,
		string(provider), chargeID)
	tx := &domain.PaymentTransaction{}
	var provider2, status string
	if err := row.Scan(
		&tx.ID, &tx.PaymentIntentID, &provider2, &tx.ProviderChargeID,
		&tx.AmountCents, &tx.Currency, &status,
		&tx.RefundID, &tx.RefundAmountCents, &tx.FailureCode, &tx.FailureMessage,
		&tx.CreatedAt, &tx.UpdatedAt,
	); err != nil {
		return nil, domain.ErrNotFound
	}
	tx.Provider = domain.ProviderType(provider2)
	tx.Status = domain.TransactionStatus(status)
	return tx, nil
}

func (r *txRepo) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.TransactionStatus) error {
	_, err := r.db.Exec(ctx, `
		UPDATE payment_transactions SET status=$1, updated_at=now() WHERE id=$2`,
		string(status), id)
	return err
}

// ─── Atomic transaction helper ────────────────────────────────────────────────

// WithTx executes fn inside a pgx transaction. Rolls back on error.
func WithTx(ctx context.Context, pool *pgxpool.Pool, fn func(pgx.Tx) error) error {
	return pgx.BeginTxFunc(ctx, pool, pgx.TxOptions{IsoLevel: pgx.ReadCommitted}, fn)
}
