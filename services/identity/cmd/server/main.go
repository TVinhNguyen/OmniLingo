package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/adaptor/v2"
	"github.com/gofiber/fiber/v2"
	fiberlogger "github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"

	"github.com/omnilingo/omnilingo/services/identity/internal/audit"
	"github.com/omnilingo/omnilingo/services/identity/internal/config"
	"github.com/omnilingo/omnilingo/services/identity/internal/handler"
	iam "github.com/omnilingo/omnilingo/services/identity/internal/metrics"
	"github.com/omnilingo/omnilingo/services/identity/internal/messaging"
	"github.com/omnilingo/omnilingo/services/identity/internal/middleware"
	"github.com/omnilingo/omnilingo/services/identity/internal/ratelimit"
	"github.com/omnilingo/omnilingo/services/identity/internal/repository"
	"github.com/omnilingo/omnilingo/services/identity/internal/service"
	"github.com/omnilingo/omnilingo/services/identity/internal/telemetry"
)

func main() {
	_ = godotenv.Load()
	cfg := config.Load()

	// ─── Logger ───────────────────────────────────────────────────────────────
	var log *zap.Logger
	var err error
	if cfg.Env == "production" {
		log, err = zap.NewProduction()
	} else {
		log, err = zap.NewDevelopment()
	}
	if err != nil {
		panic("failed to init logger: " + err.Error())
	}
	defer log.Sync() //nolint:errcheck

	log.Info("identity-service starting",
		zap.String("env", cfg.Env),
		zap.String("version", cfg.Version))

	// ─── OpenTelemetry ────────────────────────────────────────────────────────
	ctx := context.Background()
	otelProvider, err := telemetry.Init(ctx, "identity-service", cfg.Version, cfg.OTelEndpoint)
	if err != nil {
		log.Warn("OTel init failed (continuing without tracing)", zap.Error(err))
	} else {
		defer otelProvider.Shutdown(ctx) //nolint:errcheck
	}

	// ─── PostgreSQL ───────────────────────────────────────────────────────────
	db, err := repository.NewPostgres(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("failed to connect postgres", zap.Error(err))
	}
	defer db.Close()

	// ─── Redis ────────────────────────────────────────────────────────────────
	rdb := repository.NewRedis(cfg.RedisURL)
	defer rdb.Close()

	// ─── Migrations ───────────────────────────────────────────────────────────
	if err := repository.RunMigrations(cfg.DatabaseURL, "migrations"); err != nil {
		log.Fatal("failed to run migrations", zap.Error(err))
	}

	// ─── Kafka Publisher ──────────────────────────────────────────────────────
	publisher, err := messaging.NewPublisher(cfg.KafkaBrokers, cfg.KafkaEnabled, log)
	if err != nil {
		log.Fatal("failed to init kafka publisher", zap.Error(err))
	}
	defer publisher.Close()

	// ─── Outbox Repository (shared by audit + auth) ────────────────────────────
	outboxRepo := messaging.NewOutboxRepository(db)

	// ─── Audit Service ────────────────────────────────────────────────────────
	auditSvc := audit.NewService(log, outboxRepo)

	// ─── Repositories ─────────────────────────────────────────────────────────
	userRepo := repository.NewUserRepository(db)
	sessionRepo := repository.NewSessionRepository(rdb, db)

	// ─── Rate Limiter ─────────────────────────────────────────────────────────
	limiter := ratelimit.NewLimiter(rdb)

	// ─── Auth Service ─────────────────────────────────────────────────────────
	authSvc, err := service.NewAuthService(cfg, log, userRepo, sessionRepo, limiter, publisher, auditSvc, outboxRepo)
	if err != nil {
		log.Fatal("failed to init auth service", zap.Error(err))
	}

	// ─── Fiber App ────────────────────────────────────────────────────────────
	app := fiber.New(fiber.Config{
		AppName:      "identity-service",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		BodyLimit:    64 * 1024, // 64KB — prevents DoS via large payloads
		ErrorHandler: handler.ErrorHandler(log),
	})

	// ─── Global Middleware ────────────────────────────────────────────────────
	app.Use(recover.New())
	app.Use(fiberlogger.New(fiberlogger.Config{
		Format: `{"time":"${time}","status":${status},"latency":"${latency}","method":"${method}","path":"${path}","ip":"${ip}","reqId":"${locals:request_id}"}` + "\n",
	}))
	app.Use(middleware.RequestID())
	app.Use(middleware.CORS(cfg))
	app.Use(middleware.PrometheusMiddleware())

	// ─── Infrastructure Endpoints ─────────────────────────────────────────────
	app.Get("/healthz", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "identity-service",
			"version": cfg.Version,
		})
	})
	app.Get("/readyz", readyzHandler(db, rdb, log))

	// JWKS — RS256 public key for token verification by other services
	handler.RegisterJWKS(app, authSvc)

	// Prometheus metrics — use fiber adaptor for net/http compatibility
	app.Get("/metrics", adaptor.HTTPHandler(promhttp.Handler()))

	// ─── API Routes ───────────────────────────────────────────────────────────
	v1 := app.Group("/api/v1")
	handler.RegisterRoutes(v1, authSvc, log)

	// ─── Background: Active Session Count for Prometheus ─────────────────────
	go func() {
		ticker := time.NewTicker(30 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			if count, err := sessionRepo.CountActive(context.Background()); err == nil {
				iam.SessionActiveCount.Set(float64(count))
			}
		}
	}()

	// T9: Outbox relay
	outboxCtx, outboxCancel := context.WithCancel(context.Background())
	defer outboxCancel()
	if cfg.KafkaEnabled {
		outboxRepo   := messaging.NewOutboxRepository(db)
		outboxWorker := messaging.NewOutboxWorker(outboxRepo, cfg.KafkaBrokers, log)
		go outboxWorker.Run(outboxCtx)
		log.Info("outbox relay started")
	}

	// ─── Graceful Shutdown ────────────────────────────────────────────────────
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Info("HTTP server listening", zap.String("addr", ":"+cfg.Port))
		if listenErr := app.Listen(":" + cfg.Port); listenErr != nil {
			log.Error("server error", zap.Error(listenErr))
		}
	}()

	<-quit
	log.Info("shutdown signal received — draining connections")
	outboxCancel()

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	if err := app.ShutdownWithContext(shutdownCtx); err != nil {
		log.Error("graceful shutdown failed", zap.Error(err))
	}
	log.Info("identity-service stopped")
}

// readyzHandler checks PostgreSQL and Redis connectivity.
func readyzHandler(db *pgxpool.Pool, rdb *redis.Client, log *zap.Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx, cancel := context.WithTimeout(c.Context(), 2*time.Second)
		defer cancel()

		if err := db.Ping(ctx); err != nil {
			log.Warn("readyz: postgres not ready", zap.Error(err))
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"status": "not_ready", "reason": "postgres",
			})
		}
		if err := rdb.Ping(ctx).Err(); err != nil {
			log.Warn("readyz: redis not ready", zap.Error(err))
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"status": "not_ready", "reason": "redis",
			})
		}
		return c.JSON(fiber.Map{"status": "ready"})
	}
}
