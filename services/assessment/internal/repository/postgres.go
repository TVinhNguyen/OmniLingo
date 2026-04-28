package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/omnilingo/pkg/pgxutil"
)

// NewPostgres creates a pgxpool connection pool (delegates to pkg/pgxutil).
func NewPostgres(ctx context.Context, dsn string) (*pgxpool.Pool, error) {
	return pgxutil.NewPool(ctx, dsn)
}

// RunMigrations runs all pending goose migrations (delegates to pkg/pgxutil).
func RunMigrations(dsn, migrationsDir string) error {
	return pgxutil.RunMigrations(dsn, migrationsDir)
}
