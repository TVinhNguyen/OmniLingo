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

	IdentityServiceURL  string
	ContentServiceURL   string
	ProgressServiceURL  string
	SRSServiceURL       string
	AllowedOrigins      []string

	DefaultDailyGoalMin int
	LogLevel            string
}

func Load() *Config {
	return &Config{
		Env:     getEnv("ENV", "development"),
		Port:    getEnv("PORT", "3002"),
		Version: getEnv("VERSION", "dev"),

		DatabaseURL: getEnv("DATABASE_URL", "postgres://omnilingo:omnilingo_dev@localhost:5432/learning_db?sslmode=disable"),

		KafkaBrokers: strings.Split(getEnv("KAFKA_BROKERS", "localhost:9094"), ","),
		KafkaEnabled: getBool("KAFKA_ENABLED", false),
		KafkaGroupID: getEnv("KAFKA_GROUP_ID", "learning-service"),

		IdentityServiceURL: getEnv("IDENTITY_SERVICE_URL", "http://localhost:3001"),
		ContentServiceURL:  getEnv("CONTENT_SERVICE_URL", "http://localhost:3003"),
		ProgressServiceURL: getEnv("PROGRESS_SERVICE_URL", "http://localhost:3008"),
		SRSServiceURL:      getEnv("SRS_SERVICE_URL", "http://localhost:3005"),
		AllowedOrigins:     strings.Split(getEnv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173"), ","),

		DefaultDailyGoalMin: getInt("DEFAULT_DAILY_GOAL_MIN", 15),
		LogLevel:            getEnv("LOG_LEVEL", "info"),
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
func getInt(key string, def int) int {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil { return n }
	}
	return def
}
