-- +goose Up
-- +goose StatementBegin

CREATE TABLE skill_scores (
    user_id         UUID NOT NULL,
    language        TEXT NOT NULL,
    skill           TEXT NOT NULL,
    score           NUMERIC(6,2) NOT NULL DEFAULT 0,
    ci_low          NUMERIC(6,2),
    ci_high         NUMERIC(6,2),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, language, skill)
);

CREATE INDEX ix_skill_scores_user ON skill_scores (user_id, language);

CREATE TABLE skill_score_history (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID NOT NULL,
    language    TEXT NOT NULL,
    skill       TEXT NOT NULL,
    score       NUMERIC(6,2) NOT NULL,
    delta       NUMERIC(6,2),
    event_ref   TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_score_history_user ON skill_score_history (user_id, language, skill, recorded_at DESC);

CREATE TABLE cert_predictions (
    user_id         UUID NOT NULL,
    cert_code       TEXT NOT NULL,
    predicted_score NUMERIC(6,2),
    predicted_band  TEXT,
    model_version   TEXT DEFAULT '1.0',
    computed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, cert_code)
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS cert_predictions;
DROP TABLE IF EXISTS skill_score_history;
DROP TABLE IF EXISTS skill_scores;
-- +goose StatementEnd
