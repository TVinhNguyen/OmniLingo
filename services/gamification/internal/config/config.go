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

	// League leaderboard config
	LeagueWeeklyXPThreshold int // min XP for promotion
}

func Load() *Config {
	return &Config{
		Env:     getEnv("ENV", "development"),
		Port:    getEnv("PORT", "3009"),
		Version: getEnv("VERSION", "dev"),

		DatabaseURL: getEnv("DATABASE_URL", "postgres://omnilingo:omnilingo_dev@localhost:5432/gamification_db?sslmode=disable"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379"),

		KafkaBrokers: strings.Split(getEnv("KAFKA_BROKERS", "localhost:9094"), ","),
		KafkaEnabled: getBool("KAFKA_ENABLED", false),
		KafkaGroupID: getEnv("KAFKA_GROUP_ID", "gamification-service"),

		IdentityServiceURL: getEnv("IDENTITY_SERVICE_URL", "http://localhost:3001"),
		AllowedOrigins:     strings.Split(getEnv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173"), ","),

		LogLevel: getEnv("LOG_LEVEL", "info"),

		LeagueWeeklyXPThreshold: getInt("LEAGUE_WEEKLY_XP_THRESHOLD", 500),
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
