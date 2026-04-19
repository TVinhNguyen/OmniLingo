// Package provider defines the abstraction for all payment provider adapters.
package provider

import (
	"context"

	"github.com/omnilingo/payment-service/internal/domain"
)

// Provider is the interface every payment adapter must satisfy.
// This lets payment-service swap providers without changing business logic.
type Provider interface {
	// Type returns the provider identifier.
	Type() domain.ProviderType

	// CreateCheckoutSession creates a payment session/order at the provider.
	// Returns the session ID (for our DB) and a redirect URL for the user.
	CreateCheckoutSession(ctx context.Context, req domain.CheckoutRequest) (*domain.CheckoutSession, error)

	// ParseWebhook verifies the webhook signature and parses the raw body
	// into a NormalizedWebhook. Returns ErrInvalidSig if verification fails.
	ParseWebhook(payload []byte, signature string) (*domain.NormalizedWebhook, error)

	// RefundCharge issues a refund for the given charge. Pass amountCents=0 for full refund.
	RefundCharge(ctx context.Context, chargeID string, amountCents int) (refundID string, err error)
}

// Registry maps provider types to their implementations.
type Registry struct {
	providers map[domain.ProviderType]Provider
}

func NewRegistry() *Registry {
	return &Registry{providers: make(map[domain.ProviderType]Provider)}
}

// Register adds a provider to the registry.
func (r *Registry) Register(p Provider) {
	r.providers[p.Type()] = p
}

// Get returns the provider for the given type. Returns (nil, ErrProviderConfig) if not registered.
func (r *Registry) Get(t domain.ProviderType) (Provider, error) {
	p, ok := r.providers[t]
	if !ok {
		return nil, domain.ErrProviderConfig
	}
	return p, nil
}

// Has returns true if the provider is registered.
func (r *Registry) Has(t domain.ProviderType) bool {
	_, ok := r.providers[t]
	return ok
}
