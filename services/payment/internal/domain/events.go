package domain

import "time"

// ─── Kafka Events ──────────────────────────────────────────────────────────────

// PaymentInitiatedEvent is published when a checkout session is created.
type PaymentInitiatedEvent struct {
	EventID     string `json:"event_id"`
	UserID      string `json:"user_id"`
	IntentID    string `json:"intent_id"`
	Provider    string `json:"provider"`
	PlanCode    string `json:"plan_code"`
	AmountCents int    `json:"amount_cents"`
	Currency    string `json:"currency"`
	Interval    string `json:"interval"`
	OccurredAt  time.Time `json:"occurred_at"`
}

// PaymentSucceededEvent is published when a provider confirms successful payment.
type PaymentSucceededEvent struct {
	EventID          string     `json:"event_id"`
	UserID           string     `json:"user_id"`
	IntentID         string     `json:"intent_id"`
	Provider         string     `json:"provider"`
	ProviderChargeID string     `json:"provider_charge_id"`
	ProviderSubID    string     `json:"provider_sub_id"`
	PlanCode         string     `json:"plan_code"`
	AmountCents      int        `json:"amount_cents"`
	Currency         string     `json:"currency"`
	Interval         string     `json:"interval"`
	PeriodEnd        *time.Time `json:"period_end,omitempty"`
	OccurredAt       time.Time  `json:"occurred_at"`
}

// PaymentFailedEvent is published when a provider reports payment failure.
type PaymentFailedEvent struct {
	EventID        string    `json:"event_id"`
	UserID         string    `json:"user_id"`
	IntentID       string    `json:"intent_id"`
	Provider       string    `json:"provider"`
	PlanCode       string    `json:"plan_code"`
	FailureCode    string    `json:"failure_code"`
	FailureMessage string    `json:"failure_message"`
	OccurredAt     time.Time `json:"occurred_at"`
}

// PaymentRefundedEvent is published when a refund is processed.
type PaymentRefundedEvent struct {
	EventID          string    `json:"event_id"`
	UserID           string    `json:"user_id"`
	IntentID         string    `json:"intent_id"`
	Provider         string    `json:"provider"`
	ProviderChargeID string    `json:"provider_charge_id"`
	RefundID         string    `json:"refund_id"`
	AmountCents      int       `json:"amount_cents"`
	Currency         string    `json:"currency"`
	OccurredAt       time.Time `json:"occurred_at"`
}
