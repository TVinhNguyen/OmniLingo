package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/omnilingo/billing-service/internal/domain"
	"github.com/omnilingo/billing-service/internal/messaging"
	"github.com/omnilingo/billing-service/internal/repository"
	"github.com/omnilingo/pkg/outbox"
	"go.uber.org/zap"
)

// publishViaOutbox enqueues an event into the outbox (non-transactional, ADR-010 MVP1).
// For transactional inserts (HandlePaymentSuccess) the raw tx.Exec pattern is preserved.
func publishViaOutbox(ctx context.Context, ob *outbox.Repository, topic string, event any) error {
	return ob.Enqueue(ctx, topic, event)
}

const trialDays = 14

type BillingService interface {
	ListPlans(ctx context.Context) ([]*domain.Plan, error)
	GetPlan(ctx context.Context, code string) (*domain.Plan, error)

	GetSubscription(ctx context.Context, userID uuid.UUID) (*domain.Subscription, error)
	CreateSubscription(ctx context.Context, req CreateSubRequest) (*domain.Subscription, error)
	CancelSubscription(ctx context.Context, userID, subID uuid.UUID, immediately bool) error
	HandlePaymentSuccess(ctx context.Context, req PaymentSuccessRequest) error

	ListInvoices(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.Invoice, int, error)
	GetInvoice(ctx context.Context, userID, invoiceID uuid.UUID) (*domain.Invoice, error)
}

type CreateSubRequest struct {
	UserID        uuid.UUID
	PlanCode      string
	Provider      string
	ProviderSubID string
	TrialDays     int
}

type PaymentSuccessRequest struct {
	Provider           string
	ProviderSubID      string
	ProviderInvoiceID  string
	AmountCents        int
	Currency           string
	PeriodEnd          *time.Time
}

type billingService struct {
	db         *pgxpool.Pool
	planRepo   repository.PlanRepository
	subRepo    repository.SubscriptionRepository
	invRepo    repository.InvoiceRepository
	outbox     *outbox.Repository
	publisher  messaging.Publisher
	log        *zap.Logger
}

func NewBillingService(
	db *pgxpool.Pool,
	planRepo repository.PlanRepository,
	subRepo repository.SubscriptionRepository,
	invRepo repository.InvoiceRepository,
	outboxRepo *outbox.Repository,
	publisher messaging.Publisher,
	log *zap.Logger,
) BillingService {
	return &billingService{
		db: db, planRepo: planRepo, subRepo: subRepo, invRepo: invRepo,
		outbox: outboxRepo, publisher: publisher, log: log,
	}
}

func (s *billingService) ListPlans(ctx context.Context) ([]*domain.Plan, error) {
	return s.planRepo.List(ctx, true)
}

func (s *billingService) GetPlan(ctx context.Context, code string) (*domain.Plan, error) {
	return s.planRepo.GetByCode(ctx, code)
}

func (s *billingService) GetSubscription(ctx context.Context, userID uuid.UUID) (*domain.Subscription, error) {
	sub, err := s.subRepo.GetByUser(ctx, userID)
	if err != nil { return nil, domain.ErrNotFound }
	// Hydrate plan
	if plan, err := s.planRepo.GetByCode(ctx, sub.PlanCode); err == nil {
		sub.Plan = plan
	}
	return sub, nil
}

func (s *billingService) CreateSubscription(ctx context.Context, req CreateSubRequest) (*domain.Subscription, error) {
	plan, err := s.planRepo.GetByCode(ctx, req.PlanCode)
	if err != nil { return nil, domain.Errorf("PLAN_NOT_FOUND", "plan %q not found", req.PlanCode) }

	now := time.Now().UTC()
	trialDaysVal := req.TrialDays
	if trialDaysVal == 0 { trialDaysVal = trialDays }

	var trialEnd *time.Time
	status := domain.SubActive
	if plan.PriceCents > 0 && req.ProviderSubID == "" {
		// Trial for paid plans without an active provider sub
		t := now.AddDate(0, 0, trialDaysVal)
		trialEnd = &t
		status = domain.SubTrialing
	}

	periodStart := now
	var periodEnd *time.Time
	switch plan.Interval {
	case "month":
		t := now.AddDate(0, 1, 0)
		periodEnd = &t
	case "year":
		t := now.AddDate(1, 0, 0)
		periodEnd = &t
	}

	sub := &domain.Subscription{
		ID: uuid.New(), UserID: req.UserID, PlanCode: req.PlanCode,
		Status: status, Provider: req.Provider, ProviderSubID: req.ProviderSubID,
		CurrentPeriodStart: &periodStart, CurrentPeriodEnd: periodEnd, TrialEnd: trialEnd,
	}
	if err := s.subRepo.Create(ctx, sub); err != nil { return nil, domain.ErrInternalError }

	// Emit event
	event := domain.SubscriptionCreatedEvent{
		EventID: uuid.New().String(), UserID: req.UserID.String(),
		SubID: sub.ID.String(), PlanCode: plan.Code, Tier: plan.Tier,
		Status: string(status), CreatedAt: now,
	}
	payload, _ := json.Marshal(event)
	go func() {
		if err := s.publisher.Publish(context.Background(), "billing.subscription.created", payload); err != nil {
			s.log.Warn("publish billing.subscription.created failed", zap.Error(err))
		}
	}()
	sub.Plan = plan
	return sub, nil
}

