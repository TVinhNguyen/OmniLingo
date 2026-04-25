-- 00004_add_learning_preferences.sql
-- Extend users table with learning-preference fields for /settings/learning.

-- +goose Up
-- +goose StatementBegin

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS daily_goal_minutes   INT          NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS reminder_time        TIME         NULL,
  ADD COLUMN IF NOT EXISTS learning_languages   TEXT[]       NOT NULL DEFAULT '{}';

COMMENT ON COLUMN users.daily_goal_minutes  IS 'User daily study goal in minutes (5, 10, 15, 20, 30, 60)';
COMMENT ON COLUMN users.reminder_time       IS 'Local time-of-day reminder (nullable = disabled)';
COMMENT ON COLUMN users.learning_languages  IS 'Array of BCP-47 language codes the user is actively studying';

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users
  DROP COLUMN IF EXISTS daily_goal_minutes,
  DROP COLUMN IF EXISTS reminder_time,
  DROP COLUMN IF EXISTS learning_languages;
-- +goose StatementEnd
