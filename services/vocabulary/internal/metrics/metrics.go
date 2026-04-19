package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	// HTTP metrics
	HTTPRequestsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "vocab_http_requests_total",
		Help: "Total HTTP requests to vocabulary-service",
	}, []string{"method", "route", "status_code"})

	HTTPRequestDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name:    "vocab_http_request_duration_seconds",
		Help:    "HTTP request duration for vocabulary-service",
		Buckets: prometheus.DefBuckets,
	}, []string{"method", "route"})

	// Business metrics
	WordSearchTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "vocab_word_search_total",
		Help: "Total word search requests",
	}, []string{"language", "status"})

	CardAddedTotal = promauto.NewCounter(prometheus.CounterOpts{
		Name: "vocab_card_added_total",
		Help: "Total vocabulary cards added to user decks",
	})

	DeckCreatedTotal = promauto.NewCounter(prometheus.CounterOpts{
		Name: "vocab_deck_created_total",
		Help: "Total decks created by users",
	})

	AnkiImportTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "vocab_anki_import_total",
		Help: "Total Anki imports",
	}, []string{"status"})

	// Cache metrics
	CacheHitsTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "vocab_cache_hits_total",
		Help: "Redis cache hits",
	}, []string{"resource"})

	CacheMissesTotal = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "vocab_cache_misses_total",
		Help: "Redis cache misses",
	}, []string{"resource"})

	// Catalog gauge (updated on startup/admin write)
	WordsCatalogTotal = promauto.NewGaugeVec(prometheus.GaugeOpts{
		Name: "vocab_words_catalog_total",
		Help: "Total words in system catalog",
	}, []string{"language"})
)
