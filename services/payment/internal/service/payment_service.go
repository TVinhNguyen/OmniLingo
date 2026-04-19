package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/omnilingo/payment-service/internal/domain"
	"github.com/omnilingo/payment-service/internal/messaging"
	"github.com/omnilingo/payment-service/internal/provider"
	"github.com/omnilingo/payment-service/internal/repository"
	"go.uber.org/zap"
)

// ─── Input Requests ────────────────────────────────────────────────────────────

// CreateCheckoutRequest is the input for initiating a payment.
type CreateCheckoutRequest struct {
	UserID      uuid.UUID
	PlanCode    string
	PriceID     string // provider-specific price/product code
	Provider    domain.ProviderType
	AmountCents int
	Currency    string
	Interval    string // "month" | "year"
	ReturnURL   string
	CancelURL   string
}

// HandleWebhookRequest wraps raw webhook data from a provider.
type HandleWebhookRequest struct {
	Provider  domain.ProviderType
	RawBody   []byte
	Signature string
}

// ─── Service Interface ─────────────────────────────────────────────────────────

// PaymentService is the main business logic interface for payment-service.
type PaymentService interface {
	// CreateCheckout creates a checkout session with the provider and persists the intent.
	CreateCheckout(ctx context.Context, req CreateCheckoutRequest) (*domain.PaymentIntent, error)
	// GetIntent returns a payment intent by ID (user-scoped for security).
	GetIntent(ctx context.Context, userID, intentID uuid.UUID) (*domain.PaymentIntent, error)
	// HandleWebhook processes a provider IPN/webhook with idempotency guarantees.
	HandleWebhook(ctx context.Context, req HandleWebhookRequest) error
}

// ─── Implementation ────────────────────────────────────────────────────────────

type paymentService struct {
	db          *pgxpool.Pool
	intentRepo  repository.PaymentIntentRepository
	webhookRepo repository.WebhookEventRepository
	txRepo      repository.PaymentTransactionRepository
	outboxRepo  repository.OutboxRepository
	providers   *provider.Registry
	publisher   messaging.Publisher
	log         *zap.Logger
}

func NewPaymentService(
	db *pgxpool.Pool,
	intentRepo repository.PaymentIntentRepository,
	webhookRepo repository.WebhookEventRepository,
	txRepo repository.PaymentTransactionRepository,
	outboxRepo repository.OutboxRepository,
	providers *provider.Registry,
	publisher messaging.Publisher,
	log *zap.Logger,
) PaymentService {
	return &paymentService{
		db:          db,
		intentRepo:  intentRepo,
		webhookRepo: webhookRepo,
		txRepo:      txRepo,
		outboxRepo:  outboxRepo,
		providers:   providers,
		publisher:   publisher,
		log:         log,
	}
}

// ─── CreateCheckout ────────────────────────────────────────────────────────────

func (s *paymentService) CreateCheckout(ctx context.Context, req CreateCheckoutRequest) (*domain.PaymentIntent, error) {
	p, err := s.providers.Get(req.Provider)
	if err != nil {
		return nil, err
	}

	session, err := p.CreateCheckoutSession(ctx, domain.CheckoutRequest{
		UserID:      req.UserID,
		PlanCode:    req.PlanCode,
		PriceID:     req.PriceID,
		AmountCents: req.AmountCents,
		Currency:    req.Currency,
		Interval:    req.Interval,
		ReturnURL:   req.ReturnURL,
		CancelURL:   req.CancelURL,
		Metadata:    map[string]string{"plan_code": req.PlanCode},
	})
	if err != nil {
		s.log.Error("provider checkout session failed",
			zap.String("provider", string(req.Provider)), zap.Error(err))
		return nil, domain.ErrInternalError
	}

	intent := &domain.PaymentIntent{
		ID:                uuid.New(),
		UserID:            req.UserID,
		PlanCode:          req.PlanCode,
		Provider:          req.Provider,
		ProviderSessionID: session.SessionID,
		AmountCents:       req.AmountCents,
		Currency:          req.Currency,
		Interval:          req.Interval,
		Status:            domain.IntentPending,
		ReturnURL:         req.ReturnURL,
		CheckoutURL:       session.CheckoutURL,
		Metadata:          map[string]string{"plan_code": req.PlanCode},
	}

	if err := s.intentRepo.Create(ctx, intent); err != nil {
		s.log.Error("failed to persist payment intent", zap.Error(err))
		return nil, domain.ErrInternalError
	}

	// Intent saved — write outbox row (non-critical, best-effort)
	go func() {
		evt := domain.PaymentInitiatedEvent{
			EventID:     uuid.New().String(),
			UserID:      req.UserID.String(),
			IntentID:    intent.ID.String(),
			Provider:    string(req.Provider),
			PlanCode:    req.PlanCode,
			AmountCents: req.AmountCents,
			Currency:    req.Currency,
			Interval:    req.Interval,
			OccurredAt:  time.Now().UTC(),
		}
		if err := messaging.MarshalAndPublish(context.Background(), s.publisher, "payment.initiated", evt); err != nil {
			s.log.Warn("publish payment.initiated failed (non-critical for checkout)", zap.Error(err))
		}
	}()

	return intent, nil
}

