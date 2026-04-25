-- T5 Activity Heatmap: daily aggregation table for user activity
-- Used by GET /api/v1/progress/activity-heatmap?days=365
--
-- NOTE: This table is populated in real-time by HandleLessonCompleted (Kafka consumer).
-- No historical backfill is performed here — progress-service has no direct access to
-- learning-service's user_lesson_attempts table. Data starts accumulating from first
-- lesson completed after this migration runs.

-- +goose Up
-- +goose StatementBegin

CREATE TABLE IF NOT EXISTS user_activity_daily (
    user_id         UUID        NOT NULL,
    date            DATE        NOT NULL,
    minutes_studied INT         NOT NULL DEFAULT 0,
    xp_earned       INT         NOT NULL DEFAULT 0,
    lessons_done    INT         NOT NULL DEFAULT 0,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_activity_user_date
    ON user_activity_daily (user_id, date DESC);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS user_activity_daily;
-- +goose StatementEnd
