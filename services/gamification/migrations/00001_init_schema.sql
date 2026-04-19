-- +goose Up
-- +goose StatementBegin

CREATE TABLE user_xp (
    user_id     UUID PRIMARY KEY,
    total_xp    BIGINT NOT NULL DEFAULT 0,
    level       INT NOT NULL DEFAULT 1,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_streaks (
    user_id         UUID PRIMARY KEY,
    current         INT NOT NULL DEFAULT 0,
    longest         INT NOT NULL DEFAULT 0,
    last_active_date DATE,
    freezes_left    INT NOT NULL DEFAULT 0
);

CREATE TABLE achievements (
    code        TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT,
    icon        TEXT,
    xp_reward   INT NOT NULL DEFAULT 0,
    criteria    JSONB
);

CREATE TABLE user_achievements (
    user_id          UUID NOT NULL,
    achievement_code TEXT NOT NULL REFERENCES achievements(code),
    earned_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, achievement_code)
);

CREATE TABLE league_history (
    user_id     UUID NOT NULL,
    week_start  DATE NOT NULL,
    league      TEXT NOT NULL,
    rank        INT,
    xp          INT,
    promoted    BOOLEAN DEFAULT false,
    PRIMARY KEY (user_id, week_start)
);

CREATE INDEX ix_user_xp_level ON user_xp (level DESC, total_xp DESC);
CREATE INDEX ix_achievements_user ON user_achievements (user_id);

-- Seed core achievements
INSERT INTO achievements (code, name, description, icon, xp_reward) VALUES
    ('first_lesson', 'First Lesson', 'Complete your first lesson', '🌱', 50),
    ('streak_7', '7-Day Streak', 'Maintain a 7-day learning streak', '🔥', 100),
    ('streak_30', '30-Day Streak', 'Maintain a 30-day learning streak', '💎', 500),
    ('vocab_100', 'Vocab Builder', 'Learn 100 vocabulary words', '📚', 200),
    ('perfect_score', 'Perfect Score', 'Score 100% on any exercise', '⭐', 75),
    ('level_10', 'Rising Star', 'Reach Level 10', '🌟', 300),
    ('level_25', 'Expert', 'Reach Level 25', '👑', 1000);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS league_history;
DROP TABLE IF EXISTS user_achievements;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS user_streaks;
DROP TABLE IF EXISTS user_xp;
-- +goose StatementEnd
