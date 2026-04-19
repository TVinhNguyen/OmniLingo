-- +goose Up
-- +goose StatementBegin

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Payment intents: track checkout sessions created per provider
CREATE TABLE payment_intents (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID        NOT NULL,
    plan_code           VARCHAR(50) NOT NULL,
    provider            VARCHAR(30) NOT NULL,     -- 'stripe' | 'vnpay' | 'momo'
    provider_session_id VARCHAR(255) NOT NULL,    -- provider's checkout/order ID
    amount_cents        INT         NOT NULL CHECK (amount_cents >= 0),
    currency            CHAR(3)     NOT NULL DEFAULT 'USD',
    interval            VARCHAR(10) NOT NULL DEFAULT 'month', -- 'month' | 'year'
    status              VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'
    return_url          TEXT,
    metadata            JSONB       NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX ix_payment_intents_provider_session
    ON payment_intents (provider, provider_session_id);
CREATE INDEX ix_payment_intents_user_id
    ON payment_intents (user_id, created_at DESC);
CREATE INDEX ix_payment_intents_status
    ON payment_intents (status, created_at DESC);

-- Webhook events: idempotency store + audit trail
CREATE TABLE webhook_events (
    id                  VARCHAR(255) PRIMARY KEY, -- provider event_id (unique per provider+event)
    provider            VARCHAR(30)  NOT NULL,
    event_type          VARCHAR(100) NOT NULL,
    payload             JSONB        NOT NULL,
    status              VARCHAR(20)  NOT NULL DEFAULT 'pending',
    -- 'pending' | 'processed' | 'failed' | 'duplicate'
    error_message       TEXT,
    processed_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_webhook_events_provider_status
    ON webhook_events (provider, status, created_at DESC);

-- Payment transactions: confirmed charges
CREATE TABLE payment_transactions (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_intent_id   UUID        NOT NULL REFERENCES payment_intents(id),
    provider            VARCHAR(30) NOT NULL,
    provider_charge_id  VARCHAR(255) NOT NULL, -- provider's charge/payment ID
    amount_cents        INT         NOT NULL,
    currency            CHAR(3)     NOT NULL,
    status              VARCHAR(20) NOT NULL, -- 'succeeded' | 'refunded' | 'failed'
    refund_id           VARCHAR(255),
    refund_amount_cents INT,
    failure_code        VARCHAR(100),
    failure_message     TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX ix_payment_transactions_provider_charge
    ON payment_transactions (provider, provider_charge_id);
CREATE INDEX ix_payment_transactions_intent_id
    ON payment_transactions (payment_intent_id);

-- Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_payment_intents_updated_at
    BEFORE UPDATE ON payment_intents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_payment_transactions_updated_at
    BEFORE UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS payment_transactions;
DROP TABLE IF EXISTS webhook_events;
DROP TABLE IF EXISTS payment_intents;
DROP FUNCTION IF EXISTS update_updated_at();
-- +goose StatementEnd