// ─── GetIntent ─────────────────────────────────────────────────────────────────

func (s *paymentService) GetIntent(ctx context.Context, userID, intentID uuid.UUID) (*domain.PaymentIntent, error) {
	intent, err := s.intentRepo.GetByID(ctx, intentID)
	if err != nil {
		return nil, domain.ErrNotFound
	}
	if intent.UserID != userID {
		return nil, domain.ErrForbidden
	}
	return intent, nil
}

// ─── HandleWebhook ─────────────────────────────────────────────────────────────

func (s *paymentService) HandleWebhook(ctx context.Context, req HandleWebhookRequest) error {
	p, err := s.providers.Get(req.Provider)
	if err != nil {
		return err
	}

	// 1. Verify signature + parse
	norm, err := p.ParseWebhook(req.RawBody, req.Signature)
	if err != nil {
		return err
	}
	if norm.EventType == "" {
		return nil // unhandled event — 200 OK to provider
	}

	// 2. Idempotency: ON CONFLICT DO NOTHING
	we := &domain.WebhookEvent{
		ID:        norm.ProviderEventID,
		Provider:  req.Provider,
		EventType: string(norm.EventType),
		Payload:   req.RawBody,
	}
	isNew, err := s.webhookRepo.InsertIfNew(ctx, we)
	if err != nil {
		s.log.Error("webhook idempotency check failed", zap.Error(err))
		return domain.ErrInternalError
	}
	if !isNew {
		s.log.Info("duplicate webhook — skipping",
			zap.String("event_id", norm.ProviderEventID),
			zap.String("provider", string(req.Provider)))
		return nil
	}

	// 3. Process by event type
	var processErr error
	switch norm.EventType {
	case domain.EventPaymentSucceeded:
		processErr = s.onPaymentSucceeded(ctx, req.Provider, norm)
	case domain.EventPaymentFailed:
		processErr = s.onPaymentFailed(ctx, req.Provider, norm)
	case domain.EventPaymentRefunded:
		processErr = s.onPaymentRefunded(ctx, req.Provider, norm)
	default:
		s.log.Debug("unhandled normalized event type", zap.String("type", string(norm.EventType)))
	}

	if processErr != nil {
		_ = s.webhookRepo.MarkFailed(ctx, norm.ProviderEventID, processErr.Error())
		return processErr
	}
	_ = s.webhookRepo.MarkProcessed(ctx, norm.ProviderEventID)
	return nil
}

