package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pressly/goose/v3"
	_ "github.com/jackc/pgx/v5/stdlib" // pgx stdlib driver for goose
)

// NewPostgres creates a new PostgreSQL connection pool.
func NewPostgres(dsn string) (*pgxpool.Pool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		return nil, fmt.Errorf("pgxpool.New: %w", err)
	}

	if err := pool.Ping(ctx); err != nil {
		return nil, fmt.Errorf("postgres ping: %w", err)
	}

	return pool, nil
}

// RunMigrations executes all pending goose migrations from the given directory.
func RunMigrations(dsn, migrationsDir string) error {
	db, err := goose.OpenDBWithDriver("pgx", dsn)
	if err != nil {
		return fmt.Errorf("open db for migrations: %w", err)
	}
	defer db.Close()

	goose.SetBaseFS(nil)
	if err := goose.Up(db, migrationsDir); err != nil {
		return fmt.Errorf("goose.Up: %w", err)
	}

	return nil
}
