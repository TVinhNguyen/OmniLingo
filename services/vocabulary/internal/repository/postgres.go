package repository

import (
	"context"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"runtime"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
	"go.uber.org/zap"
)

// NewPostgres creates a connection pool and runs pending migrations.
func NewPostgres(ctx context.Context, dsn string, log *zap.Logger) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		return nil, fmt.Errorf("pgxpool.New: %w", err)
	}
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("postgres ping: %w", err)
	}
	log.Info("PostgreSQL connected")

	if err := RunMigrations(pool, log); err != nil {
		pool.Close()
		return nil, fmt.Errorf("migrations: %w", err)
	}
	return pool, nil
}

// RunMigrations runs all pending Goose migrations from the migrations directory.
func RunMigrations(pool *pgxpool.Pool, log *zap.Logger) error {
	db := stdlib.OpenDBFromPool(pool)
	defer db.Close()

	migrationsDir := findMigrationsDir()
	var migrationsFS fs.FS
	if migrationsDir != "" {
		migrationsFS = os.DirFS(migrationsDir)
	}

	goose.SetBaseFS(migrationsFS)
	if err := goose.SetDialect("postgres"); err != nil {
		return err
	}

	dir := "."
	if migrationsDir == "" {
		dir = "migrations"
	}

	if err := goose.Up(db, dir); err != nil {
		return fmt.Errorf("goose up: %w", err)
	}
	log.Info("Migrations applied successfully")
	return nil
}

// findMigrationsDir resolves the migrations directory at runtime.
// It checks common locations: relative to executable, or relative to source file.
func findMigrationsDir() string {
	// 1. Relative to current working directory (production binary)
	if _, err := os.Stat("migrations"); err == nil {
		abs, _ := filepath.Abs("migrations")
		return abs
	}

	// 2. Relative to source file (go run in dev)
	_, filename, _, ok := runtime.Caller(0)
	if ok {
		dir := filepath.Join(filepath.Dir(filename), "..", "..", "migrations")
		if _, err := os.Stat(dir); err == nil {
			abs, _ := filepath.Abs(dir)
			return abs
		}
	}

	return ""
}

