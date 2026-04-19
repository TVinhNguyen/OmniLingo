package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	HTTPRequestsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "progress_http_requests_total",
		Help: "Total HTTP requests to progress-service",
	}, []string{"method", "route", "status"})

	HTTPRequestDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "progress_http_request_duration_seconds",
		Help:    "HTTP request duration for progress-service",
		Buckets: prometheus.ExponentialBuckets(0.005, 2, 9),
	}, []string{"method", "route"})

	SkillScoreUpdates = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "progress_skill_score_updates_total",
		Help: "Total skill score updates",
	}, []string{"language", "skill"})

	PredictionsComputed = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "progress_predictions_computed_total",
		Help: "Cert score predictions computed",
	}, []string{"cert"})
)
