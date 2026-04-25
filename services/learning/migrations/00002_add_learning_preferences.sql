-- 00002_add_learning_preferences.sql
-- Move learning preferences from identity-service to here (correct bounded context).
-- user_learning_profiles already owns primary_language, goals, preferences.
-- daily_goal_minutes, reminder_time, learning_languages belong here.

-- +goose Up
-- +goose StatementBegin
ALTER TABLE user_learning_profiles
  ADD COLUMN IF NOT EXISTS daily_goal_minutes   INT    NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS reminder_time        TIME   NULL,
  ADD COLUMN IF NOT EXISTS learning_languages   TEXT[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN user_learning_profiles.daily_goal_minutes IS 'Daily study goal in minutes (5,10,15,20,30,60)';
COMMENT ON COLUMN user_learning_profiles.reminder_time      IS 'HH:MM 24h local reminder time, NULL = disabled';
COMMENT ON COLUMN user_learning_profiles.learning_languages IS 'BCP-47 language codes user is actively studying';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE user_learning_profiles
  DROP COLUMN IF EXISTS daily_goal_minutes,
  DROP COLUMN IF EXISTS reminder_time,
  DROP COLUMN IF EXISTS learning_languages;
-- +goose StatementEnd
