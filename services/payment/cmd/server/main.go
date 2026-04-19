package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/omnilingo/payment-service/internal/config"
	"github.com/omnilingo/payment-service/internal/handler"
	"github.com/omnilingo/payment-service/internal/messaging"
	"github.com/omnilingo/payment-service/internal/middleware"
	"github.com/omnilingo/payment-service/internal/provider"
	providerMomo "github.com/omnilingo/payment-service/internal/provider/momo"
	providerStripe "github.com/omnilingo/payment-service/internal/provider/stripe"
	providerVNPay "github.com/omnilingo/payment-service/internal/provider/vnpay"
	"github.com/omnilingo/payment-service/internal/repository"
	"github.com/omnilingo/payment-service/internal/service"
	"github.com/omnilingo/payment-service/internal/telemetry"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/valyala/fasthttp/fasthttpadaptor"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func main() {
	// ─── Config ───────────────────────────────────────────────────────────────
	cfg := config.Load()

	// ─── Logger ───────────────────────────────────────────────────────────────
	log := buildLogger(cfg.Env)
	defer log.Sync() //nolint:errcheck

	log.Info("starting payment-service",
		zap.String("env", cfg.Env),
		zap.String("port", cfg.Port),
		zap.String("version", cfg.Version))

	// ─── OpenTelemetry ────────────────────────────────────────────────────────
	ctx := context.Background()
	otelShutdown, err := telemetry.Init(ctx, "payment-service", cfg.Version, cfg.Env)
	if err != nil {
		log.Warn("otel init failed (non-fatal)", zap.Error(err))
	} else {
		defer otelShutdown(ctx) //nolint:errcheck
	}

	// ─── Database ─────────────────────────────────────────────────────────────
	db, err := repository.NewPostgres(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatal("failed to connect to postgres", zap.Error(err))
	}
	defer db.Close()

	if err := repository.RunMigrations(cfg.DatabaseURL, "migrations"); err != nil {
		log.Fatal("migration failed", zap.Error(err))
	}
	log.Info("database migrations applied")

	// ─── Repositories ─────────────────────────────────────────────────────────
	intentRepo := repository.NewPaymentIntentRepository(db)
	webhookRepo := repository.NewWebhookEventRepository(db)
	txRepo := repository.NewPaymentTransactionRepository(db)
	outboxRepo := repository.NewOutboxRepository(db)

	// ─── Kafka Publisher ──────────────────────────────────────────────────────
	var pub messaging.Publisher
	if cfg.KafkaEnabled {
		pub = messaging.NewPublisher(cfg.KafkaBrokers, log)
		log.Info("kafka publisher enabled", zap.Strings("brokers", cfg.KafkaBrokers))
	} else {
		pub = messaging.NewNoopPublisher(log)
		log.Info("kafka disabled — using noop publisher")
	}
	defer pub.Close() //nolint:errcheck

	// ─── Provider Registry ────────────────────────────────────────────────────
	reg := provider.NewRegistry()

	if cfg.StripeEnabled {
		if cfg.StripeSecretKey == "" || cfg.StripeWebhookSecret == "" {
			log.Fatal("stripe enabled but STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is not set")
		}
		reg.Register(providerStripe.New(cfg.StripeSecretKey, cfg.StripeWebhookSecret, log))
		log.Info("stripe provider registered")
	}

	if cfg.VNPayEnabled {
		if cfg.VNPayTmnCode == "" || cfg.VNPayHashSecret == "" {
			log.Fatal("vnpay enabled but VNPAY_TMN_CODE or VNPAY_HASH_SECRET is not set")
		}
		reg.Register(providerVNPay.New(cfg.VNPayTmnCode, cfg.VNPayHashSecret, cfg.VNPayBaseURL, cfg.VNPayReturnURL, log))
		log.Info("vnpay provider registered")
	}

	if cfg.MoMoEnabled {
		if cfg.MoMoPartnerCode == "" || cfg.MoMoSecretKey == "" {
			log.Fatal("momo enabled but MOMO_PARTNER_CODE or MOMO_SECRET_KEY is not set")
		}
		reg.Register(providerMomo.New(cfg.MoMoPartnerCode, cfg.MoMoAccessKey, cfg.MoMoSecretKey, cfg.MoMoBaseURL, cfg.MoMoReturnURL, cfg.MoMoNotifyURL, log))
		log.Info("momo provider registered")
	}

	// ─── Service ──────────────────────────────────────────────────────────────
	svc := service.NewPaymentService(db, intentRepo, webhookRepo, txRepo, outboxRepo, reg, pub, log)

	// ─── Outbox Relay (at-least-once delivery) ─────────────────────────────────
	relayCtx, cancelRelay := context.WithCancel(context.Background())
	go messaging.NewOutboxRelay(outboxRepo, pub, log).Run(relayCtx)
	log.Info("outbox relay started")

	// ─── JWKS Auth ────────────────────────────────────────────────────────────
	jwksAuth, err := middleware.NewJWKSAuth(cfg.IdentityServiceURL)
	if err != nil {
		log.Fatal("failed to initialise JWKS auth", zap.Error(err))
	}

	// ─── Fiber App ────────────────────────────────────────────────────────────
	app := fiber.New(fiber.Config{
		BodyLimit:    64 * 1024,                  // 64KB for most routes
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		ErrorHandler: fiberErrorHandler,
	})

	app.Use(middleware.RequestID())
	app.Use(middleware.CORS(cfg.AllowedOrigins))
	app.Use(middleware.Prometheus())

	// ─── Health endpoints ─────────────────────────────────────────────────────
	app.Get("/healthz", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})
	app.Get("/readyz", readyzHandler(db))
	app.Get("/metrics", func(c *fiber.Ctx) error {
		fasthttpadaptor.NewFastHTTPHandler(promhttp.Handler())(c.Context())
		return nil
	})

	// ─── API Routes ───────────────────────────────────────────────────────────
	v1 := app.Group("/api/v1")
	checkoutH := handler.NewCheckoutHandler(svc, log)
	checkoutH.RegisterRoutes(v1, jwksAuth)

	// Webhooks: larger body limit (Stripe can send up to ~512KB)
	// We handle them on a separate group with relaxed body limit
	webhookGroup := app.Group("")
	webhookH := handler.NewWebhookHandler(svc, log)
	webhookH.RegisterRoutes(webhookGroup)

	// ─── Graceful shutdown ────────────────────────────────────────────────────
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Info("payment-service listening", zap.String("addr", ":"+cfg.Port))
		if err := app.Listen(":" + cfg.Port); err != nil {
			log.Error("fiber listen error", zap.Error(err))
		}
	}()

	<-quit
	log.Info("received shutdown signal, draining...")
	cancelRelay() // stop outbox relay loop

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := app.ShutdownWithContext(shutdownCtx); err != nil {
		log.Error("graceful shutdown failed", zap.Error(err))
	}
	log.Info("payment-service stopped")
}

// ─── Readiness check ─────────────────────────────────────────────────────────

func readyzHandler(db *pgxpool.Pool) fiber.Handler {
	return func(c *fiber.Ctx) error {
		if err := db.Ping(c.Context()); err != nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"status": "not ready", "reason": "postgres unreachable",
			})
		}
		return c.JSON(fiber.Map{"status": "ready"})
	}
}

// ─── Global Fiber error handler ───────────────────────────────────────────────

func fiberErrorHandler(c *fiber.Ctx, err error) error {
	if e, ok := err.(*fiber.Error); ok {
		return c.Status(e.Code).JSON(fiber.Map{
			"error": "REQUEST_ERROR", "message": e.Message,
		})
	}
	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		"error": "INTERNAL_ERROR", "message": "internal server error",
	})
}

// ─── Logger factory ───────────────────────────────────────────────────────────

func buildLogger(env string) *zap.Logger {
	var cfg zap.Config
	if env == "production" {
		cfg = zap.NewProductionConfig()
	} else {
		cfg = zap.NewDevelopmentConfig()
		cfg.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	}
	log, err := cfg.Build()
	if err != nil {
		panic("failed to build logger: " + err.Error())
	}
	return log.With(zap.String("service", "payment-service"))
}
