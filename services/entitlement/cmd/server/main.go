package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/omnilingo/entitlement-service/internal/config"
	"github.com/omnilingo/entitlement-service/internal/handler"
	"github.com/omnilingo/entitlement-service/internal/messaging"
	"github.com/omnilingo/entitlement-service/internal/middleware"
	"github.com/omnilingo/entitlement-service/internal/repository"
	"github.com/omnilingo/entitlement-service/internal/service"
	"github.com/omnilingo/entitlement-service/internal/telemetry"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/redis/go-redis/v9"
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

	log.Info("starting entitlement-service",
		zap.String("env", cfg.Env),
		zap.String("port", cfg.Port),
		zap.String("version", cfg.Version))

	// ─── OpenTelemetry ────────────────────────────────────────────────────────
	ctx := context.Background()
	otelShutdown, err := telemetry.Init(ctx, "entitlement-service", cfg.Version, cfg.Env)
	if err != nil {
		log.Warn("otel init failed (non-fatal)", zap.Error(err))
	} else {
		defer otelShutdown(ctx) //nolint:errcheck
	}

	// ─── Database ─────────────────────────────────────────────────────────────
	db, err := repository.NewPostgres(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatal("postgres connection failed", zap.Error(err))
	}
	defer db.Close()

	if err := repository.RunMigrations(cfg.DatabaseURL, "migrations"); err != nil {
		log.Fatal("migration failed", zap.Error(err))
	}
	log.Info("database migrations applied")

	// ─── Redis ────────────────────────────────────────────────────────────────
	rdb, err := connectRedis(ctx, cfg.RedisURL)
	if err != nil {
		log.Fatal("redis connection failed", zap.Error(err))
	}
	defer rdb.Close()
	log.Info("redis connected", zap.String("url", cfg.RedisURL))

	// ─── Repositories ─────────────────────────────────────────────────────────
	entRepo := repository.NewEntitlementRepository(db)
	featureRepo := repository.NewPlanFeatureRepository(db)

	// ─── Service ──────────────────────────────────────────────────────────────
	svc := service.NewEntitlementService(entRepo, featureRepo, rdb, cfg.CacheTTLSec, log)

	// ─── JWKS Auth ────────────────────────────────────────────────────────────
	jwksAuth, err := middleware.NewJWKSAuth(cfg.IdentityServiceURL)
	if err != nil {
		log.Fatal("JWKS auth init failed", zap.Error(err))
	}

	// ─── Fiber App ────────────────────────────────────────────────────────────
	app := fiber.New(fiber.Config{
		BodyLimit:    64 * 1024, // 64KB per coding-standards.md §4.2
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		ErrorHandler: fiberErrorHandler,
	})

	app.Use(middleware.RequestID())
	app.Use(middleware.CORS(cfg.AllowedOrigins))
	app.Use(middleware.Prometheus())

	// ─── Health endpoints ─────────────────────────────────────────────────────
	app.Get("/healthz", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})
	app.Get("/readyz", readyzHandler(db, rdb))
	app.Get("/metrics", func(c *fiber.Ctx) error {
		fasthttpadaptor.NewFastHTTPHandler(promhttp.Handler())(c.Context())
		return nil
	})

	// ─── API Routes ───────────────────────────────────────────────────────────
	v1 := app.Group("/api/v1")
	entH := handler.NewEntitlementHandler(svc, log)
	entH.RegisterRoutes(v1, jwksAuth)

	adminH := handler.NewAdminHandler(svc, log)
	adminH.RegisterRoutes(app)

	// ─── Kafka Consumer ───────────────────────────────────────────────────────
	consumerCtx, cancelConsumer := context.WithCancel(context.Background())
	defer cancelConsumer()

	if cfg.KafkaEnabled {
		consumer := messaging.NewConsumer(cfg.KafkaBrokers, cfg.KafkaGroupID, svc, log)
		defer consumer.Close() //nolint:errcheck
		go consumer.Run(consumerCtx)
		log.Info("kafka consumer started", zap.Strings("brokers", cfg.KafkaBrokers))
	} else {
		log.Info("kafka disabled — consumer not started")
	}

	// ─── Graceful Shutdown ────────────────────────────────────────────────────
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Info("entitlement-service listening", zap.String("addr", ":"+cfg.Port))
		if err := app.Listen(":" + cfg.Port); err != nil {
			log.Error("fiber listen error", zap.Error(err))
		}
	}()

	<-quit
	log.Info("shutdown signal received, draining...")

	cancelConsumer() // stop Kafka consumer loop

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := app.ShutdownWithContext(shutdownCtx); err != nil {
		log.Error("graceful shutdown failed", zap.Error(err))
	}
	log.Info("entitlement-service stopped")
}

// ─── Readiness check ─────────────────────────────────────────────────────────

func readyzHandler(db *pgxpool.Pool, rdb *redis.Client) fiber.Handler {
	return func(c *fiber.Ctx) error {
		if err := db.Ping(c.Context()); err != nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"status": "not ready", "reason": "postgres unreachable",
			})
		}
		if err := rdb.Ping(c.Context()).Err(); err != nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"status": "not ready", "reason": "redis unreachable",
			})
		}
		return c.JSON(fiber.Map{"status": "ready"})
	}
}

// ─── Redis connect ────────────────────────────────────────────────────────────

func connectRedis(ctx context.Context, url string) (*redis.Client, error) {
	opt, err := redis.ParseURL(url)
	if err != nil {
		return nil, err
	}
	rdb := redis.NewClient(opt)
	if err := rdb.Ping(ctx).Err(); err != nil {
		return nil, err
	}
	return rdb, nil
}

// ─── Fiber error handler ──────────────────────────────────────────────────────

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

// ─── Logger ───────────────────────────────────────────────────────────────────

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
	return log.With(zap.String("service", "entitlement-service"))
}
