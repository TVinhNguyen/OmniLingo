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
	_ "github.com/lib/pq" // goose postgres driver
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/valyala/fasthttp/fasthttpadaptor"
	"go.uber.org/zap"

	"github.com/omnilingo/assessment-service/internal/config"
	"github.com/omnilingo/assessment-service/internal/handler"
	"github.com/omnilingo/assessment-service/internal/messaging"
	"github.com/omnilingo/assessment-service/internal/metrics"
	"github.com/omnilingo/assessment-service/internal/middleware"
	"github.com/omnilingo/assessment-service/internal/repository"
	"github.com/omnilingo/assessment-service/internal/service"
	"github.com/omnilingo/assessment-service/internal/telemetry"
)

func main() {
	cfg := config.Load()

	// Logger
	var log *zap.Logger
	if cfg.Env == "production" {
		log, _ = zap.NewProduction()
	} else {
		log, _ = zap.NewDevelopment()
	}
	defer log.Sync()

	// OpenTelemetry tracing
	otelProvider, err := telemetry.Init(context.Background(), "assessment-service", cfg.Version, "")
	if err != nil {
		log.Warn("otel init failed (non-fatal)", zap.Error(err))
	} else {
		defer func() { _ = otelProvider.Shutdown(context.Background()) }()
	}

	log.Info("starting assessment-service", zap.String("version", cfg.Version), zap.String("env", cfg.Env))

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Database
	db, err := repository.NewPostgres(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatal("database connection failed", zap.Error(err))
	}
	defer db.Close()

	// Run migrations (path relative to working directory)
	if err := repository.RunMigrations(cfg.DatabaseURL, "migrations"); err != nil {
		log.Fatal("migration failed", zap.Error(err))
	}
	log.Info("postgres connected and migrated")

	// Messaging (Outbox & Kafka)
	outboxRepo := messaging.NewOutboxRepository(db)
	outboxCtx, outboxCancel := context.WithCancel(context.Background())
	defer outboxCancel()

	if cfg.KafkaEnabled {
		outboxWorker := messaging.NewOutboxWorker(outboxRepo, cfg.KafkaBrokers, log)
		go outboxWorker.Run(outboxCtx)
		log.Info("outbox relay started")
	} else {
		log.Info("Kafka disabled — outbox relay will not start")
	}

	// Dependencies
	subRepo      := repository.NewSubmissionRepository(db)
	testRepo     := repository.NewTestSessionRepository(db)
	svc          := service.NewAssessmentService(subRepo, testRepo, outboxRepo, log)
	placementSvc := service.NewPlacementService()
	h            := handler.NewAssessmentHandler(svc, placementSvc, log)

	// Fiber

	// Init JWKS-backed JWT verifier (RS256, cache 1h)
	jwksURL := cfg.IdentityServiceURL + "/.well-known/jwks.json"
	auth, err := middleware.NewJWKSAuth(jwksURL)
	if err != nil {
		log.Fatal("JWKS init failed", zap.Error(err))
	}

	app := fiber.New(fiber.Config{
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		BodyLimit:    64 * 1024,
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok { code = e.Code }
			return c.Status(code).JSON(fiber.Map{"error": "INTERNAL_ERROR", "message": err.Error()})
		},
	})

	app.Use(recover.New())
	app.Use(middleware.RequestID())

	// CORS
	origins := ""
	for i, o := range cfg.AllowedOrigins {
		if i > 0 { origins += "," }
		origins += o
	}
	app.Use(middleware.CORS(cfg.AllowedOrigins))

	// Prometheus request tracking
	app.Use(func(c *fiber.Ctx) error {
		start := time.Now()
		err := c.Next()
		dur := time.Since(start).Seconds()
		route := c.Route().Path
		metrics.HTTPRequestsTotal.WithLabelValues(c.Method(), route, fmt.Sprintf("%d", c.Response().StatusCode())).Inc()
		metrics.HTTPRequestDuration.WithLabelValues(c.Method(), route).Observe(dur)
		return err
	})

	// Health
	app.Get("/healthz", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"ok": true, "service": "assessment-service", "version": cfg.Version})
	})
	app.Get("/readyz", func(c *fiber.Ctx) error {
		pgOk := db.Ping(context.Background()) == nil
		status := 200
		if !pgOk { status = 503 }
		return c.Status(status).JSON(fiber.Map{
			"ready":  pgOk,
			"checks": fiber.Map{"postgres": func() string { if pgOk { return "ok" }; return "error" }()},
		})
	})

	// Prometheus metrics
	app.Get("/metrics", func(c *fiber.Ctx) error {
		fasthttpadaptor.NewFastHTTPHandler(promhttp.Handler())(c.Context())
		return nil
	})

	// Auth-protected routes
	assessmentGroup := app.Group("", auth.Handler())
	h.Register(assessmentGroup)

	// Start
	go func() {
		addr := ":" + cfg.Port
		log.Info("assessment-service listening", zap.String("addr", addr))
		if err := app.Listen(addr); err != nil {
			log.Error("server error", zap.Error(err))
			os.Exit(1)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	<-quit
	log.Info("shutting down gracefully")
	if err := app.Shutdown(); err != nil {
		log.Error("shutdown error", zap.Error(err))
	}
}
