package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	HTTPRequestsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "learning_http_requests_total",
		Help: "Total HTTP requests to learning-service",
	}, []string{"method", "route", "status"})

	HTTPRequestDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "learning_http_request_duration_seconds",
		Help:    "HTTP request duration for learning-service",
		Buckets: prometheus.ExponentialBuckets(0.005, 2, 9),
	}, []string{"method", "route"})

	LessonsStarted   = promauto.NewCounter(prometheus.CounterOpts{
		Name: "learning_lessons_started_total",
	})
	LessonsCompleted = promauto.NewCounter(prometheus.CounterOpts{
		Name: "learning_lessons_completed_total",
	})
)
