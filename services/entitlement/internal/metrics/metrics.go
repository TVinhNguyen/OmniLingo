package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

// Prometheus metric definitions for entitlement-service.
var (
	// HTTP
	HTTPRequestsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "entitlement_http_requests_total",
		Help: "Total HTTP requests received.",
	}, []string{"method", "route", "status"})

	HTTPRequestDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "entitlement_http_request_duration_seconds",
		Help:    "HTTP request duration in seconds.",
		Buckets: prometheus.DefBuckets,
	}, []string{"method", "route"})

	// Entitlement checks
	EntitlementChecksTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "entitlement_checks_total",
		Help: "Total entitlement check calls.",
	}, []string{"plan_tier", "feature_code", "result"}) // result: allowed | denied

	// Cache
	CacheHitsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "entitlement_cache_hits_total",
		Help: "Redis cache hits.",
	}, []string{"resource"})

	CacheMissesTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "entitlement_cache_misses_total",
		Help: "Redis cache misses — fell through to Postgres.",
	}, []string{"resource"})

	// Kafka consumer
	KafkaEventsProcessed = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "entitlement_kafka_events_processed_total",
		Help: "Kafka events processed by consumer.",
	}, []string{"topic", "status"}) // status: success | error
)
