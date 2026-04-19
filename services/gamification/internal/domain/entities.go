package domain

import (
	"time"

	"github.com/google/uuid"
)

// ─── XP & Level ───────────────────────────────────────────────────────────────

type UserXP struct {
	UserID    uuid.UUID `json:"user_id"`
	TotalXP   int64     `json:"total_xp"`
	Level     int       `json:"level"`
	UpdatedAt time.Time `json:"updated_at"`
}

// XPToLevel converts total XP to a level (simple quadratic formula).
// Level = floor(sqrt(totalXP / 100)) + 1
func XPToLevel(totalXP int64) int {
	if totalXP <= 0 { return 1 }
	level := 1
	for xpRequired := int64(100); totalXP >= xpRequired; xpRequired = int64(level*level) * 100 {
		level++
	}
	return level
}

// ─── Streaks ──────────────────────────────────────────────────────────────────

type UserStreak struct {
	UserID         uuid.UUID `json:"user_id"`
	Current        int       `json:"current"`
	Longest        int       `json:"longest"`
	LastActiveDate *string   `json:"last_active_date,omitempty"` // YYYY-MM-DD UTC
	FreezesLeft    int       `json:"freezes_left"`
}

// ─── Achievements ─────────────────────────────────────────────────────────────

type Achievement struct {
	Code        string `json:"code"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	XPReward    int    `json:"xp_reward"`
}

type UserAchievement struct {
	UserID          uuid.UUID   `json:"user_id"`
	AchievementCode string      `json:"achievement_code"`
	Achievement     Achievement `json:"achievement"`
	EarnedAt        time.Time   `json:"earned_at"`
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

type LeaderboardEntry struct {
	UserID  string  `json:"user_id"`
	Score   float64 `json:"score"` // XP this week
	Rank    int     `json:"rank"`
}

// ─── Gamification Profile ────────────────────────────────────────────────────

type GamificationProfile struct {
	UserID       uuid.UUID         `json:"user_id"`
	XP           *UserXP           `json:"xp"`
	Streak       *UserStreak       `json:"streak"`
	Achievements []UserAchievement `json:"achievements"`
}

// ─── Events from Kafka ────────────────────────────────────────────────────────

type ExerciseGradedEvent struct {
	EventID    string    `json:"event_id"`
	UserID     string    `json:"user_id"`
	Score      float64   `json:"score"`
	MaxScore   float64   `json:"max_score"`
	Language   string    `json:"language"`
	CreatedAt  time.Time `json:"created_at"`
}

type LessonCompletedEvent struct {
	EventID      string    `json:"event_id"`
	UserID       string    `json:"user_id"`
	LessonID     string    `json:"lesson_id"`
	Language     string    `json:"language"`
	XPEarned     int       `json:"xp_earned"`
	Score        float64   `json:"score"`
	CreatedAt    time.Time `json:"created_at"`
}
