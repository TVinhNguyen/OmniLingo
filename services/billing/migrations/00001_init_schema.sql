-- +goose Up
-- +goose StatementBegin

CREATE TABLE plans (
    code            TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    tier            TEXT NOT NULL,       -- free|plus|pro|ultimate|family|b2b
    price_cents     INT NOT NULL DEFAULT 0,
    currency        TEXT NOT NULL DEFAULT 'USD',
    interval        TEXT NOT NULL,       -- month|year|lifetime
    features        JSONB NOT NULL DEFAULT '[]',
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL,
    plan_code               TEXT NOT NULL REFERENCES plans(code),
    status                  TEXT NOT NULL DEFAULT 'trialing',   -- trialing|active|past_due|canceled|expired
    provider                TEXT NOT NULL DEFAULT 'stripe',     -- stripe|apple_iap|google_iap|vnpay|momo
    provider_sub_id         TEXT,
    current_period_start    TIMESTAMPTZ,
    current_period_end      TIMESTAMPTZ,
    trial_end               TIMESTAMPTZ,
    cancel_at_period_end    BOOLEAN NOT NULL DEFAULT false,
    canceled_at             TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_subs_user ON subscriptions(user_id, status);
CREATE INDEX ix_subs_provider ON subscriptions(provider, provider_sub_id) WHERE provider_sub_id IS NOT NULL;

CREATE TABLE invoices (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL,
    subscription_id     UUID REFERENCES subscriptions(id),
    amount_cents        INT NOT NULL,
    currency            TEXT NOT NULL DEFAULT 'USD',
    status              TEXT NOT NULL DEFAULT 'open',  -- open|paid|void|refunded
    provider_invoice_id TEXT,
    description         TEXT,
    issued_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    paid_at             TIMESTAMPTZ,
    due_at              TIMESTAMPTZ
);

CREATE INDEX ix_invoices_user ON invoices(user_id, issued_at DESC);
CREATE INDEX ix_invoices_sub ON invoices(subscription_id);

CREATE TABLE coupons (
    code            TEXT PRIMARY KEY,
    discount_pct    INT,                    -- e.g. 20 for 20%
    discount_cents  INT,                    -- flat discount
    max_uses        INT,
    used_count      INT NOT NULL DEFAULT 0,
    expires_at      TIMESTAMPTZ,
    plan_codes      TEXT[],                 -- NULL = all plans
    is_active       BOOLEAN DEFAULT true
);

-- Seed free plan
INSERT INTO plans (code, name, tier, price_cents, currency, interval, features) VALUES
    ('free', 'Free', 'free', 0, 'USD', 'lifetime', '["basic_lessons","vocab_500"]'),
    ('plus_monthly', 'Plus Monthly', 'plus', 999, 'USD', 'month', '["unlimited_lessons","vocab_unlimited","ai_tutor_basic"]'),
    ('plus_annual', 'Plus Annual', 'plus', 7999, 'USD', 'year', '["unlimited_lessons","vocab_unlimited","ai_tutor_basic","annual_discount"]'),
    ('pro_monthly', 'Pro Monthly', 'pro', 1999, 'USD', 'month', '["unlimited_lessons","vocab_unlimited","ai_tutor_pro","speech_ai","mock_tests"]'),
    ('pro_annual', 'Pro Annual', 'pro', 15999, 'USD', 'year', '["unlimited_lessons","vocab_unlimited","ai_tutor_pro","speech_ai","mock_tests","annual_discount"]');

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS plans;
-- +goose StatementEnd
