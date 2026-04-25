-- T9 Transactional Outbox
-- Reliable Kafka publish: write to this table in the same transaction as domain write.
-- Relay worker polls this table and publishes to Kafka (marks sent_at when done).

-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS outbox_events (
    id          BIGSERIAL   PRIMARY KEY,
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
DROP INDEX  IF EXISTS ix_outbox_pending;
DROP TABLE  IF EXISTS outbox_events;
-- +goose StatementEnd
