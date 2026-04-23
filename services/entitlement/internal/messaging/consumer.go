package messaging

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/omnilingo/entitlement-service/internal/domain"
	"github.com/omnilingo/entitlement-service/internal/service"
	kafka "github.com/segmentio/kafka-go"
	"go.uber.org/zap"
)

// Consumer subscribes to billing and payment events to update entitlements.
type Consumer struct {
	svc    service.EntitlementService
	reader *kafka.Reader
	log    *zap.Logger
}

// NewConsumer creates a Kafka consumer for billing + payment events.
func NewConsumer(brokers []string, groupID string, svc service.EntitlementService, log *zap.Logger) *Consumer {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  brokers,
		GroupID:  groupID,
		GroupTopics: []string{
			"billing.subscription.created",  // billing-service publishes .created (not .activated)
			"billing.subscription.canceled",  // billing-service uses US spelling .canceled
			"payment.succeeded",
		},
		MinBytes:        1,
		MaxBytes:        1 << 20, // 1MB
		MaxWait:         500 * time.Millisecond,
		CommitInterval:  time.Second,
		StartOffset:     kafka.LastOffset,
	})
	return &Consumer{svc: svc, reader: r, log: log}
}

// Run starts the consumer loop. Blocks until ctx is cancelled.
// Must be called in a separate goroutine from main.
func (c *Consumer) Run(ctx context.Context) {
	c.log.Info("kafka consumer started")
	for {
		msg, err := c.reader.FetchMessage(ctx)
		if err != nil {
			if ctx.Err() != nil {
				c.log.Info("kafka consumer shutting down")
				return
			}
			c.log.Error("kafka fetch error", zap.Error(err))
			continue
		}

		if err := c.handle(ctx, msg); err != nil {
			c.log.Error("kafka message handling failed",
				zap.String("topic", msg.Topic),
				zap.Error(err))
			// Do NOT commit — message will be retried on restart
			continue
		}

		// Commit only after successful processing
		if err := c.reader.CommitMessages(ctx, msg); err != nil {
			c.log.Warn("kafka commit failed", zap.Error(err))
		}
	}
}

// Close shuts down the reader.
func (c *Consumer) Close() error { return c.reader.Close() }

// ─── Internal dispatch ────────────────────────────────────────────────────────

func (c *Consumer) handle(ctx context.Context, msg kafka.Message) error {
	switch msg.Topic {
	case "billing.subscription.created":
		return c.handleActivated(ctx, msg.Value)
	case "billing.subscription.canceled":
		return c.handleCancelled(ctx, msg.Value)
	case "payment.succeeded":
		return c.handlePaymentSucceeded(ctx, msg.Value)
	default:
		c.log.Debug("unhandled topic", zap.String("topic", msg.Topic))
		return nil
	}
}

func (c *Consumer) handleActivated(ctx context.Context, payload []byte) error {
	var evt domain.BillingSubscriptionActivatedEvent
	if err := json.Unmarshal(payload, &evt); err != nil {
		return err
	}

	userID, err := uuid.Parse(evt.UserID)
	if err != nil {
		return err
	}

	tier := domain.PlanTier(evt.PlanTier)
	if !tier.IsValid() {
		c.log.Warn("unknown plan tier in event", zap.String("tier", evt.PlanTier))
		tier = domain.TierFree
	}

	ent := &domain.UserEntitlement{
		UserID:    userID,
		PlanTier:  tier,
		ValidUntil: &evt.PeriodEnd,
		Overrides: map[string]bool{},
	}
	return c.svc.UpsertEntitlement(ctx, ent)
}

func (c *Consumer) handleCancelled(ctx context.Context, payload []byte) error {
	var evt domain.BillingSubscriptionCancelledEvent
	if err := json.Unmarshal(payload, &evt); err != nil {
		return err
	}

	userID, err := uuid.Parse(evt.UserID)
	if err != nil {
		return err
	}

	// User keeps access until period_end, then drops to free.
	// If period_end is nil, downgrade immediately.
	var validUntil *time.Time
	if evt.PeriodEnd != nil && evt.PeriodEnd.After(time.Now().UTC()) {
		validUntil = evt.PeriodEnd
	}

	tier := domain.TierFree
	if validUntil != nil {
		// Still within paid period — keep current tier until expiry
		tier = domain.PlanTier(evt.PlanTier)
	}

	ent := &domain.UserEntitlement{
		UserID:     userID,
		PlanTier:   tier,
		ValidUntil: validUntil,
		Overrides:  map[string]bool{},
	}
	return c.svc.UpsertEntitlement(ctx, ent)
}

func (c *Consumer) handlePaymentSucceeded(ctx context.Context, payload []byte) error {
	var evt domain.PaymentSucceededEvent
	if err := json.Unmarshal(payload, &evt); err != nil {
		return err
	}

	userID, err := uuid.Parse(evt.UserID)
	if err != nil {
		return err
	}

	// Map plan_code → tier (plan_code is e.g. "pro_monthly", "plus_annual")
	tier := planCodeToTier(evt.PlanCode)
	if tier == "" {
		c.log.Warn("unknown plan code in payment.succeeded",
			zap.String("plan_code", evt.PlanCode))
		return nil // skip, not fatal
	}

	var validUntil *time.Time
	if evt.PeriodEnd != nil {
		validUntil = evt.PeriodEnd
	} else {
		// Default period: 1 month / 1 year based on interval
		t := periodEndFromInterval(evt.Interval)
		validUntil = &t
	}

	ent := &domain.UserEntitlement{
		UserID:     userID,
		PlanTier:   tier,
		ValidUntil: validUntil,
		Overrides:  map[string]bool{},
	}
	return c.svc.UpsertEntitlement(ctx, ent)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// planCodeToTier maps payment plan codes to domain tier.
func planCodeToTier(code string) domain.PlanTier {
	mapping := map[string]domain.PlanTier{
		"free":              domain.TierFree,
		"plus":              domain.TierPlus,
		"plus_monthly":      domain.TierPlus,
		"plus_annual":       domain.TierPlus,
		"pro":               domain.TierPro,
		"pro_monthly":       domain.TierPro,
		"pro_annual":        domain.TierPro,
		"ultimate":          domain.TierUltimate,
		"ultimate_monthly":  domain.TierUltimate,
		"ultimate_annual":   domain.TierUltimate,
		"family":            domain.TierFamily,
		"family_monthly":    domain.TierFamily,
		"family_annual":     domain.TierFamily,
		"schools":           domain.TierSchools,
		"enterprise":        domain.TierEnterprise,
	}
	return mapping[code]
}

func periodEndFromInterval(interval string) time.Time {
	now := time.Now().UTC()
	if interval == "year" {
		return now.AddDate(1, 0, 0)
	}
	return now.AddDate(0, 1, 0)
}
