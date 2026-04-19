package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	HTTPRequestsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "gamification_http_requests_total",
		Help: "Total HTTP requests to gamification-service",
	}, []string{"method", "route", "status"})

	HTTPRequestDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "gamification_http_request_duration_seconds",
		Help:    "HTTP request duration for gamification-service",
		Buckets: prometheus.ExponentialBuckets(0.005, 2, 9),
	}, []string{"method", "route"})

	XPAwarded = promauto.NewCounter(prometheus.CounterOpts{
		Name: "gamification_xp_awarded_total",
		Help: "Total XP awarded to users",
	})

	AchievementsUnlocked = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "gamification_achievements_unlocked_total",
		Help: "Total achievements unlocked",
	}, []string{"code"})

	StreamsFrozen = promauto.NewCounter(prometheus.CounterOpts{
		Name: "gamification_streaks_frozen_total",
		Help: "Total streak freezes used",
	})
)
