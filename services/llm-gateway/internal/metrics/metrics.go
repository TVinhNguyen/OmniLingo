package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	HTTPRequestsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "llmgateway_http_requests_total",
	}, []string{"method", "route", "status"})

	HTTPRequestDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "llmgateway_http_request_duration_seconds",
		Buckets: []float64{0.1, 0.5, 1, 2, 5, 10, 30, 60, 90},
	}, []string{"method", "route"})

	CompletionsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "llmgateway_completions_total",
		Help: "Total LLM completions by provider and caller service.",
	}, []string{"provider", "caller", "status"})

	TokensUsedTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "llmgateway_tokens_used_total",
		Help: "Total tokens consumed.",
	}, []string{"provider", "model"})

	ProviderErrorsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "llmgateway_provider_errors_total",
		Help: "Provider API failures leading to fallback.",
	}, []string{"provider"})

	ProviderLatency = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "llmgateway_provider_latency_seconds",
		Buckets: []float64{0.5, 1, 2, 5, 10, 30, 60, 90},
	}, []string{"provider", "model"})

	CacheHitsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "llmgateway_cache_hits_total",
	}, []string{"resource"})

	CacheMissesTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "llmgateway_cache_misses_total",
	}, []string{"resource"})

	BudgetExhaustedTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "llmgateway_budget_exhausted_total",
		Help: "Requests rejected due to token budget exhaustion.",
	}, []string{"caller"})
)
