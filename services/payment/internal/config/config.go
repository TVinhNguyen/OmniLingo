package config

import "os"

// Config holds all payment-service configuration loaded from environment variables.
type Config struct {
	Env     string
	Port    string
	Version string

	// Database
	DatabaseURL string

	// Redis (idempotency cache)
	RedisURL string

	// Kafka
	KafkaBrokers  []string
	KafkaEnabled  bool
	KafkaGroupID  string

	// Identity (JWKS)
	IdentityServiceURL string

	// CORS
	AllowedOrigins []string

	// Stripe
	StripeSecretKey    string
	StripeWebhookSecret string
	StripeEnabled      bool

	// VNPay
	VNPayTmnCode     string
	VNPayHashSecret  string
	VNPayBaseURL     string
	VNPayReturnURL   string
	VNPayEnabled     bool

	// MoMo
	MoMoPartnerCode  string
	MoMoAccessKey    string
	MoMoSecretKey    string
	MoMoBaseURL      string
	MoMoReturnURL    string
	MoMoNotifyURL    string
	MoMoEnabled      bool

	// Billing service callback (to notify payment completed)
	BillingServiceURL string
}

// Load reads config from environment with safe defaults.
func Load() *Config {
	return &Config{
		Env:     getEnv("ENV", "development"),
		Port:    getEnv("PORT", "3015"),
		Version: getEnv("VERSION", "dev"),

		DatabaseURL: getEnv("DATABASE_URL", "postgres://omnilingo:omnilingo_dev@localhost:5432/payment_db?sslmode=disable"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379"),

		KafkaBrokers: splitComma(getEnv("KAFKA_BROKERS", "localhost:9094")),
		KafkaEnabled: getEnv("KAFKA_ENABLED", "false") == "true",
		KafkaGroupID: getEnv("KAFKA_GROUP_ID", "payment-service"),

		IdentityServiceURL: getEnv("IDENTITY_SERVICE_URL", "http://localhost:3001"),
		AllowedOrigins:     splitComma(getEnv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173")),

		// Stripe
		StripeSecretKey:    getEnv("STRIPE_SECRET_KEY", ""),
		StripeWebhookSecret: getEnv("STRIPE_WEBHOOK_SECRET", ""),
		StripeEnabled:      getEnv("STRIPE_ENABLED", "false") == "true",

		// VNPay
		VNPayTmnCode:    getEnv("VNPAY_TMN_CODE", ""),
		VNPayHashSecret: getEnv("VNPAY_HASH_SECRET", ""),
		VNPayBaseURL:    getEnv("VNPAY_BASE_URL", "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"),
		VNPayReturnURL:  getEnv("VNPAY_RETURN_URL", "http://localhost:3000/payment/vnpay/return"),
		VNPayEnabled:    getEnv("VNPAY_ENABLED", "false") == "true",

		// MoMo
		MoMoPartnerCode: getEnv("MOMO_PARTNER_CODE", ""),
		MoMoAccessKey:   getEnv("MOMO_ACCESS_KEY", ""),
		MoMoSecretKey:   getEnv("MOMO_SECRET_KEY", ""),
		MoMoBaseURL:     getEnv("MOMO_BASE_URL", "https://test-payment.momo.vn/v2/gateway/api/create"),
		MoMoReturnURL:   getEnv("MOMO_RETURN_URL", "http://localhost:3000/payment/momo/return"),
		MoMoNotifyURL:   getEnv("MOMO_NOTIFY_URL", "http://localhost:3015/webhooks/momo"),
		MoMoEnabled:     getEnv("MOMO_ENABLED", "false") == "true",

		BillingServiceURL: getEnv("BILLING_SERVICE_URL", "http://localhost:3014"),
	}
}

func getEnv(key, defaultVal string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return defaultVal
}

func splitComma(s string) []string {
	if s == "" {
		return nil
	}
	var parts []string
	start := 0
	for i := 0; i <= len(s); i++ {
		if i == len(s) || s[i] == ',' {
			p := s[start:i]
			if p != "" {
				parts = append(parts, p)
			}
			start = i + 1
		}
	}
	return parts
}
