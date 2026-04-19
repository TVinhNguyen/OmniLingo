package domain

import "time"

// ─── Kafka Events Consumed ─────────────────────────────────────────────────────

// BillingSubscriptionActivatedEvent is consumed from billing-service when a
// subscription is activated or renewed. entitlement-service uses this to
// upsert the user_entitlements record.
type BillingSubscriptionActivatedEvent struct {
	EventID    string    `json:"event_id"`
	UserID     string    `json:"user_id"`
	PlanTier   string    `json:"plan_tier"`
	PeriodEnd  time.Time `json:"period_end"`
	OccurredAt time.Time `json:"occurred_at"`
}

// BillingSubscriptionCancelledEvent is consumed when a subscription is cancelled.
// entitlement-service downgrades the user to free at period_end.
type BillingSubscriptionCancelledEvent struct {
	EventID    string     `json:"event_id"`
	UserID     string     `json:"user_id"`
	PlanTier   string     `json:"plan_tier"`    // tier being cancelled
	PeriodEnd  *time.Time `json:"period_end"`   // access remains until this date
	OccurredAt time.Time  `json:"occurred_at"`
}

// PaymentSucceededEvent is consumed from payment-service.
// Used as an alternative path to update entitlements if billing-service
// has not yet processed the payment.
type PaymentSucceededEvent struct {
	EventID     string     `json:"event_id"`
	UserID      string     `json:"user_id"`
	PlanCode    string     `json:"plan_code"`
	Interval    string     `json:"interval"`
	PeriodEnd   *time.Time `json:"period_end"`
	OccurredAt  time.Time  `json:"occurred_at"`
}
