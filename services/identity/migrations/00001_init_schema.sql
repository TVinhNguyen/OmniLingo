-- +goose Up
-- +goose StatementBegin
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- +goose StatementEnd

-- +goose StatementBegin
CREATE EXTENSION IF NOT EXISTS "citext";
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           CITEXT UNIQUE,
    phone           TEXT UNIQUE,
    password_hash   TEXT,
    display_name    TEXT NOT NULL,
    avatar_url      TEXT,
    ui_language     TEXT NOT NULL DEFAULT 'en',
    timezone        TEXT NOT NULL DEFAULT 'UTC',
    status          TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','suspended','pending_deletion','deleted')),
    email_verified  BOOLEAN NOT NULL DEFAULT false,
    mfa_enabled     BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS user_oauth_identities (
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider         TEXT NOT NULL,
    provider_user_id TEXT NOT NULL,
    linked_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (provider, provider_user_id)
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash  TEXT NOT NULL UNIQUE,
    device_info         TEXT,
    ip                  TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at          TIMESTAMPTZ NOT NULL,
    revoked_at          TIMESTAMPTZ
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE INDEX IF NOT EXISTS ix_sessions_user_id ON sessions(user_id);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS roles (
    id   SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);
-- +goose StatementEnd

-- +goose StatementBegin
INSERT INTO roles (name) VALUES
    ('user'), ('teacher'), ('admin'), ('content_editor'), ('moderator')
ON CONFLICT DO NOTHING;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT  NOT NULL REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS user_roles;
-- +goose StatementEnd
-- +goose StatementBegin
DROP TABLE IF EXISTS roles;
-- +goose StatementEnd
-- +goose StatementBegin
DROP TABLE IF EXISTS sessions;
-- +goose StatementEnd
-- +goose StatementBegin
DROP TABLE IF EXISTS user_oauth_identities;
-- +goose StatementEnd
-- +goose StatementBegin
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
