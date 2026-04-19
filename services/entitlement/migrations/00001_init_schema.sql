-- +goose Up
-- +goose StatementBegin

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- plan_features: source of truth for feature → plan mapping.
-- Each row maps one feature_code to a minimum plan_tier required to access it.
CREATE TABLE plan_features (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_code VARCHAR(80) NOT NULL UNIQUE,  -- e.g. 'ai_chat_tutor', 'offline_mode'
    description  TEXT,
    -- min_tier: minimum tier that gets access. All tiers >= min_tier have access.
    -- Ordered: free < plus < pro < ultimate < family < schools < enterprise
    min_tier     VARCHAR(20) NOT NULL DEFAULT 'free',
    -- Some features are quota-based per tier: store as JSONB
    -- e.g. {"free":10,"plus":50,"pro":-1}  (-1 = unlimited)
    quota_map    JSONB       NOT NULL DEFAULT '{}',
    is_active    BOOLEAN     NOT NULL DEFAULT true,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_plan_features_active ON plan_features (is_active, min_tier);

-- user_entitlements: cache/override table.
-- Normally entitlements come from billing-service (via Kafka) and are cached in Redis.
-- This table holds the canonical user→plan state for durability.
CREATE TABLE user_entitlements (
    user_id      UUID        PRIMARY KEY,
    plan_tier    VARCHAR(20) NOT NULL DEFAULT 'free',
    -- 'free' | 'plus' | 'pro' | 'ultimate' | 'family' | 'schools' | 'enterprise'
    valid_until  TIMESTAMPTZ,          -- NULL = free (no expiry), else subscription end
    family_owner_id UUID,              -- set if user is a family member (not owner)
    org_id       UUID,                 -- set for schools/enterprise users
    overrides    JSONB NOT NULL DEFAULT '{}', -- per-feature overrides {"ai_chat_tutor": true}
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_user_entitlements_plan ON user_entitlements (plan_tier);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_plan_features_updated_at
    BEFORE UPDATE ON plan_features
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_user_entitlements_updated_at
    BEFORE UPDATE ON user_entitlements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS user_entitlements;
DROP TABLE IF EXISTS plan_features;
DROP FUNCTION IF EXISTS update_updated_at();
-- +goose StatementEnd
