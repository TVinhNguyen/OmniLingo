package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

// Prometheus metric definitions for payment-service.
// Naming: payment_<subsystem>_<metric>
var (
	// HTTP
	HTTPRequestsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "payment_http_requests_total",
		Help: "Total number of HTTP requests.",
	}, []string{"method", "route", "status"})

	HTTPRequestDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "payment_http_request_duration_seconds",
		Help:    "HTTP request duration in seconds.",
		Buckets: prometheus.DefBuckets,
	}, []string{"method", "route"})

	// Checkout
	CheckoutTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "payment_checkout_total",
		Help: "Total checkout sessions created.",
	}, []string{"provider", "status"})

	// Webhooks
	WebhookTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "payment_webhook_total",
		Help: "Total webhooks received.",
	}, []string{"provider", "event_type", "status"})

	// Provider latency (SLO: Checkout P99 < 2s)
	ProviderDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "payment_provider_duration_seconds",
		Help:    "Time taken for provider API calls.",
		Buckets: []float64{0.1, 0.25, 0.5, 1.0, 2.0, 5.0},
	}, []string{"provider", "operation"})
)
