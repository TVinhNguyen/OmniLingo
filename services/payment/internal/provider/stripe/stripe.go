// Package stripe implements the Stripe payment adapter.
package stripe

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/omnilingo/payment-service/internal/domain"
	stripelib "github.com/stripe/stripe-go/v79"
	"github.com/stripe/stripe-go/v79/checkout/session"
	"github.com/stripe/stripe-go/v79/refund"
	"github.com/stripe/stripe-go/v79/webhook"
	"go.uber.org/zap"
)

// Adapter is the Stripe payment adapter.
type Adapter struct {
	webhookSecret string
	log           *zap.Logger
}

// New creates a Stripe adapter and sets the global Stripe API key.
func New(secretKey, webhookSecret string, log *zap.Logger) *Adapter {
	stripelib.Key = secretKey
	return &Adapter{webhookSecret: webhookSecret, log: log}
}

func (a *Adapter) Type() domain.ProviderType { return domain.ProviderStripe }

// CreateCheckoutSession creates a Stripe Checkout Session for subscription.
func (a *Adapter) CreateCheckoutSession(_ context.Context, req domain.CheckoutRequest) (*domain.CheckoutSession, error) {
	metadata := make(map[string]string, len(req.Metadata)+3)
	for k, v := range req.Metadata {
		metadata[k] = v
	}
	metadata["user_id"] = req.UserID.String()
	metadata["plan_code"] = req.PlanCode
	metadata["interval"] = req.Interval

	params := &stripelib.CheckoutSessionParams{
		Mode:       stripelib.String(string(stripelib.CheckoutSessionModeSubscription)),
		SuccessURL: stripelib.String(req.ReturnURL + "?status=success&session_id={CHECKOUT_SESSION_ID}"),
		CancelURL:  stripelib.String(req.CancelURL + "?status=cancelled"),
		LineItems: []*stripelib.CheckoutSessionLineItemParams{
			{
				Price:    stripelib.String(req.PriceID),
				Quantity: stripelib.Int64(1),
			},
		},
		Metadata: metadata,
	}

	s, err := session.New(params)
	if err != nil {
		return nil, fmt.Errorf("stripe create checkout session: %w", err)
	}

	return &domain.CheckoutSession{
		SessionID:   s.ID,
		CheckoutURL: s.URL,
	}, nil
}

// ParseWebhook verifies the Stripe-Signature header and parses the event.
func (a *Adapter) ParseWebhook(payload []byte, signature string) (*domain.NormalizedWebhook, error) {
	event, err := webhook.ConstructEvent(payload, signature, a.webhookSecret)
	if err != nil {
		return nil, domain.ErrInvalidSig
	}

	norm := &domain.NormalizedWebhook{
		ProviderEventID: event.ID,
	}

	switch event.Type {
	case "checkout.session.completed":
		var s stripelib.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &s); err != nil {
			return nil, fmt.Errorf("stripe: unmarshal checkout session: %w", err)
		}
		norm.EventType = domain.EventPaymentSucceeded
		if s.Subscription != nil {
			norm.ProviderSubID = s.Subscription.ID
		}
		norm.Metadata = mapCopy(s.Metadata)
		norm.AmountCents = int(s.AmountTotal)
		norm.Currency = string(s.Currency)

	case "invoice.payment_succeeded":
		var inv stripelib.Invoice
		if err := json.Unmarshal(event.Data.Raw, &inv); err != nil {
			return nil, fmt.Errorf("stripe: unmarshal invoice: %w", err)
		}
		norm.EventType = domain.EventPaymentSucceeded
		if inv.Charge != nil {
			norm.ProviderChargeID = inv.Charge.ID
		}
		if inv.Subscription != nil {
			norm.ProviderSubID = inv.Subscription.ID
		}
		norm.AmountCents = int(inv.AmountPaid)
		norm.Currency = string(inv.Currency)
		if inv.Lines != nil {
			for _, li := range inv.Lines.Data {
				if li.Period != nil {
					t := time.Unix(li.Period.End, 0).UTC()
					norm.PeriodEnd = &t
					break
				}
			}
		}

	case "invoice.payment_failed":
		var inv stripelib.Invoice
		if err := json.Unmarshal(event.Data.Raw, &inv); err != nil {
			return nil, fmt.Errorf("stripe: unmarshal invoice: %w", err)
		}
		norm.EventType = domain.EventPaymentFailed
		if inv.Subscription != nil {
			norm.ProviderSubID = inv.Subscription.ID
		}
		norm.AmountCents = int(inv.AmountDue)
		norm.Currency = string(inv.Currency)
		if inv.LastFinalizationError != nil {
			norm.FailureCode = string(inv.LastFinalizationError.Code)
			norm.FailureMessage = inv.LastFinalizationError.Msg
		}

	case "charge.refunded":
		var ch stripelib.Charge
		if err := json.Unmarshal(event.Data.Raw, &ch); err != nil {
			return nil, fmt.Errorf("stripe: unmarshal charge: %w", err)
		}
		norm.EventType = domain.EventPaymentRefunded
		norm.ProviderChargeID = ch.ID
		norm.AmountCents = int(ch.AmountRefunded)
		norm.Currency = string(ch.Currency)

	default:
		// Unhandled event — caller should skip gracefully
		a.log.Debug("stripe: unhandled event type", zap.String("type", string(event.Type)))
	}

	return norm, nil
}

// RefundCharge issues a Stripe refund. amountCents=0 means full refund.
func (a *Adapter) RefundCharge(_ context.Context, chargeID string, amountCents int) (string, error) {
	params := &stripelib.RefundParams{
		Charge: stripelib.String(chargeID),
	}
	if amountCents > 0 {
		params.Amount = stripelib.Int64(int64(amountCents))
	}
	r, err := refund.New(params)
	if err != nil {
		return "", fmt.Errorf("stripe refund: %w", err)
	}
	return r.ID, nil
}

func mapCopy(m map[string]string) map[string]string {
	out := make(map[string]string, len(m))
	for k, v := range m {
		out[k] = v
	}
	return out
}
