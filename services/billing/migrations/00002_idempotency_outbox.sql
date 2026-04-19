-- +goose Up
-- +goose StatementBegin

-- Idempotency: prevent duplicate invoices from the same provider
ALTER TABLE invoices
    ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS uq_invoices_provider_invoice
    ON invoices (provider_invoice_id)
    WHERE provider_invoice_id IS NOT NULL;

-- Transactional outbox for reliable Kafka publish
CREATE TABLE IF NOT EXISTS outbox_events (
    id          BIGSERIAL PRIMARY KEY,
    topic       TEXT        NOT NULL,
    key         TEXT,
    payload     JSONB       NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    sent_at     TIMESTAMPTZ,
    attempts    INT         NOT NULL DEFAULT 0,
    last_error  TEXT
);

CREATE INDEX IF NOT EXISTS ix_outbox_pending
    ON outbox_events (created_at)
    WHERE sent_at IS NULL;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS ix_outbox_pending;
DROP INDEX IF EXISTS uq_invoices_provider_invoice;
DROP TABLE IF EXISTS outbox_events;
ALTER TABLE invoices DROP COLUMN IF EXISTS idempotency_key;
-- +goose StatementEnd
