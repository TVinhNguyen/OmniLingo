-- +goose Up
-- +goose StatementBegin

CREATE TABLE submissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,
    exercise_id     TEXT NOT NULL,
    exercise_type   TEXT NOT NULL,
    answer          JSONB NOT NULL,
    score           NUMERIC(5,2),
    max_score       NUMERIC(5,2) DEFAULT 1.0,
    correct         BOOLEAN,
    skill_tag       TEXT,
    language        TEXT,
    explanation     TEXT,
    submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    graded_at       TIMESTAMPTZ
);

CREATE INDEX ix_submissions_user ON submissions (user_id, submitted_at DESC);
CREATE INDEX ix_submissions_exercise ON submissions (exercise_id);

CREATE TABLE test_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,
    test_id         TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'started',
    answers         JSONB,
    total_score     NUMERIC(6,2),
    skill_scores    JSONB,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at    TIMESTAMPTZ
);

CREATE INDEX ix_test_sessions_user ON test_sessions (user_id, started_at DESC);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS test_sessions;
DROP TABLE IF EXISTS submissions;
-- +goose StatementEnd
