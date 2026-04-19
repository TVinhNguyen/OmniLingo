package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	HTTPRequestsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "assessment_http_requests_total",
		Help: "Total HTTP requests to assessment-service",
	}, []string{"method", "route", "status"})

	HTTPRequestDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "assessment_http_request_duration_seconds",
		Help:    "HTTP request duration for assessment-service",
		Buckets: prometheus.ExponentialBuckets(0.005, 2, 9),
	}, []string{"method", "route"})

	ExercisesGraded = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "assessment_exercises_graded_total",
		Help: "Total exercises graded by type",
	}, []string{"exercise_type", "correct"})

	TestsCompleted = promauto.NewCounter(prometheus.CounterOpts{
		Name: "assessment_tests_completed_total",
		Help: "Total mock tests completed",
	})

	GradingDuration = promauto.NewHistogram(prometheus.HistogramOpts{
		Name:    "assessment_grading_duration_seconds",
		Help:    "Time taken to grade an exercise",
		Buckets: prometheus.ExponentialBuckets(0.001, 2, 8),
	})
)
