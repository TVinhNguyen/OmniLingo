package repository

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/omnilingo/billing-service/internal/domain"
	"github.com/omnilingo/pkg/pgxutil"
)

// NewPostgres creates a pgxpool connection pool (delegates to pkg/pgxutil).
func NewPostgres(ctx context.Context, dsn string) (*pgxpool.Pool, error) {
	return pgxutil.NewPool(ctx, dsn)
}

// RunMigrations runs all pending goose migrations (delegates to pkg/pgxutil).
func RunMigrations(dsn, dir string) error {
	return pgxutil.RunMigrations(dsn, dir)
}

// ─── Plan Repository ──────────────────────────────────────────────────────────

type PlanRepository interface {
	List(ctx context.Context, activeOnly bool) ([]*domain.Plan, error)
	GetByCode(ctx context.Context, code string) (*domain.Plan, error)
}

type planRepo struct{ db *pgxpool.Pool }

func NewPlanRepository(db *pgxpool.Pool) PlanRepository { return &planRepo{db: db} }

func (r *planRepo) List(ctx context.Context, activeOnly bool) ([]*domain.Plan, error) {
	q := `SELECT code, name, tier, price_cents, currency, interval, features, is_active FROM plans`
	if activeOnly { q += ` WHERE is_active=true` }
	q += ` ORDER BY price_cents ASC`
	rows, err := r.db.Query(ctx, q)
	if err != nil { return nil, err }
	defer rows.Close()
	var plans []*domain.Plan
	for rows.Next() {
		p := &domain.Plan{}
		var featJSON []byte
		if err := rows.Scan(&p.Code, &p.Name, &p.Tier, &p.PriceCents,
			&p.Currency, &p.Interval, &featJSON, &p.IsActive); err != nil { continue }
		_ = json.Unmarshal(featJSON, &p.Features)
		plans = append(plans, p)
	}
	return plans, nil
}

func (r *planRepo) GetByCode(ctx context.Context, code string) (*domain.Plan, error) {
	row := r.db.QueryRow(ctx, `SELECT code, name, tier, price_cents, currency, interval, features, is_active FROM plans WHERE code=$1`, code)
	p := &domain.Plan{}
	var featJSON []byte
	if err := row.Scan(&p.Code, &p.Name, &p.Tier, &p.PriceCents, &p.Currency, &p.Interval, &featJSON, &p.IsActive); err != nil {
		return nil, domain.ErrNotFound
	}
	_ = json.Unmarshal(featJSON, &p.Features)
	return p, nil
}

// ─── Subscription Repository ──────────────────────────────────────────────────

type SubscriptionRepository interface {
	Create(ctx context.Context, s *domain.Subscription) error
	GetByUser(ctx context.Context, userID uuid.UUID) (*domain.Subscription, error)
	GetByID(ctx context.Context, id uuid.UUID) (*domain.Subscription, error)
	GetByProviderID(ctx context.Context, provider, providerSubID string) (*domain.Subscription, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status domain.SubscriptionStatus, opts UpdateOpts) error
}

type UpdateOpts struct {
	ProviderSubID     *string
	CurrentPeriodEnd  *time.Time
	CanceledAt        *time.Time
	CancelAtPeriodEnd *bool
}

type subRepo struct{ db *pgxpool.Pool }

func NewSubscriptionRepository(db *pgxpool.Pool) SubscriptionRepository { return &subRepo{db: db} }

func (r *subRepo) Create(ctx context.Context, s *domain.Subscription) error {
	s.CreatedAt = time.Now().UTC()
	s.UpdatedAt = s.CreatedAt
	_, err := r.db.Exec(ctx, `
		INSERT INTO subscriptions
			(id, user_id, plan_code, status, provider, provider_sub_id, current_period_start, current_period_end, trial_end, cancel_at_period_end, created_at, updated_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11)`,
		s.ID, s.UserID, s.PlanCode, string(s.Status), s.Provider, s.ProviderSubID,
		s.CurrentPeriodStart, s.CurrentPeriodEnd, s.TrialEnd, s.CancelAtPeriodEnd, s.CreatedAt)
	return err
}

func (r *subRepo) GetByUser(ctx context.Context, userID uuid.UUID) (*domain.Subscription, error) {
	row := r.db.QueryRow(ctx, `
		SELECT id, user_id, plan_code, status, provider, provider_sub_id,
		       current_period_start, current_period_end, trial_end, cancel_at_period_end, canceled_at, created_at, updated_at
		FROM subscriptions WHERE user_id=$1 AND status NOT IN ('canceled','expired')
		ORDER BY created_at DESC LIMIT 1`, userID)
	return scanSub(row)
}

func (r *subRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Subscription, error) {
	row := r.db.QueryRow(ctx, `
		SELECT id, user_id, plan_code, status, provider, provider_sub_id,
		       current_period_start, current_period_end, trial_end, cancel_at_period_end, canceled_at, created_at, updated_at
		FROM subscriptions WHERE id=$1`, id)
	return scanSub(row)
}

func (r *subRepo) GetByProviderID(ctx context.Context, provider, providerSubID string) (*domain.Subscription, error) {
	row := r.db.QueryRow(ctx, `
		SELECT id, user_id, plan_code, status, provider, provider_sub_id,
		       current_period_start, current_period_end, trial_end, cancel_at_period_end, canceled_at, created_at, updated_at
		FROM subscriptions WHERE provider=$1 AND provider_sub_id=$2`, provider, providerSubID)
	return scanSub(row)
}

