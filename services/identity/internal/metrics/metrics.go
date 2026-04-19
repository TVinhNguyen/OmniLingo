package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

// Identity service Prometheus metrics.
// Naming convention: identity_<subsystem>_<metric>
var (
	// HTTP request metrics
	HTTPRequestsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "identity_http_requests_total",
		Help: "Total number of HTTP requests",
	}, []string{"method", "route", "status"})

	HTTPRequestDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "identity_http_request_duration_seconds",
		Help:    "HTTP request duration",
		Buckets: []float64{.005, .01, .025, .05, .1, .25, .5, 1, 2.5},
	}, []string{"method", "route"})

	// Auth metrics
	AuthLoginTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "identity_auth_login_total",
		Help: "Total login attempts",
	}, []string{"status"}) // status: "success" | "failure" | "locked" | "rate_limited"

	AuthRegisterTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "identity_auth_register_total",
		Help: "Total registration attempts",
	}, []string{"status"}) // status: "success" | "failure" | "duplicate"

	AuthRefreshTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "identity_auth_refresh_total",
		Help: "Total token refresh attempts",
	}, []string{"status"}) // status: "success" | "failure" | "reuse_detected"

	AuthLogoutTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "identity_auth_logout_total",
		Help: "Total logout requests",
	}, []string{"status"})

	// Session metrics
	SessionActiveCount = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "identity_session_active_count",
		Help: "Number of currently active sessions",
	})

	// Security events
	BruteForceEvents = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "identity_brute_force_events_total",
		Help: "Brute force detection events",
	}, []string{"type"}) // type: "lockout" | "token_reuse"

	RateLimitHits = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "identity_rate_limit_hits_total",
		Help: "Rate limit threshold exceeded",
	}, []string{"endpoint"})

	// Password security
	HIBPChecks = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "identity_hibp_checks_total",
		Help: "HIBP password checks",
	}, []string{"result"}) // result: "clean" | "compromised" | "api_error"

	// P99 login latency — track separately for SLO
	LoginLatency = promauto.NewHistogram(prometheus.HistogramOpts{
		Name:    "identity_login_duration_seconds",
		Help:    "Login request duration (SLO: P99 < 200ms)",
		Buckets: []float64{.01, .025, .05, .1, .15, .2, .25, .5, 1},
	})
)