func (s *billingService) CancelSubscription(ctx context.Context, userID, subID uuid.UUID, immediately bool) error {
	sub, err := s.subRepo.GetByID(ctx, subID)
	if err != nil { return domain.ErrNotFound }
	if sub.UserID != userID { return domain.ErrForbidden }
	if sub.Status == domain.SubCanceled { return domain.Errorf("ALREADY_CANCELED", "subscription already canceled") }

	now := time.Now().UTC()
	status := domain.SubCanceled
	opts := repository.UpdateOpts{CanceledAt: &now}
	if !immediately {
		status = sub.Status  // keep status, just set flag
		t := true
		opts = repository.UpdateOpts{CancelAtPeriodEnd: &t}
	}
	if err := s.subRepo.UpdateStatus(ctx, subID, status, opts); err != nil { return domain.ErrInternalError }

	event := domain.SubscriptionCanceledEvent{
		EventID: uuid.New().String(), UserID: userID.String(),
		SubID: subID.String(), CanceledAt: now,
	}
	payload, _ := json.Marshal(event)
	go func() {
		if err := s.publisher.Publish(context.Background(), "billing.subscription.canceled", payload); err != nil {
			s.log.Warn("publish billing.subscription.canceled failed", zap.Error(err))
		}
	}()
	return nil
}

// HandlePaymentSuccess processes a verified payment webhook.
// All writes (sub status update, invoice create, outbox insert) are wrapped
// in a single pgx transaction to guarantee atomicity.
func (s *billingService) HandlePaymentSuccess(ctx context.Context, req PaymentSuccessRequest) error {
	sub, err := s.subRepo.GetByProviderID(ctx, req.Provider, req.ProviderSubID)
	if err != nil { return domain.ErrNotFound }

	// Idempotency check: outside tx since we only read
	if req.ProviderInvoiceID != "" {
		if existing, _ := s.invRepo.GetByProviderInvoiceID(ctx, req.ProviderInvoiceID); existing != nil {
			s.log.Info("duplicate webhook ignored", zap.String("provider_invoice_id", req.ProviderInvoiceID))
			return &domain.DomainError{Code: "DUPLICATE", Message: "invoice already processed", StatusCode: 409}
		}
	}

	now := time.Now().UTC()

	// ─── Atomic transaction: sub update + invoice create + outbox insert ────
	inv := &domain.Invoice{
		ID: uuid.New(), UserID: sub.UserID, SubscriptionID: &sub.ID,
		AmountCents: req.AmountCents, Currency: req.Currency,
		Status: domain.InvoicePaid, ProviderInvoiceID: req.ProviderInvoiceID,
	}

	event := domain.InvoicePaidEvent{
		EventID: uuid.New().String(), UserID: sub.UserID.String(),
		InvoiceID: inv.ID.String(), AmountCents: req.AmountCents,
		Currency: req.Currency, PaidAt: now,
	}

	txErr := pgx.BeginTxFunc(ctx, s.db, pgx.TxOptions{IsoLevel: pgx.ReadCommitted}, func(tx pgx.Tx) error {
		// 1. Update subscription status
		_, err := tx.Exec(ctx, `
			UPDATE subscriptions SET
				status='active',
				current_period_end=COALESCE($1, current_period_end),
				updated_at=now()
			WHERE id=$2`, req.PeriodEnd, sub.ID)
		if err != nil { return fmt.Errorf("update sub status: %w", err) }

		// 2. Create invoice
		inv.IssuedAt = now
		_, err = tx.Exec(ctx, `
			INSERT INTO invoices (id, user_id, subscription_id, amount_cents, currency, status, provider_invoice_id, description, issued_at, paid_at)
			VALUES ($1,$2,$3,$4,$5,'paid',$6,$7,$8,$8)`,
			inv.ID, inv.UserID, inv.SubscriptionID, inv.AmountCents, inv.Currency,
			inv.ProviderInvoiceID, inv.Description, now)
		if err != nil { return fmt.Errorf("create invoice: %w", err) }

		// 3. Insert outbox event (same tx — guaranteed delivery)
		payload, err := json.Marshal(event)
		if err != nil { return fmt.Errorf("marshal outbox event: %w", err) }
		_, err = tx.Exec(ctx,
			`INSERT INTO outbox_events (id, topic, payload) VALUES ($1,$2,$3)`,
			uuid.New(), "billing.invoice.paid", payload)
		return err
	})

	if txErr != nil {
		s.log.Error("payment success transaction failed", zap.Error(txErr))
		return domain.ErrInternalError
	}
	return nil
}

func (s *billingService) ListInvoices(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.Invoice, int, error) {
	if limit <= 0 || limit > 50 { limit = 20 }
	return s.invRepo.ListByUser(ctx, userID, limit, offset)
}

func (s *billingService) GetInvoice(ctx context.Context, userID, invoiceID uuid.UUID) (*domain.Invoice, error) {
	inv, err := s.invRepo.GetByID(ctx, invoiceID)
	if err != nil { return nil, domain.ErrNotFound }
	if inv.UserID != userID { return nil, domain.ErrForbidden }
	return inv, nil
}