// onPaymentSucceeded atomically: updates intent → succeeded, inserts transaction, publishes Kafka event.
func (s *paymentService) onPaymentSucceeded(ctx context.Context, prov domain.ProviderType, norm *domain.NormalizedWebhook) error {
	intent, err := s.resolveIntent(ctx, prov, norm)
	if err != nil {
		return err
	}

	txRecord := &domain.PaymentTransaction{
		ID:               uuid.New(),
		PaymentIntentID:  intent.ID,
		Provider:         prov,
		ProviderChargeID: norm.ProviderChargeID,
		AmountCents:      norm.AmountCents,
		Currency:         norm.Currency,
		Status:           domain.TxSucceeded,
	}

	// Atomic: intent status + transaction row + outbox in one pgx TX
	txErr := pgx.BeginTxFunc(ctx, s.db, pgx.TxOptions{IsoLevel: pgx.ReadCommitted}, func(dbtx pgx.Tx) error {
		if _, err := dbtx.Exec(ctx,
			`UPDATE payment_intents SET status='succeeded', updated_at=now() WHERE id=$1`,
			intent.ID); err != nil {
			return fmt.Errorf("update intent status: %w", err)
		}
		if _, err := dbtx.Exec(ctx,
			`INSERT INTO payment_transactions
			   (id, payment_intent_id, provider, provider_charge_id, amount_cents, currency, status)
			 VALUES ($1,$2,$3,$4,$5,$6,'succeeded')`,
			txRecord.ID, txRecord.PaymentIntentID, string(txRecord.Provider),
			txRecord.ProviderChargeID, txRecord.AmountCents, txRecord.Currency); err != nil {
			return fmt.Errorf("insert transaction: %w", err)
		}
		// ─── Outbox: write Kafka event atomically with DB changes ──────────
		evt := domain.PaymentSucceededEvent{
			EventID:          uuid.New().String(),
			UserID:           intent.UserID.String(),
			IntentID:         intent.ID.String(),
			Provider:         string(prov),
			ProviderChargeID: norm.ProviderChargeID,
			ProviderSubID:    norm.ProviderSubID,
			PlanCode:         intent.PlanCode,
			AmountCents:      norm.AmountCents,
			Currency:         norm.Currency,
			Interval:         intent.Interval,
			PeriodEnd:        norm.PeriodEnd,
			OccurredAt:       time.Now().UTC(),
		}
		payload, err := json.Marshal(evt)
		if err != nil {
			return fmt.Errorf("marshal outbox payload: %w", err)
		}
		return s.outboxRepo.InsertTx(ctx, dbtx, &repository.OutboxEntry{
			Topic:   "payment.succeeded",
			Key:     intent.UserID.String(),
			Payload: payload,
		})
	})
	if txErr != nil {
		s.log.Error("atomic succeeded transaction failed", zap.Error(txErr))
		return domain.ErrInternalError
	}

	return nil
}

func (s *paymentService) onPaymentFailed(ctx context.Context, prov domain.ProviderType, norm *domain.NormalizedWebhook) error {
	intent, err := s.resolveIntent(ctx, prov, norm)
	if err != nil {
		return err
	}

	if err := s.intentRepo.UpdateStatus(ctx, intent.ID, domain.IntentFailed); err != nil {
		return domain.ErrInternalError
	}

	go func() {
		evt := domain.PaymentFailedEvent{
			EventID:        uuid.New().String(),
			UserID:         intent.UserID.String(),
			IntentID:       intent.ID.String(),
			Provider:       string(prov),
			PlanCode:       intent.PlanCode,
			FailureCode:    norm.FailureCode,
			FailureMessage: norm.FailureMessage,
			OccurredAt:     time.Now().UTC(),
		}
		if err := messaging.MarshalAndPublish(context.Background(), s.publisher, "payment.failed", evt); err != nil {
			s.log.Warn("publish payment.failed failed", zap.Error(err))
		}
	}()

	return nil
}

func (s *paymentService) onPaymentRefunded(ctx context.Context, prov domain.ProviderType, norm *domain.NormalizedWebhook) error {
	intent, err := s.resolveIntent(ctx, prov, norm)
	if err != nil {
		return err
	}

	if err := s.intentRepo.UpdateStatus(ctx, intent.ID, domain.IntentRefunded); err != nil {
		return domain.ErrInternalError
	}

	go func() {
		evt := domain.PaymentRefundedEvent{
			EventID:          uuid.New().String(),
			UserID:           intent.UserID.String(),
			IntentID:         intent.ID.String(),
			Provider:         string(prov),
			ProviderChargeID: norm.ProviderChargeID,
			AmountCents:      norm.AmountCents,
			Currency:         norm.Currency,
			OccurredAt:       time.Now().UTC(),
		}
		if err := messaging.MarshalAndPublish(context.Background(), s.publisher, "payment.refunded", evt); err != nil {
			s.log.Warn("publish payment.refunded failed", zap.Error(err))
		}
	}()

	return nil
}

// resolveIntent finds the payment intent from the normalized webhook data.
func (s *paymentService) resolveIntent(ctx context.Context, prov domain.ProviderType, norm *domain.NormalizedWebhook) (*domain.PaymentIntent, error) {
	// VNPay / MoMo: resolve by session ID (order ID they send back)
	if norm.ProviderSessionID != "" {
		if intent, err := s.intentRepo.GetByProviderSession(ctx, prov, norm.ProviderSessionID); err == nil {
			return intent, nil
		}
	}
	s.log.Warn("unable to resolve payment intent from webhook",
		zap.String("provider", string(prov)),
		zap.String("event_id", norm.ProviderEventID),
		zap.String("session_id", norm.ProviderSessionID))
	return nil, domain.ErrNotFound
}
