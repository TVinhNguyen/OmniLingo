-- +goose Up
-- +goose StatementBegin

CREATE TABLE user_learning_profiles (
    user_id             UUID PRIMARY KEY,
    primary_language    TEXT NOT NULL,
    secondary_languages TEXT[] DEFAULT '{}',
    starting_level      TEXT,
    goals               JSONB NOT NULL DEFAULT '[]',
    preferences         JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_learning_paths (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL,
    language            TEXT NOT NULL,
    path_template_id    TEXT NOT NULL,
    current_unit_id     TEXT,
    progress_pct        NUMERIC(5,2) DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_paths_user ON user_learning_paths(user_id, language);

CREATE TABLE user_lesson_attempts (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID NOT NULL,
    lesson_id       TEXT NOT NULL,
    lesson_version  INT NOT NULL DEFAULT 1,
    path_id         UUID,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at    TIMESTAMPTZ,
    score           NUMERIC(5,2),
    xp_earned       INT,
    time_spent_sec  INT
);

CREATE INDEX ix_attempts_user ON user_lesson_attempts(user_id, started_at DESC);
CREATE INDEX ix_attempts_lesson ON user_lesson_attempts(lesson_id);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS user_lesson_attempts;
DROP TABLE IF EXISTS user_learning_paths;
DROP TABLE IF EXISTS user_learning_profiles;
-- +goose StatementEnd
