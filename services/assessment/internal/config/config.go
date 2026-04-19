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
	RedisURL    string

	KafkaBrokers  []string
	KafkaEnabled  bool
	KafkaGroupID  string

	IdentityServiceURL string
	AllowedOrigins     []string

	LogLevel string
}

func Load() *Config {
	return &Config{
		Env:     getEnv("ENV", "development"),
		Port:    getEnv("PORT", "3007"),
		Version: getEnv("VERSION", "dev"),

		DatabaseURL: getEnv("DATABASE_URL", "postgres://omnilingo:omnilingo_dev@localhost:5432/assessment_db?sslmode=disable"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379"),

		KafkaBrokers: strings.Split(getEnv("KAFKA_BROKERS", "localhost:9094"), ","),
		KafkaEnabled: getBool("KAFKA_ENABLED", false),
		KafkaGroupID: getEnv("KAFKA_GROUP_ID", "assessment-service"),

		IdentityServiceURL: getEnv("IDENTITY_SERVICE_URL", "http://localhost:3001"),
		AllowedOrigins:     strings.Split(getEnv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173"), ","),

		LogLevel: getEnv("LOG_LEVEL", "info"),
	}
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func getBool(key string, def bool) bool {
	if v := os.Getenv(key); v != "" {
		b, err := strconv.ParseBool(v)
		if err == nil {
			return b
		}
	}
	return def
}
