package config

import "os"

// Config holds all configuration for entitlement-service.
type Config struct {
	Env     string
	Port    string
	Version string

	// Database (source of truth)
	DatabaseURL string

	// Redis (L1 cache — TTL 5 min per spec: downgrade must propagate within 5 min)
	RedisURL    string
	CacheTTLSec int // default 300

	// Kafka
	KafkaBrokers []string
	KafkaEnabled bool
	KafkaGroupID string

	// Identity service (JWKS)
	IdentityServiceURL string

	// CORS
	AllowedOrigins []string
}

// Load reads config from environment variables with safe defaults.
func Load() *Config {
	return &Config{
		Env:     getEnv("ENV", "development"),
		Port:    getEnv("PORT", "3016"),
		Version: getEnv("VERSION", "dev"),

		DatabaseURL: getEnv("DATABASE_URL",
			"postgres://omnilingo:omnilingo_dev@localhost:5432/entitlement_db?sslmode=disable"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379"),
		CacheTTLSec: getEnvInt("CACHE_TTL_SEC", 300), // 5 minutes

		KafkaBrokers: splitComma(getEnv("KAFKA_BROKERS", "localhost:9094")),
		KafkaEnabled: getEnv("KAFKA_ENABLED", "false") == "true",
		KafkaGroupID: getEnv("KAFKA_GROUP_ID", "entitlement-service"),

		IdentityServiceURL: getEnv("IDENTITY_SERVICE_URL", "http://localhost:3001"),
		AllowedOrigins:     splitComma(getEnv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173")),
	}
}

func getEnv(key, defaultVal string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return defaultVal
}

func getEnvInt(key string, defaultVal int) int {
	v := os.Getenv(key)
	if v == "" {
		return defaultVal
	}
	n := 0
	for _, c := range v {
		if c < '0' || c > '9' {
			return defaultVal
		}
		n = n*10 + int(c-'0')
	}
	return n
}

func splitComma(s string) []string {
	if s == "" {
		return nil
	}
	var parts []string
	start := 0
	for i := 0; i <= len(s); i++ {
		if i == len(s) || s[i] == ',' {
			if p := s[start:i]; p != "" {
				parts = append(parts, p)
			}
			start = i + 1
		}
	}
	return parts
}
