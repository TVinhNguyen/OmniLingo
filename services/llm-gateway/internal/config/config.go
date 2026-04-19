package config

import "os"

// Config holds all env-based configuration for llm-gateway.
type Config struct {
	Env     string
	Port    string
	Version string

	// Postgres — stores requests log, budget, prompt templates
	DatabaseURL string

	// Redis — semantic response cache + rate limit counters
	RedisURL         string
	CacheTTLSec      int
	SemanticCacheOn  bool

	// Identity service (JWKS)
	IdentityServiceURL string

	// LLM Provider credentials
	AnthropicAPIKey string
	OpenAIAPIKey    string
	GoogleAPIKey    string // Gemini

	// Provider preference order (comma-separated): "anthropic,openai,google"
	ProviderOrder []string

	// Token budget limits (per user per day)
	BudgetFreeTokens     int
	BudgetPlusTokens     int
	BudgetProTokens      int
	BudgetUltimateTokens int // -1 = unlimited

	// CORS
	AllowedOrigins []string
}

func Load() *Config {
	return &Config{
		Env:     getEnv("ENV", "development"),
		Port:    getEnv("PORT", "3020"),
		Version: getEnv("VERSION", "dev"),

		DatabaseURL:     getEnv("DATABASE_URL", "postgres://omnilingo:omnilingo_dev@localhost:5432/llmgateway_db?sslmode=disable"),
		RedisURL:        getEnv("REDIS_URL", "redis://localhost:6379"),
		CacheTTLSec:     getEnvInt("CACHE_TTL_SEC", 3600), // 1h default for LLM responses
		SemanticCacheOn: getEnv("SEMANTIC_CACHE_ENABLED", "true") == "true",

		IdentityServiceURL: getEnv("IDENTITY_SERVICE_URL", "http://localhost:3001"),

		AnthropicAPIKey: getEnv("ANTHROPIC_API_KEY", ""),
		OpenAIAPIKey:    getEnv("OPENAI_API_KEY", ""),
		GoogleAPIKey:    getEnv("GOOGLE_API_KEY", ""),

		ProviderOrder: splitComma(getEnv("PROVIDER_ORDER", "anthropic,openai,google")),

		BudgetFreeTokens:     getEnvInt("BUDGET_FREE_TOKENS_PER_DAY", 4000),
		BudgetPlusTokens:     getEnvInt("BUDGET_PLUS_TOKENS_PER_DAY", 20000),
		BudgetProTokens:      getEnvInt("BUDGET_PRO_TOKENS_PER_DAY", -1),
		BudgetUltimateTokens: getEnvInt("BUDGET_ULTIMATE_TOKENS_PER_DAY", -1),

		AllowedOrigins: splitComma(getEnv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173")),
	}
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func getEnvInt(key string, def int) int {
	v := os.Getenv(key)
	if v == "" {
		return def
	}
	n := 0
	for _, c := range v {
		if c < '0' || c > '9' {
			return def
		}
		n = n*10 + int(c-'0')
	}
	return n
}

func splitComma(s string) []string {
	if s == "" {
		return nil
	}
	var out []string
	start := 0
	for i := 0; i <= len(s); i++ {
		if i == len(s) || s[i] == ',' {
			if p := s[start:i]; p != "" {
				out = append(out, p)
			}
			start = i + 1
		}
	}
	return out
}
