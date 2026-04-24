-- T5 Activity Heatmap: daily aggregation table for user activity
-- Used by GET /api/v1/progress/activity-heatmap?days=365

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

-- Backfill from existing lesson_completions if table exists
INSERT INTO user_activity_daily (user_id, date, xp_earned, lessons_done, updated_at)
SELECT
    user_id,
    DATE(completed_at),
    COALESCE(SUM(xp_earned), 0),
    COUNT(*),
    NOW()
FROM lesson_completions
GROUP BY user_id, DATE(completed_at)
ON CONFLICT (user_id, date)
DO UPDATE
    SET xp_earned    = EXCLUDED.xp_earned,
        lessons_done  = EXCLUDED.lessons_done,
        updated_at    = NOW();
