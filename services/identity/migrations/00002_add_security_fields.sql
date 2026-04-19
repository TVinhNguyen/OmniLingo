-- +goose Up
-- +goose StatementBegin
-- Add brute force protection columns to users
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS failed_login_count INT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS locked_until       TIMESTAMPTZ;
-- +goose StatementEnd

-- +goose StatementBegin
-- Add device_id to sessions for device binding
ALTER TABLE sessions
    ADD COLUMN IF NOT EXISTS device_id TEXT;
-- +goose StatementEnd

-- +goose StatementBegin
-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    used_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_email_verif_user_id ON email_verifications(user_id);
-- +goose StatementEnd

-- +goose StatementBegin
-- Add full roles set per spec (09-security.md §3.1)
INSERT INTO roles (name) VALUES
    ('premium_user'), ('content_admin'), ('billing_admin'),
    ('platform_admin'), ('tenant_admin'), ('tenant_learner')
ON CONFLICT DO NOTHING;
-- +goose StatementEnd

-- +goose StatementBegin
-- Update status check constraint to include 'locked'
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
ALTER TABLE users ADD CONSTRAINT users_status_check
    CHECK (status IN ('active','suspended','locked','pending_deletion','deleted'));
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS email_verifications;
-- +goose StatementEnd
-- +goose StatementBegin
ALTER TABLE users DROP COLUMN IF EXISTS failed_login_count;
ALTER TABLE users DROP COLUMN IF EXISTS locked_until;
-- +goose StatementEnd
-- +goose StatementBegin
ALTER TABLE sessions DROP COLUMN IF EXISTS device_id;
-- +goose StatementEnd
