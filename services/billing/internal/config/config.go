package config

import (
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Env     string
	Port    string
	Version string

	DatabaseURL string

	KafkaBrokers []string
	KafkaEnabled bool
	KafkaGroupID string

	IdentityServiceURL string
	AllowedOrigins     []string

	WebhookSecret string // for Stripe/provider signature verification
	LogLevel      string
}

func Load() *Config {
	return &Config{
		Env:     getEnv("ENV", "development"),
		Port:    getEnv("PORT", "3010"),
		Version: getEnv("VERSION", "dev"),

		DatabaseURL: getEnv("DATABASE_URL", "postgres://omnilingo:omnilingo_dev@localhost:5432/billing_db?sslmode=disable"),

		KafkaBrokers: strings.Split(getEnv("KAFKA_BROKERS", "localhost:9094"), ","),
		KafkaEnabled: getBool("KAFKA_ENABLED", false),
		KafkaGroupID: getEnv("KAFKA_GROUP_ID", "billing-service"),

		IdentityServiceURL: getEnv("IDENTITY_SERVICE_URL", "http://localhost:3001"),
		AllowedOrigins:     strings.Split(getEnv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173"), ","),

		WebhookSecret: getEnv("WEBHOOK_SECRET", ""),
		LogLevel:      getEnv("LOG_LEVEL", "info"),
	}
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" { return v }
	return def
}
func getBool(key string, def bool) bool {
	if v := os.Getenv(key); v != "" {
		if b, err := strconv.ParseBool(v); err == nil { return b }
	}
	return def
}
