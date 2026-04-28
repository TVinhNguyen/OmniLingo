/*
Package pgxutil provides shared PostgreSQL bootstrapping for OmniLingo Go services.

# Design contract

  - NewPool(ctx, dsn) (*pgxpool.Pool, error) — connect + ping with 10s timeout.
  - RunMigrations(dsn, dir string) error — run goose Up from migrationsDir.

# Migration driver

Uses jackc/pgx stdlib driver (pgxpool.ParseConfig → stdlib.OpenDB) instead of
the pure-pgx driver, because goose requires database/sql. This is the consistent
pattern across billing, assessment, learning services. Identity's older pattern
(goose.OpenDBWithDriver) is normalized here.

# ADR-010 note

Phase-2 `InsertTx` changes to pkg/outbox will be the only other place that needs
pgxutil — both packages share the same pgx version to avoid diamond conflicts.
*/
package pgxutil
