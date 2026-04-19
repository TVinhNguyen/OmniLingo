package domain

import (
	"time"

	"github.com/google/uuid"
)

// ─── Plan ─────────────────────────────────────────────────────────────────────

type Plan struct {
	Code        string   `json:"code"`
	Name        string   `json:"name"`
	Tier        string   `json:"tier"`
	PriceCents  int      `json:"price_cents"`
	Currency    string   `json:"currency"`
	Interval    string   `json:"interval"`
	Features    []string `json:"features"`
	IsActive    bool     `json:"is_active"`
}

// ─── Subscription ─────────────────────────────────────────────────────────────

type SubscriptionStatus string

const (
	SubTrialing  SubscriptionStatus = "trialing"
	SubActive    SubscriptionStatus = "active"
	SubPastDue   SubscriptionStatus = "past_due"
	SubCanceled  SubscriptionStatus = "canceled"
	SubExpired   SubscriptionStatus = "expired"
)

type Subscription struct {
	ID                  uuid.UUID          `json:"id"`
	UserID              uuid.UUID          `json:"user_id"`
	PlanCode            string             `json:"plan_code"`
	Plan                *Plan              `json:"plan,omitempty"`
	Status              SubscriptionStatus `json:"status"`
	Provider            string             `json:"provider"`
	ProviderSubID       string             `json:"provider_sub_id,omitempty"`
	CurrentPeriodStart  *time.Time         `json:"current_period_start,omitempty"`
	CurrentPeriodEnd    *time.Time         `json:"current_period_end,omitempty"`
	TrialEnd            *time.Time         `json:"trial_end,omitempty"`
	CancelAtPeriodEnd   bool               `json:"cancel_at_period_end"`
	CanceledAt          *time.Time         `json:"canceled_at,omitempty"`
	CreatedAt           time.Time          `json:"created_at"`
	UpdatedAt           time.Time          `json:"updated_at"`
}

// ─── Invoice ──────────────────────────────────────────────────────────────────

type InvoiceStatus string

const (
	InvoiceOpen     InvoiceStatus = "open"
	InvoicePaid     InvoiceStatus = "paid"
	InvoiceVoid     InvoiceStatus = "void"
	InvoiceRefunded InvoiceStatus = "refunded"
)

type Invoice struct {
	ID               uuid.UUID     `json:"id"`
	UserID           uuid.UUID     `json:"user_id"`
	SubscriptionID   *uuid.UUID    `json:"subscription_id,omitempty"`
	AmountCents      int           `json:"amount_cents"`
	Currency         string        `json:"currency"`
	Status           InvoiceStatus `json:"status"`
	ProviderInvoiceID string       `json:"provider_invoice_id,omitempty"`
	Description      string        `json:"description,omitempty"`
	IssuedAt         time.Time     `json:"issued_at"`
	PaidAt           *time.Time    `json:"paid_at,omitempty"`
	DueAt            *time.Time    `json:"due_at,omitempty"`
}

// ─── Kafka Events ─────────────────────────────────────────────────────────────

type SubscriptionCreatedEvent struct {
	EventID     string    `json:"event_id"`
	UserID      string    `json:"user_id"`
	SubID       string    `json:"subscription_id"`
	PlanCode    string    `json:"plan_code"`
	Tier        string    `json:"tier"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
}

type SubscriptionCanceledEvent struct {
	EventID   string    `json:"event_id"`
	UserID    string    `json:"user_id"`
	SubID     string    `json:"subscription_id"`
	CanceledAt time.Time `json:"canceled_at"`
}

type TrialEndingEvent struct {
	EventID  string    `json:"event_id"`
	UserID   string    `json:"user_id"`
	TrialEnd time.Time `json:"trial_end"`
}

type InvoicePaidEvent struct {
	EventID   string    `json:"event_id"`
	UserID    string    `json:"user_id"`
	InvoiceID string    `json:"invoice_id"`
	AmountCents int     `json:"amount_cents"`
	Currency  string    `json:"currency"`
	PaidAt    time.Time `json:"paid_at"`
}
