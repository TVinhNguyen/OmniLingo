-- +goose Up
-- +goose StatementBegin

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- llm_request_logs: immutable audit + cost tracking for every LLM call
CREATE TABLE llm_request_logs (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id     VARCHAR(80) NOT NULL,
    user_id        UUID        NOT NULL,
    caller_service VARCHAR(50) NOT NULL,
    provider       VARCHAR(20) NOT NULL,
    model          VARCHAR(80) NOT NULL,
    prompt_tokens  INT         NOT NULL DEFAULT 0,
    output_tokens  INT         NOT NULL DEFAULT 0,
    cost_usd       NUMERIC(10,6) NOT NULL DEFAULT 0,
    cache_hit      BOOLEAN     NOT NULL DEFAULT false,
    latency_ms     INT         NOT NULL DEFAULT 0,
    error          TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_llm_logs_user_date ON llm_request_logs (user_id, created_at DESC);
CREATE INDEX ix_llm_logs_caller    ON llm_request_logs (caller_service, created_at DESC);

-- daily_budgets: per-user daily token usage (keyed by user + date string "YYYY-MM-DD")
-- Using upsert pattern: INSERT ... ON CONFLICT DO UPDATE
CREATE TABLE daily_budgets (
    user_id      UUID        NOT NULL,
    date         DATE        NOT NULL,
    tokens_used  INT         NOT NULL DEFAULT 0,
    tokens_limit INT         NOT NULL DEFAULT 4000, -- updated on entitlement event
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, date)
);

-- prompt_templates: named reusable prompt templates
CREATE TABLE prompt_templates (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(80) NOT NULL UNIQUE,
    template   TEXT        NOT NULL,
    model      VARCHAR(80) NOT NULL DEFAULT 'claude-3-haiku-20240307',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS prompt_templates;
DROP TABLE IF EXISTS daily_budgets;
DROP TABLE IF EXISTS llm_request_logs;
-- +goose StatementEnd
