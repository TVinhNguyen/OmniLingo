package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

// NewPostgres creates a pgxpool connection pool.
func NewPostgres(ctx context.Context, dsn string) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		return nil, err
	}
	if err := pool.Ping(ctx); err != nil {
		return nil, err
	}
	return pool, nil
}

// RunMigrations executes all pending goose migrations using pgx stdlib driver.
func RunMigrations(dsn, migrationsDir string) error {
	goose.SetDialect("postgres")
	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return err
	}
	db := stdlib.OpenDB(*cfg.ConnConfig)
	defer db.Close()
	return goose.Up(db, migrationsDir)
}
