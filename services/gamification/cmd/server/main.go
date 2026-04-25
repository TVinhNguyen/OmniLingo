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
	"github.com/redis/go-redis/v9"
	"github.com/valyala/fasthttp/fasthttpadaptor"
	"go.uber.org/zap"

	"github.com/omnilingo/gamification-service/internal/config"
	"github.com/omnilingo/gamification-service/internal/handler"
	"github.com/omnilingo/gamification-service/internal/messaging"
	"github.com/omnilingo/gamification-service/internal/metrics"
	"github.com/omnilingo/gamification-service/internal/middleware"
	"github.com/omnilingo/gamification-service/internal/repository"
	"github.com/omnilingo/gamification-service/internal/service"
	"github.com/omnilingo/gamification-service/internal/telemetry"
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
	otelProvider, err := telemetry.Init(context.Background(), "gamification-service", cfg.Version, "")
	if err != nil {
		log.Warn("otel init failed (non-fatal)", zap.Error(err))
	} else {
		defer func() { _ = otelProvider.Shutdown(context.Background()) }()
	}

	log.Info("starting gamification-service", zap.String("version", cfg.Version), zap.String("env", cfg.Env))

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Postgres
	db, err := repository.NewPostgres(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatal("postgres connection failed", zap.Error(err))
	}
	defer db.Close()

	if err := repository.RunMigrations(cfg.DatabaseURL, "migrations"); err != nil {
		log.Fatal("migrations failed", zap.Error(err))
	}
	log.Info("postgres connected and migrated")

	// Redis
	redisOpts, err := redis.ParseURL(cfg.RedisURL)
	if err != nil {
		log.Fatal("invalid redis url", zap.Error(err))
	}
	rdb := redis.NewClient(redisOpts)
	if err := rdb.Ping(ctx).Err(); err != nil {
		log.Warn("redis unavailable — leaderboard disabled", zap.Error(err))
		rdb = nil
	} else {
		log.Info("redis connected")
	}
	defer func() {
		if rdb != nil { _ = rdb.Close() }
	}()

	// Deps
	xpRepo  := repository.NewXPRepository(db)
	strRepo := repository.NewStreakRepository(db)
	achRepo := repository.NewAchievementRepository(db)
	svc     := service.NewGamificationService(xpRepo, strRepo, achRepo, rdb, log)
	h       := handler.NewGamificationHandler(svc, log)

	// Init JWKS-backed JWT verifier (RS256, cache 1h)
	jwksURL := cfg.IdentityServiceURL + "/.well-known/jwks.json"
	auth, err := middleware.NewJWKSAuth(jwksURL)
	if err != nil {
		log.Fatal("JWKS init failed", zap.Error(err))
	}

	// Kafka consumer + publisher
	appCtx, appCancel := context.WithCancel(context.Background())
	defer appCancel()
	if cfg.KafkaEnabled {
		pub := messaging.NewPublisher(cfg.KafkaBrokers, log)
		defer pub.Close()
		consumer := messaging.NewGamificationConsumer(cfg.KafkaBrokers, cfg.KafkaGroupID, svc, log)
		consumer.Start(appCtx)
		defer consumer.Stop()

		// T9: Outbox relay
		outboxRepo   := messaging.NewOutboxRepository(db)
		outboxWorker := messaging.NewOutboxWorker(outboxRepo, cfg.KafkaBrokers, log)
		go outboxWorker.Run(appCtx)

		log.Info("kafka consumer+publisher+outbox relay started")
	}

	app := fiber.New(fiber.Config{
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		BodyLimit:    64 * 1024,
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok { code = e.Code }
			var msg string
			if os.Getenv("APP_ENV") != "production" { msg = err.Error() } else { msg = "an internal error occurred" }
			return c.Status(code).JSON(fiber.Map{"error": "INTERNAL_ERROR", "message": msg})
		},
	})

	app.Use(recover.New())
	app.Use(middleware.RequestID())
	app.Use(middleware.CORS(cfg.AllowedOrigins))
	app.Use(func(c *fiber.Ctx) error {
		start := time.Now()
		err := c.Next()
		dur := time.Since(start).Seconds()
		route := c.Route().Path
		metrics.HTTPRequestsTotal.WithLabelValues(c.Method(), route, fmt.Sprintf("%d", c.Response().StatusCode())).Inc()
		metrics.HTTPRequestDuration.WithLabelValues(c.Method(), route).Observe(dur)
		return err
	})

	app.Get("/healthz", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"ok": true, "service": "gamification-service", "version": cfg.Version})
	})
	app.Get("/readyz", func(c *fiber.Ctx) error {
		pgOk := db.Ping(context.Background()) == nil
		status := 200
		if !pgOk { status = 503 }
		redisOk := rdb != nil && rdb.Ping(context.Background()).Err() == nil
		return c.Status(status).JSON(fiber.Map{
			"ready":  pgOk,
			"checks": fiber.Map{
				"postgres": func() string { if pgOk { return "ok" }; return "error" }(),
				"redis":    func() string { if redisOk { return "ok" }; return "unavailable" }(),
			},
		})
	})
	app.Get("/metrics", func(c *fiber.Ctx) error {
		fasthttpadaptor.NewFastHTTPHandler(promhttp.Handler())(c.Context())
		return nil
	})

	protected := app.Group("", auth.Handler())
	h.Register(protected)

	go func() {
		log.Info("gamification-service listening", zap.String("port", cfg.Port))
		if err := app.Listen(":" + cfg.Port); err != nil {
			log.Error("server error", zap.Error(err))
			os.Exit(1)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	<-quit
	log.Info("shutting down gracefully")
	_ = app.Shutdown()
}
