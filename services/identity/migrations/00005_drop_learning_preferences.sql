-- 00005_drop_learning_preferences.sql
-- Learning preferences (daily_goal_minutes, reminder_time, learning_languages)
-- are owned by learning-service (correct bounded context).
-- They were temporarily added to identity in migration 00004 and are now removed.
-- SOURCE OF TRUTH: learning-service.user_learning_profiles

-- +goose Up
-- +goose StatementBegin
ALTER TABLE users
  DROP COLUMN IF EXISTS daily_goal_minutes,
  DROP COLUMN IF EXISTS reminder_time,
  DROP COLUMN IF EXISTS learning_languages;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS daily_goal_minutes   INT    NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS reminder_time        TIME   NULL,
  ADD COLUMN IF NOT EXISTS learning_languages   TEXT[] NOT NULL DEFAULT '{}';
-- +goose StatementEnd
