package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	HTTPRequestsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "billing_http_requests_total",
	}, []string{"method", "route", "status"})

	HTTPRequestDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "billing_http_request_duration_seconds",
		Buckets: prometheus.ExponentialBuckets(0.005, 2, 9),
	}, []string{"method", "route"})

	SubscriptionsCreated = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "billing_subscriptions_created_total",
	}, []string{"plan_code", "provider"})

	SubscriptionsCanceled = promauto.NewCounter(prometheus.CounterOpts{
		Name: "billing_subscriptions_canceled_total",
	})

	InvoicesPaid = promauto.NewCounter(prometheus.CounterOpts{
		Name: "billing_invoices_paid_total",
	})

	RevenueTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "billing_revenue_cents_total",
		Help: "Total revenue in cents",
	}, []string{"currency"})
)
