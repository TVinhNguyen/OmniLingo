package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/omnilingo/llm-gateway/internal/config"
	"github.com/omnilingo/llm-gateway/internal/handler"
	"github.com/omnilingo/llm-gateway/internal/middleware"
	"github.com/omnilingo/llm-gateway/internal/repository"
	"github.com/omnilingo/llm-gateway/internal/service"
	"github.com/omnilingo/llm-gateway/internal/telemetry"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/redis/go-redis/v9"
	"github.com/valyala/fasthttp/fasthttpadaptor"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func main() {
	cfg := config.Load()
	log := buildLogger(cfg.Env)
	defer log.Sync() //nolint:errcheck

	log.Info("starting llm-gateway",
		zap.String("env", cfg.Env),
		zap.String("port", cfg.Port))

	ctx := context.Background()

	// OTel
	if shutdown, err := telemetry.Init(ctx, "llm-gateway", cfg.Version, cfg.Env); err != nil {
		log.Warn("otel init failed", zap.Error(err))
	} else {
		defer shutdown(ctx) //nolint:errcheck
	}

	// Postgres
	db, err := repository.NewPostgres(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatal("postgres failed", zap.Error(err))
	}
	defer db.Close()
	if err := repository.RunMigrations(cfg.DatabaseURL, "migrations"); err != nil {
		log.Fatal("migration failed", zap.Error(err))
	}

	// Redis
	rdb, err := connectRedis(ctx, cfg.RedisURL)
	if err != nil {
		log.Fatal("redis failed", zap.Error(err))
	}
	defer rdb.Close()

	// Repos
	logRepo := repository.NewRequestLogRepository(db)
	budgetRepo := repository.NewBudgetRepository(db)

	// Provider adapters
	var providers []service.Provider
	if cfg.AnthropicAPIKey != "" {
		providers = append(providers, service.NewAnthropicAdapter(cfg.AnthropicAPIKey, log))
		log.Info("anthropic provider enabled")
	}
	if cfg.OpenAIAPIKey != "" {
		providers = append(providers, service.NewOpenAIAdapter(cfg.OpenAIAPIKey, log))
		log.Info("openai provider enabled")
	}
	if len(providers) == 0 {
		log.Warn("no LLM providers configured — all completions will fail")
	}

	budgetLimits := map[string]int{
		"free":     cfg.BudgetFreeTokens,
		"plus":     cfg.BudgetPlusTokens,
		"pro":      cfg.BudgetProTokens,
		"ultimate": cfg.BudgetUltimateTokens,
	}

	svc := service.NewGatewayService(providers, logRepo, budgetRepo, rdb, cfg.CacheTTLSec, budgetLimits, log)

	// JWKS auth
	auth, err := middleware.NewJWKSAuth(cfg.IdentityServiceURL)
	if err != nil {
		log.Fatal("jwks auth init failed", zap.Error(err))
	}

	// Fiber
	app := fiber.New(fiber.Config{
		BodyLimit:    64 * 1024,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 120 * time.Second, // LLM can be slow
		ErrorHandler: fiberErrorHandler,
	})

	app.Use(middleware.RequestID())
	app.Use(middleware.CORS(cfg.AllowedOrigins))
	app.Use(middleware.Prometheus())

	app.Get("/healthz", func(c *fiber.Ctx) error { return c.JSON(fiber.Map{"status": "ok"}) })
	app.Get("/readyz", readyzHandler(db, rdb))
	app.Get("/metrics", func(c *fiber.Ctx) error {
		fasthttpadaptor.NewFastHTTPHandler(promhttp.Handler())(c.Context())
		return nil
	})

	v1 := app.Group("/api/v1")
	handler.NewCompletionHandler(svc, log).RegisterRoutes(v1, auth)

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Info("llm-gateway listening", zap.String("addr", ":"+cfg.Port))
		if err := app.Listen(":" + cfg.Port); err != nil {
			log.Error("listen error", zap.Error(err))
		}
	}()

	<-quit
	log.Info("shutting down...")
	shutCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	_ = app.ShutdownWithContext(shutCtx)
	log.Info("llm-gateway stopped")
}

func readyzHandler(db *pgxpool.Pool, rdb *redis.Client) fiber.Handler {
	return func(c *fiber.Ctx) error {
		if err := db.Ping(c.Context()); err != nil {
			return c.Status(503).JSON(fiber.Map{"status": "not ready", "reason": "postgres"})
		}
		if err := rdb.Ping(c.Context()).Err(); err != nil {
			return c.Status(503).JSON(fiber.Map{"status": "not ready", "reason": "redis"})
		}
		return c.JSON(fiber.Map{"status": "ready"})
	}
}

func connectRedis(ctx context.Context, url string) (*redis.Client, error) {
	opt, err := redis.ParseURL(url)
	if err != nil {
		return nil, err
	}
	rdb := redis.NewClient(opt)
	return rdb, rdb.Ping(ctx).Err()
}

func fiberErrorHandler(c *fiber.Ctx, err error) error {
	if e, ok := err.(*fiber.Error); ok {
		return c.Status(e.Code).JSON(fiber.Map{"error": "REQUEST_ERROR", "message": e.Message})
	}
	return c.Status(500).JSON(fiber.Map{"error": "INTERNAL_ERROR", "message": "internal server error"})
}

func buildLogger(env string) *zap.Logger {
	var cfg zap.Config
	if env == "production" {
		cfg = zap.NewProductionConfig()
	} else {
		cfg = zap.NewDevelopmentConfig()
		cfg.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	}
	l, err := cfg.Build()
	if err != nil {
		panic(err)
	}
	return l.With(zap.String("service", "llm-gateway"))
}
