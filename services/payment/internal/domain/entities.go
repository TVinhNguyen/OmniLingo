package domain

import (
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
)

// ─── Provider Types ────────────────────────────────────────────────────────────

type ProviderType string

const (
	ProviderStripe    ProviderType = "stripe"
	ProviderVNPay     ProviderType = "vnpay"
	ProviderMoMo      ProviderType = "momo"
	ProviderAppleIAP  ProviderType = "apple_iap"
	ProviderGoogleIAP ProviderType = "google_iap"
)

// ─── Payment Intent ────────────────────────────────────────────────────────────

type IntentStatus string

const (
	IntentPending    IntentStatus = "pending"
	IntentProcessing IntentStatus = "processing"
	IntentSucceeded  IntentStatus = "succeeded"
	IntentFailed     IntentStatus = "failed"
	IntentCancelled  IntentStatus = "cancelled"
	IntentRefunded   IntentStatus = "refunded"
)

// PaymentIntent represents a checkout session created for a user.
type PaymentIntent struct {
	ID                uuid.UUID    `json:"id"`
	UserID            uuid.UUID    `json:"user_id"`
	PlanCode          string       `json:"plan_code"`
	Provider          ProviderType `json:"provider"`
	ProviderSessionID string       `json:"provider_session_id"`
	AmountCents       int          `json:"amount_cents"`
	Currency          string       `json:"currency"`
	Interval          string       `json:"interval"` // "month" | "year"
	Status            IntentStatus `json:"status"`
	ReturnURL         string       `json:"return_url,omitempty"`
	CheckoutURL       string       `json:"checkout_url,omitempty"` // redirect URL for user
	Metadata          map[string]string `json:"metadata"`
	CreatedAt         time.Time    `json:"created_at"`
	UpdatedAt         time.Time    `json:"updated_at"`
}

// ─── Transaction ───────────────────────────────────────────────────────────────

type TransactionStatus string

const (
	TxSucceeded TransactionStatus = "succeeded"
	TxRefunded  TransactionStatus = "refunded"
	TxFailed    TransactionStatus = "failed"
)

// PaymentTransaction is a confirmed charge record.
type PaymentTransaction struct {
	ID                uuid.UUID         `json:"id"`
	PaymentIntentID   uuid.UUID         `json:"payment_intent_id"`
	Provider          ProviderType      `json:"provider"`
	ProviderChargeID  string            `json:"provider_charge_id"`
	AmountCents       int               `json:"amount_cents"`
	Currency          string            `json:"currency"`
	Status            TransactionStatus `json:"status"`
	RefundID          *string           `json:"refund_id,omitempty"`
	RefundAmountCents *int              `json:"refund_amount_cents,omitempty"`
	FailureCode       *string           `json:"failure_code,omitempty"`
	FailureMessage    *string           `json:"failure_message,omitempty"`
	CreatedAt         time.Time         `json:"created_at"`
	UpdatedAt         time.Time         `json:"updated_at"`
}

// ─── Webhook Event ─────────────────────────────────────────────────────────────

type WebhookEventStatus string

const (
	WebhookPending    WebhookEventStatus = "pending"
	WebhookProcessed  WebhookEventStatus = "processed"
	WebhookFailed     WebhookEventStatus = "failed"
	WebhookDuplicate  WebhookEventStatus = "duplicate"
)

// WebhookEvent is the idempotency store entry for every incoming webhook.
type WebhookEvent struct {
	ID           string             `json:"id"` // provider's event ID — unique per provider
	Provider     ProviderType       `json:"provider"`
	EventType    string             `json:"event_type"`
	Payload      []byte             `json:"-"`
	Status       WebhookEventStatus `json:"status"`
	ErrorMessage *string            `json:"error_message,omitempty"`
	ProcessedAt  *time.Time         `json:"processed_at,omitempty"`
	CreatedAt    time.Time          `json:"created_at"`
}

// ─── Provider-agnostic DTOs ────────────────────────────────────────────────────

// CheckoutRequest is what the service layer passes to a provider adapter.
type CheckoutRequest struct {
	UserID      uuid.UUID
	PlanCode    string
	PriceID     string // provider-specific price/product ID
	AmountCents int
	Currency    string
	Interval    string // "month" | "year"
	ReturnURL   string
	CancelURL   string
	Metadata    map[string]string
}

// CheckoutSession is the provider's response after creating a session.
type CheckoutSession struct {
	SessionID   string // provider's session/order ID
	CheckoutURL string // redirect URL shown to user
}

// NormalizedWebhook is what every provider adapter returns after parsing webhook.
type NormalizedWebhook struct {
	ProviderEventID   string
	ProviderSessionID string // provider checkout/order session ID (to match our intent)
	ProviderChargeID  string
	ProviderSubID     string
	EventType         NormalizedEventType
	AmountCents       int
	Currency          string
	PeriodEnd         *time.Time
	FailureCode       string
	FailureMessage    string
	Metadata          map[string]string
}

type NormalizedEventType string

const (
	EventPaymentSucceeded  NormalizedEventType = "payment.succeeded"
	EventPaymentFailed     NormalizedEventType = "payment.failed"
	EventPaymentRefunded   NormalizedEventType = "payment.refunded"
	EventSubscriptionRenew NormalizedEventType = "subscription.renewed"
)

// ─── Domain Errors ─────────────────────────────────────────────────────────────

// DomainError is a typed error with HTTP status code.
type DomainError struct {
	Code       string
	Message    string
	StatusCode int
}

func (e *DomainError) Error() string { return e.Message }

func Errorf(code, msg string, args ...any) *DomainError {
	return &DomainError{Code: code, Message: fmt.Sprintf(msg, args...), StatusCode: http.StatusBadRequest}
}

var (
	ErrNotFound       = &DomainError{Code: "NOT_FOUND", Message: "resource not found", StatusCode: http.StatusNotFound}
	ErrUnauthorized   = &DomainError{Code: "UNAUTHORIZED", Message: "authentication required", StatusCode: http.StatusUnauthorized}
	ErrForbidden      = &DomainError{Code: "FORBIDDEN", Message: "access forbidden", StatusCode: http.StatusForbidden}
	ErrInternalError  = &DomainError{Code: "INTERNAL_ERROR", Message: "internal server error", StatusCode: http.StatusInternalServerError}
	ErrDuplicate      = &DomainError{Code: "DUPLICATE", Message: "duplicate event", StatusCode: http.StatusConflict}
	ErrBadRequest     = &DomainError{Code: "BAD_REQUEST", Message: "bad request", StatusCode: http.StatusBadRequest}
	ErrProviderConfig = &DomainError{Code: "PROVIDER_NOT_CONFIGURED", Message: "payment provider not configured", StatusCode: http.StatusBadRequest}
	ErrInvalidSig     = &DomainError{Code: "INVALID_SIGNATURE", Message: "webhook signature verification failed", StatusCode: http.StatusBadRequest}
)
