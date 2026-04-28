package pgxutil

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

const defaultTimeout = 10 * time.Second

// NewPool creates a pgxpool connection pool and pings the DB.
// Uses a 10s dial timeout; caller provides the parent context for lifecycle.
//
// Example:
//
//	pool, err := pgxutil.NewPool(ctx, cfg.DatabaseURL)
//	if err != nil {
//	    log.Fatal("postgres failed", zap.Error(err))
//	}
//	defer pool.Close()
func NewPool(ctx context.Context, dsn string) (*pgxpool.Pool, error) {
	dialCtx, cancel := context.WithTimeout(ctx, defaultTimeout)
	defer cancel()

	pool, err := pgxpool.New(dialCtx, dsn)
	if err != nil {
		return nil, fmt.Errorf("pgxpool.New: %w", err)
	}
	if err := pool.Ping(dialCtx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("postgres ping: %w", err)
	}
	return pool, nil
}

// RunMigrations runs all pending goose Up migrations from migrationsDir.
// Uses the pgx stdlib driver (database/sql compatible, required by goose).
//
// Example:
//
//	if err := pgxutil.RunMigrations(cfg.DatabaseURL, "migrations"); err != nil {
//	    log.Fatal("migration failed", zap.Error(err))
//	}
func RunMigrations(dsn, migrationsDir string) error {
	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return fmt.Errorf("parse dsn: %w", err)
	}
	db := stdlib.OpenDB(*cfg.ConnConfig)
	defer db.Close()

	if err := goose.SetDialect("postgres"); err != nil {
		return fmt.Errorf("set dialect: %w", err)
	}
	if err := goose.Up(db, migrationsDir); err != nil {
		return fmt.Errorf("goose up: %w", err)
	}
	return nil
}