func (r *subRepo) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.SubscriptionStatus, opts UpdateOpts) error {
	_, err := r.db.Exec(ctx, `
		UPDATE subscriptions SET
			status=$1,
			provider_sub_id=COALESCE($2, provider_sub_id),
			current_period_end=COALESCE($3, current_period_end),
			canceled_at=COALESCE($4, canceled_at),
			cancel_at_period_end=COALESCE($5, cancel_at_period_end),
			updated_at=now()
		WHERE id=$6`,
		string(status), opts.ProviderSubID, opts.CurrentPeriodEnd, opts.CanceledAt, opts.CancelAtPeriodEnd, id)
	return err
}

type scannable interface {
	Scan(dest ...any) error
}

func scanSub(row scannable) (*domain.Subscription, error) {
	s := &domain.Subscription{}
	var providerSubID *string
	if err := row.Scan(&s.ID, &s.UserID, &s.PlanCode, &s.Status, &s.Provider,
		&providerSubID, &s.CurrentPeriodStart, &s.CurrentPeriodEnd,
		&s.TrialEnd, &s.CancelAtPeriodEnd, &s.CanceledAt, &s.CreatedAt, &s.UpdatedAt); err != nil {
		return nil, domain.ErrNotFound
	}
	if providerSubID != nil { s.ProviderSubID = *providerSubID }
	return s, nil
}

// ─── Invoice Repository ───────────────────────────────────────────────────────

type InvoiceRepository interface {
	Create(ctx context.Context, inv *domain.Invoice) error
	GetByID(ctx context.Context, id uuid.UUID) (*domain.Invoice, error)
	GetByProviderInvoiceID(ctx context.Context, providerInvoiceID string) (*domain.Invoice, error)
	ListByUser(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.Invoice, int, error)
	MarkPaid(ctx context.Context, id uuid.UUID, providerInvoiceID string) error
	MarkVoid(ctx context.Context, id uuid.UUID) error
}

type invoiceRepo struct{ db *pgxpool.Pool }

func NewInvoiceRepository(db *pgxpool.Pool) InvoiceRepository { return &invoiceRepo{db: db} }

func (r *invoiceRepo) Create(ctx context.Context, inv *domain.Invoice) error {
	inv.IssuedAt = time.Now().UTC()
	_, err := r.db.Exec(ctx, `
		INSERT INTO invoices (id, user_id, subscription_id, amount_cents, currency, status, provider_invoice_id, description, issued_at, due_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
		inv.ID, inv.UserID, inv.SubscriptionID, inv.AmountCents, inv.Currency,
		string(inv.Status), inv.ProviderInvoiceID, inv.Description, inv.IssuedAt, inv.DueAt)
	return err
}

func (r *invoiceRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Invoice, error) {
	row := r.db.QueryRow(ctx, `
		SELECT id, user_id, subscription_id, amount_cents, currency, status, provider_invoice_id, description, issued_at, paid_at, due_at
		FROM invoices WHERE id=$1`, id)
	inv := &domain.Invoice{}
	if err := row.Scan(&inv.ID, &inv.UserID, &inv.SubscriptionID, &inv.AmountCents,
		&inv.Currency, &inv.Status, &inv.ProviderInvoiceID, &inv.Description,
		&inv.IssuedAt, &inv.PaidAt, &inv.DueAt); err != nil {
		return nil, domain.ErrNotFound
	}
	return inv, nil
}

func (r *invoiceRepo) GetByProviderInvoiceID(ctx context.Context, providerInvoiceID string) (*domain.Invoice, error) {
	row := r.db.QueryRow(ctx, `
		SELECT id, user_id, subscription_id, amount_cents, currency, status, provider_invoice_id, description, issued_at, paid_at, due_at
		FROM invoices WHERE provider_invoice_id=$1 LIMIT 1`, providerInvoiceID)
	inv := &domain.Invoice{}
	if err := row.Scan(&inv.ID, &inv.UserID, &inv.SubscriptionID, &inv.AmountCents,
		&inv.Currency, &inv.Status, &inv.ProviderInvoiceID, &inv.Description,
		&inv.IssuedAt, &inv.PaidAt, &inv.DueAt); err != nil {
		return nil, domain.ErrNotFound
	}
	return inv, nil
}

func (r *invoiceRepo) ListByUser(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.Invoice, int, error) {
	var total int
	_ = r.db.QueryRow(ctx, `SELECT COUNT(*) FROM invoices WHERE user_id=$1`, userID).Scan(&total)
	rows, err := r.db.Query(ctx, `
		SELECT id, user_id, subscription_id, amount_cents, currency, status, provider_invoice_id, description, issued_at, paid_at, due_at
		FROM invoices WHERE user_id=$1 ORDER BY issued_at DESC LIMIT $2 OFFSET $3`, userID, limit, offset)
	if err != nil { return nil, 0, err }
	defer rows.Close()
	var list []*domain.Invoice
	for rows.Next() {
		inv := &domain.Invoice{}
		if err := rows.Scan(&inv.ID, &inv.UserID, &inv.SubscriptionID, &inv.AmountCents,
			&inv.Currency, &inv.Status, &inv.ProviderInvoiceID, &inv.Description,
			&inv.IssuedAt, &inv.PaidAt, &inv.DueAt); err != nil { continue }
		list = append(list, inv)
	}
	return list, total, nil
}

func (r *invoiceRepo) MarkPaid(ctx context.Context, id uuid.UUID, providerInvoiceID string) error {
	now := time.Now().UTC()
	_, err := r.db.Exec(ctx, `UPDATE invoices SET status='paid', paid_at=$1, provider_invoice_id=$2 WHERE id=$3`,
		now, providerInvoiceID, id)
	return err
}

func (r *invoiceRepo) MarkVoid(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `UPDATE invoices SET status='void' WHERE id=$1`, id)
	return err
}
