-- +goose Up
-- +goose StatementBegin

-- payment_outbox: transactional outbox for Kafka events.
-- Relay job reads rows WHERE status='pending' and publishes to Kafka.
-- On success: UPDATE status='published'. On failure: retry with backoff.
CREATE TABLE payment_outbox (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    topic       VARCHAR(120) NOT NULL,
    key         VARCHAR(255),           -- Kafka partition key (e.g. user_id)
    payload     JSONB        NOT NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'pending',
    -- 'pending' | 'published' | 'failed'
    attempts    INT          NOT NULL DEFAULT 0,
    last_error  TEXT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    published_at TIMESTAMPTZ
);

CREATE INDEX ix_payment_outbox_pending
    ON payment_outbox (status, created_at)
    WHERE status = 'pending';

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS payment_outbox;
-- +goose StatementEnd
