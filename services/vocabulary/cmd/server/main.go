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
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/redis/go-redis/v9"
	"github.com/valyala/fasthttp/fasthttpadaptor"
	"go.uber.org/zap"

	"github.com/omnilingo/vocabulary-service/internal/anki"
	"github.com/omnilingo/vocabulary-service/internal/config"
	"github.com/omnilingo/vocabulary-service/internal/handler"
	"github.com/omnilingo/vocabulary-service/internal/messaging"
	"github.com/omnilingo/vocabulary-service/internal/middleware"
	"github.com/omnilingo/vocabulary-service/internal/repository"
	"github.com/omnilingo/vocabulary-service/internal/service"
)

func main() {
	cfg := config.Load()

	// ─── Logger ──────────────────────────────────────────────────────────────
	var log *zap.Logger
	var err error
	if cfg.Env == "production" {
		log, err = zap.NewProduction()
	} else {
		log, err = zap.NewDevelopment()
	}
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to init logger: %v\n", err)
		os.Exit(1)
	}
	defer log.Sync() //nolint:errcheck
	log.Info("starting vocabulary-service", zap.String("env", cfg.Env), zap.String("port", cfg.Port))

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)

	// ─── Infrastructure ───────────────────────────────────────────────────────
	db, err := repository.NewPostgres(ctx, cfg.DatabaseURL, log)
	handleFatal(err, "postgres init", log)

	rdb, err := repository.NewRedis(ctx, cfg.RedisURL, log)
	if err != nil {
		log.Warn("Redis unavailable — caching disabled", zap.Error(err))
		rdb = &redis.Client{} // will fail gracefully in repo layer
	}

	pub, err := messaging.NewPublisher(cfg.KafkaBrokers, cfg.KafkaEnabled, log)
	handleFatal(err, "kafka init", log)

	jwksCache, err := middleware.NewJWKSCache(ctx, cfg.IdentityServiceURL, log)
	handleFatal(err, "jwks init", log)

	cancel()

	// ─── Repositories ─────────────────────────────────────────────────────────
	wordRepo := repository.NewWordRepository(db, rdb, log)
	deckRepo := repository.NewDeckRepository(db, rdb, log)
	cardRepo := repository.NewCardRepository(db, rdb, log)

	// ─── Outbox Repository (shared by services + relay worker) ────────────────
	outboxRepo := messaging.NewOutboxRepository(db)

	// ─── Services ─────────────────────────────────────────────────────────────
	wordSvc := service.NewWordService(wordRepo, log)
	deckSvc := service.NewDeckService(deckRepo, cardRepo, wordRepo, pub, outboxRepo, log)

	// ─── Anki Importer ────────────────────────────────────────────────────────
	ankiImporter := anki.NewImporter(wordRepo, cardRepo, deckRepo, pub, outboxRepo, log)

	// ─── Handlers ─────────────────────────────────────────────────────────────
	wordH := handler.NewWordHandler(wordSvc, log)
	deckH := handler.NewDeckHandler(deckSvc, log)
	ankiH := handler.NewAnkiHandler(ankiImporter, cfg.AnkiMaxSizeBytes, log)

	// ─── Fiber app ────────────────────────────────────────────────────────────
	app := fiber.New(fiber.Config{
		AppName:       "vocabulary-service",
		BodyLimit:     64 * 1024,      // 64KB default body limit
		ReadTimeout:   15 * time.Second,
		WriteTimeout:  15 * time.Second,
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return handler.HandleError(c, err, log)
		},
	})

	// ─── Global middleware ─────────────────────────────────────────────────────
	app.Use(recover.New())
	app.Use(middleware.RequestID())
	app.Use(middleware.CORS(cfg.AllowedOrigins))
	app.Use(middleware.PrometheusMiddleware())

	// ─── Infrastructure routes ─────────────────────────────────────────────────
	app.Get("/healthz", healthzHandler(cfg.Version))
	app.Get("/readyz", readyzHandler(db, rdb))
	app.Get("/metrics", func(c *fiber.Ctx) error {
		fasthttpadaptor.NewFastHTTPHandlerFunc(promhttp.Handler().ServeHTTP)(c.Context())
		return nil
	})

	// ─── API routes ────────────────────────────────────────────────────────────
	v1 := app.Group("/api/v1/vocab")

	// Public (no auth)
	wordH.RegisterRoutes(v1, v1.Group("/admin",
		middleware.JWTAuth(jwksCache, log),
		middleware.RequireRole("content_editor", "content_admin", "platform_admin", "admin"),
	))

	// Protected (JWT required)
	protected := v1.Group("",
		middleware.JWTAuth(jwksCache, log),
	)
	deckH.RegisterRoutes(protected)
	ankiH.RegisterRoutes(protected)

	// T9: Outbox relay worker
	outboxCtx, outboxCancel := context.WithCancel(context.Background())
	defer outboxCancel()
	if cfg.KafkaEnabled {
		outboxWorker := messaging.NewOutboxWorker(outboxRepo, cfg.KafkaBrokers, log)
		go outboxWorker.Run(outboxCtx)
		log.Info("outbox relay started")
	}

	// ─── Graceful shutdown ────────────────────────────────────────────────────
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-quit
		log.Info("shutting down vocabulary-service...")
		outboxCancel()
		shutCtx, cancelShut := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancelShut()
		_ = app.ShutdownWithContext(shutCtx)
		pub.Close()
		db.Close()
	}()

	addr := ":" + cfg.Port
	log.Info("vocabulary-service listening", zap.String("addr", addr))
	if err := app.Listen(addr); err != nil {
		log.Error("server error", zap.Error(err))
	}
}

// healthzHandler returns liveness status.
func healthzHandler(version string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"ok":      true,
			"service": "vocabulary-service",
			"version": version,
		})
	}
}

// readyzHandler checks all dependencies.
func readyzHandler(db *pgxpool.Pool, rdb *redis.Client) fiber.Handler {
	return func(c *fiber.Ctx) error {
		checks := fiber.Map{}
		allOK := true

		// Check PostgreSQL
		if err := db.Ping(c.Context()); err != nil {
			checks["postgres"] = "error: " + err.Error()
			allOK = false
		} else {
			checks["postgres"] = "ok"
		}

		// Check Redis (fail-soft — not critical)
		if err := rdb.Ping(c.Context()).Err(); err != nil {
			checks["redis"] = "warn: " + err.Error()
		} else {
			checks["redis"] = "ok"
		}

		status := fiber.StatusOK
		if !allOK {
			status = fiber.StatusServiceUnavailable
		}
		return c.Status(status).JSON(fiber.Map{
			"ready":  allOK,
			"checks": checks,
		})
	}
}

func handleFatal(err error, label string, log *zap.Logger) {
	if err != nil {
		log.Fatal("fatal error", zap.String("component", label), zap.Error(err))
	}
}
