package config

import (
	"os"
	"strconv"
	"time"
)

// Config holds all configuration values for the identity-service.
type Config struct {
	Env     string
	Port    string
	Version string

	// Database
	DatabaseURL string
	RedisURL    string

	// JWT — RS256 in production
	JWTPrivateKeyPath string // Path to RSA private key PEM (prod). Empty = generate in-memory (dev).
	JWTPublicKeyPath  string // Path to RSA public key PEM (prod).
	JWTKeyID          string // kid for JWKS
	AccessTokenTTL    time.Duration
	RefreshTokenTTL   time.Duration

	// Argon2id — OWASP recommended
	ArgonMemory      uint32
	ArgonIterations  uint32
	ArgonParallelism uint8
	ArgonSaltLength  uint32
	ArgonKeyLength   uint32

	// CORS
	AllowedOrigins []string

	// Rate limiting
	RateLoginMaxPerIP       int           // max login attempts per IP per window
	RateLoginWindowPerIP    time.Duration
	RateLoginMaxPerEmail    int           // max login attempts per email per window
	RateLoginWindowPerEmail time.Duration
	RateRegisterMaxPerIP    int
	RateRegisterWindowPerIP time.Duration

	// Brute force lockout
	MaxFailedLoginAttempts int
	AccountLockDuration    time.Duration

	// HIBP (HaveIBeenPwned)
	HIBPEnabled bool
	HIBPTimeout time.Duration

	// Kafka
	KafkaBrokers []string
	KafkaEnabled bool

	// OAuth providers
	GoogleClientID     string
	GoogleClientSecret string
	AppleClientID      string
	AppleTeamID        string
	AppleKeyID         string
	ApplePrivateKey    string

	// Telemetry
	OTelEndpoint string // OTLP endpoint (empty = stdout exporter in dev)
	OTelEnabled  bool

	// App
	BaseURL string
}

// Load reads configuration from environment variables with sensible defaults.
func Load() *Config {
	return &Config{
		Env:     getEnv("ENV", "development"),
		Port:    getEnv("PORT", "3001"),
		Version: getEnv("VERSION", "dev"),

		DatabaseURL: getEnv("DATABASE_URL", "postgres://omnilingo:omnilingo_dev@localhost:5432/identity_db?sslmode=disable"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379/0"),

		JWTPrivateKeyPath: getEnv("JWT_PRIVATE_KEY_PATH", ""),
		JWTPublicKeyPath:  getEnv("JWT_PUBLIC_KEY_PATH", ""),
		JWTKeyID:          getEnv("JWT_KEY_ID", "key-1"),
		AccessTokenTTL:    getDurationEnv("ACCESS_TOKEN_TTL", 15*time.Minute),
		RefreshTokenTTL:   getDurationEnv("REFRESH_TOKEN_TTL", 30*24*time.Hour),

		// OWASP recommended argon2id
		ArgonMemory:      uint32(getIntEnv("ARGON_MEMORY", 19456)),
		ArgonIterations:  uint32(getIntEnv("ARGON_ITERATIONS", 2)),
		ArgonParallelism: uint8(getIntEnv("ARGON_PARALLELISM", 1)),
		ArgonSaltLength:  uint32(getIntEnv("ARGON_SALT_LEN", 16)),
		ArgonKeyLength:   uint32(getIntEnv("ARGON_KEY_LEN", 32)),

		AllowedOrigins: splitEnv("ALLOWED_ORIGINS", []string{
			"http://localhost:3000",
			"http://localhost:3002",
		}),

		// Rate limiting
		RateLoginMaxPerIP:       getIntEnv("RATE_LOGIN_MAX_PER_IP", 5),
		RateLoginWindowPerIP:    getDurationEnv("RATE_LOGIN_WINDOW_PER_IP", 15*time.Minute),
		RateLoginMaxPerEmail:    getIntEnv("RATE_LOGIN_MAX_PER_EMAIL", 10),
		RateLoginWindowPerEmail: getDurationEnv("RATE_LOGIN_WINDOW_PER_EMAIL", time.Hour),
		RateRegisterMaxPerIP:    getIntEnv("RATE_REGISTER_MAX_PER_IP", 3),
		RateRegisterWindowPerIP: getDurationEnv("RATE_REGISTER_WINDOW_PER_IP", time.Hour),

		// Brute force lockout
		MaxFailedLoginAttempts: getIntEnv("MAX_FAILED_LOGIN_ATTEMPTS", 10),
		AccountLockDuration:    getDurationEnv("ACCOUNT_LOCK_DURATION", 15*time.Minute),

		// HIBP
		HIBPEnabled: getBoolEnv("HIBP_ENABLED", true),
		HIBPTimeout: getDurationEnv("HIBP_TIMEOUT", 3*time.Second),

		// Kafka
		KafkaBrokers: splitEnv("KAFKA_BROKERS", []string{"localhost:9094"}),
		KafkaEnabled: getBoolEnv("KAFKA_ENABLED", false), // disabled by default in dev

		// OAuth
		GoogleClientID:     getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
		AppleClientID:      getEnv("APPLE_CLIENT_ID", ""),
		AppleTeamID:        getEnv("APPLE_TEAM_ID", ""),
		AppleKeyID:         getEnv("APPLE_KEY_ID", ""),
		ApplePrivateKey:    getEnv("APPLE_PRIVATE_KEY", ""),

		// Telemetry
		OTelEndpoint: getEnv("OTEL_EXPORTER_OTLP_ENDPOINT", ""),
		OTelEnabled:  getBoolEnv("OTEL_ENABLED", false),

		BaseURL: getEnv("BASE_URL", "http://localhost:3001"),
	}
}

// ─── helpers ─────────────────────────────────────────────────────────────────

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getIntEnv(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return fallback
}

func getDurationEnv(key string, fallback time.Duration) time.Duration {
	if v := os.Getenv(key); v != "" {
		if d, err := time.ParseDuration(v); err == nil {
			return d
		}
	}
	return fallback
}

func getBoolEnv(key string, fallback bool) bool {
	if v := os.Getenv(key); v != "" {
		if b, err := strconv.ParseBool(v); err == nil {
			return b
		}
	}
	return fallback
}

func splitEnv(key string, fallback []string) []string {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	var result []string
	start := 0
	for i := 0; i <= len(v); i++ {
		if i == len(v) || v[i] == ',' {
			part := v[start:i]
			if part != "" {
				result = append(result, part)
			}
			start = i + 1
		}
	}
	return result
}
