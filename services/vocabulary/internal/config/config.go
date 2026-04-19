package config

import (
	"os"
	"strconv"
	"strings"
)

// Config holds all environment configuration for vocabulary-service.
type Config struct {
	Env     string
	Port    string
	Version string

	// Database
	DatabaseURL string

	// Redis
	RedisURL string

	// Kafka
	KafkaBrokers []string
	KafkaEnabled bool

	// Identity service (JWKS)
	IdentityServiceURL string

	// CORS
	AllowedOrigins []string

	// Observability
	LogLevel    string
	OTELEnabled bool
	OTELEndpoint string

	// Anki import file size limit (default 10MB)
	AnkiMaxSizeBytes int64
}

// Load reads configuration from environment variables with sensible defaults.
func Load() *Config {
	return &Config{
		Env:     getEnv("ENV", "development"),
		Port:    getEnv("PORT", "3004"),
		Version: getEnv("VERSION", "dev"),

		DatabaseURL: getEnv("DATABASE_URL",
			"postgres://postgres:postgres@localhost:5432/vocabulary_db?sslmode=disable"),
		RedisURL: getEnv("REDIS_URL", "redis://localhost:6379"),

		KafkaBrokers: splitCSV(getEnv("KAFKA_BROKERS", "localhost:9094")),
		KafkaEnabled: getBool("KAFKA_ENABLED", false),

		IdentityServiceURL: getEnv("IDENTITY_SERVICE_URL", "http://localhost:3001"),

		AllowedOrigins: splitCSV(getEnv("ALLOWED_ORIGINS",
			"http://localhost:3000,http://localhost:5173")),

		LogLevel:     getEnv("LOG_LEVEL", "info"),
		OTELEnabled:  getBool("OTEL_ENABLED", false),
		OTELEndpoint: getEnv("OTEL_ENDPOINT", "localhost:4317"),

		AnkiMaxSizeBytes: getInt64("ANKI_MAX_SIZE_BYTES", 10*1024*1024), // 10MB
	}
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func getBool(key string, def bool) bool {
	v := os.Getenv(key)
	if v == "" {
		return def
	}
	b, err := strconv.ParseBool(v)
	if err != nil {
		return def
	}
	return b
}

func getInt64(key string, def int64) int64 {
	v := os.Getenv(key)
	if v == "" {
		return def
	}
	n, err := strconv.ParseInt(v, 10, 64)
	if err != nil {
		return def
	}
	return n
}

func splitCSV(s string) []string {
	if s == "" {
		return nil
	}
	parts := strings.Split(s, ",")
	result := make([]string, 0, len(parts))
	for _, p := range parts {
		if t := strings.TrimSpace(p); t != "" {
			result = append(result, t)
		}
	}
	return result
}
