-- 00003_add_onboarding.sql
-- T3: Onboarding state machine table.
-- Powers the /onboarding multi-step flow (language → goal → level → placement → done).

-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS user_onboarding (
    user_id              UUID        PRIMARY KEY,
    step                 VARCHAR(50) NOT NULL DEFAULT 'language_select',
    answers              JSONB       NOT NULL DEFAULT '{}',
    placement_cefr       VARCHAR(10) NULL,
    recommended_track_id VARCHAR(255) NULL,
    completed_at         TIMESTAMPTZ NULL,
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN user_onboarding.step IS 'language_select | goal_select | level_select | placement | done';
COMMENT ON COLUMN user_onboarding.answers IS 'Accumulated step answers as JSONB blob';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS user_onboarding;
-- +goose StatementEnd
