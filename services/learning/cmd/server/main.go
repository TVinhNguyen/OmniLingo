package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/valyala/fasthttp/fasthttpadaptor"
	"go.uber.org/zap"

	"github.com/omnilingo/learning-service/internal/config"
	"github.com/omnilingo/learning-service/internal/handler"
	"github.com/omnilingo/learning-service/internal/messaging"
	"github.com/omnilingo/learning-service/internal/metrics"
	"github.com/omnilingo/learning-service/internal/middleware"
	"github.com/omnilingo/learning-service/internal/repository"
	"github.com/omnilingo/learning-service/internal/service"
	"github.com/omnilingo/learning-service/internal/telemetry"
)

func main() {
	cfg := config.Load()

	var log *zap.Logger
	if cfg.Env == "production" {
		log, _ = zap.NewProduction()
	} else {
		log, _ = zap.NewDevelopment()
	}
	defer log.Sync()

	// OpenTelemetry tracing
	otelProvider, err := telemetry.Init(context.Background(), "learning-service", cfg.Version, "")
	if err != nil {
		log.Warn("otel init failed (non-fatal)", zap.Error(err))
	} else {
		defer func() { _ = otelProvider.Shutdown(context.Background()) }()
	}

	log.Info("starting learning-service", zap.String("port", cfg.Port))

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	db, err := repository.NewPostgres(ctx, cfg.DatabaseURL)
	if err != nil { log.Fatal("postgres failed", zap.Error(err)) }
	defer db.Close()

	if err := repository.RunMigrations(cfg.DatabaseURL, "migrations"); err != nil {
		log.Fatal("migration failed", zap.Error(err))
	}
	log.Info("postgres connected and migrated")

	var pub messaging.Publisher
	if cfg.KafkaEnabled {
		pub = messaging.NewKafkaPublisher(cfg.KafkaBrokers)
	} else {
		pub = messaging.NewNoopPublisher()
	}
	defer pub.Close()

	profileRepo    := repository.NewProfileRepository(db)
	pathRepo       := repository.NewPathRepository(db)
	attemptRepo    := repository.NewAttemptRepository(db)
	onboardingRepo := repository.NewOnboardingRepository(db)
	svc            := service.NewLearningService(profileRepo, pathRepo, attemptRepo, onboardingRepo, pub, log)
	h           := handler.New(svc, log)

	// Init JWKS-backed JWT verifier
	jwksURL := cfg.IdentityServiceURL + "/.well-known/jwks.json"
	auth, err := middleware.NewJWKSAuth(jwksURL)
	if err != nil {
		log.Fatal("JWKS init failed", zap.Error(err))
	}

	app := fiber.New(fiber.Config{
		ReadTimeout: 15 * time.Second, WriteTimeout: 15 * time.Second,
		BodyLimit: 64 * 1024,
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok { code = e.Code }
			return c.Status(code).JSON(fiber.Map{"error": "INTERNAL_ERROR", "message": err.Error()})
		},
	})

	app.Use(recover.New())
	app.Use(middleware.RequestID())
	app.Use(middleware.CORS(cfg.AllowedOrigins))
	app.Use(func(c *fiber.Ctx) error {
		start := time.Now()
		err := c.Next()
		metrics.HTTPRequestsTotal.WithLabelValues(c.Method(), c.Route().Path,
			fmt.Sprintf("%d", c.Response().StatusCode())).Inc()
		metrics.HTTPRequestDuration.WithLabelValues(c.Method(), c.Route().Path).
			Observe(time.Since(start).Seconds())
		return err
	})

	app.Get("/healthz", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"ok": true, "service": "learning-service", "version": cfg.Version})
	})
	app.Get("/readyz", func(c *fiber.Ctx) error {
		pgOk := db.Ping(context.Background()) == nil
		status := 200
		if !pgOk { status = 503 }
		return c.Status(status).JSON(fiber.Map{
			"ready":  pgOk,
			"checks": fiber.Map{"postgres": boolStr(pgOk)},
		})
	})
	app.Get("/metrics", func(c *fiber.Ctx) error {
		fasthttpadaptor.NewFastHTTPHandler(promhttp.Handler())(c.Context())
		return nil
	})

	// T9: Outbox relay
	outboxCtx, outboxCancel := context.WithCancel(context.Background())
	defer outboxCancel()
	if cfg.KafkaEnabled {
		outboxRepo   := messaging.NewOutboxRepository(db)
		outboxWorker := messaging.NewOutboxWorker(outboxRepo, cfg.KafkaBrokers, log)
		go outboxWorker.Run(outboxCtx)
		log.Info("outbox relay started")
	}

	protected := app.Group("", auth.Handler())
	h.Register(protected)

	go func() {
		if err := app.Listen(":" + cfg.Port); err != nil {
			log.Error("server error", zap.Error(err)); os.Exit(1)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	<-quit
	log.Info("shutting down gracefully")
	outboxCancel()
	_ = app.Shutdown()
}

func boolStr(b bool) string {
	if b { return "ok" }
	return "error"
}
