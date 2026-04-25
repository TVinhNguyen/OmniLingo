package domain

import (
	"time"

	"github.com/google/uuid"
)

// ─── Learning Profile ─────────────────────────────────────────────────────────

type LearningProfile struct {
	UserID             uuid.UUID `json:"user_id"`
	PrimaryLanguage    string    `json:"primary_language"`
	SecondaryLanguages []string  `json:"secondary_languages"`
	StartingLevel      string    `json:"starting_level,omitempty"`
	Goals              []Goal    `json:"goals"`
	Preferences        Prefs     `json:"preferences"`

	// Learning preferences — previously in identity-service, now correctly owned here.
	DailyGoalMinutes  int      `json:"daily_goal_minutes"`
	ReminderTime      *string  `json:"reminder_time,omitempty"` // "HH:MM" 24h or nil
	LearningLanguages []string `json:"learning_languages"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Goal struct {
	Type     string  `json:"type"`     // cert | skill | vocab_count
	Cert     string  `json:"cert,omitempty"`
	Target   float64 `json:"target,omitempty"`
	Deadline string  `json:"deadline,omitempty"` // YYYY-MM-DD
}

type Prefs struct {
	NotifEnabled bool   `json:"notif_enabled"`
	UITheme      string `json:"ui_theme"` // light|dark
}

// ─── Learning Path ────────────────────────────────────────────────────────────

type LearningPath struct {
	ID              uuid.UUID `json:"id"`
	UserID          uuid.UUID `json:"user_id"`
	Language        string    `json:"language"`
	PathTemplateID  string    `json:"path_template_id"`
	CurrentUnitID   string    `json:"current_unit_id,omitempty"`
	ProgressPct     float64   `json:"progress_pct"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// ─── Lesson Attempt ───────────────────────────────────────────────────────────

type LessonAttempt struct {
	ID            int64      `json:"id"`
	UserID        uuid.UUID  `json:"user_id"`
	LessonID      string     `json:"lesson_id"`
	LessonVersion int        `json:"lesson_version"`
	PathID        *uuid.UUID `json:"path_id,omitempty"`
	StartedAt     time.Time  `json:"started_at"`
	CompletedAt   *time.Time `json:"completed_at,omitempty"`
	Score         *float64   `json:"score,omitempty"`
	XPEarned      *int       `json:"xp_earned,omitempty"`
	TimeSpentSec  *int       `json:"time_spent_sec,omitempty"`
}

// ─── Events emitted ───────────────────────────────────────────────────────────

type LessonStartedEvent struct {
	EventID   string    `json:"event_id"`
	UserID    string    `json:"user_id"`
	LessonID  string    `json:"lesson_id"`
	Language  string    `json:"language"`
	CreatedAt time.Time `json:"created_at"`
}

type LessonCompletedEvent struct {
	EventID       string    `json:"event_id"`
	UserID        string    `json:"user_id"`
	LessonID      string    `json:"lesson_id"`
	Language      string    `json:"language"`
	Score         float64   `json:"score"`
	XPEarned      int       `json:"xp_earned"`
	TimeSpentSec  int       `json:"time_spent_sec"`
	SkillEmphasis string    `json:"skill_emphasis"`
	CreatedAt     time.Time `json:"created_at"`
}

type GoalSetEvent struct {
	EventID   string    `json:"event_id"`
	UserID    string    `json:"user_id"`
	Goals     []Goal    `json:"goals"`
	CreatedAt time.Time `json:"created_at"`
}

// TodayMission is returned by GET /api/v1/learning/today-mission
// and powers the dashboard "Today's Mission" widget.
type TodayMission struct {
	LessonID      *string `json:"lesson_id"`        // nil if no active path
	LessonTitle   *string `json:"lesson_title"`
	MinutesToGoal int     `json:"minutes_to_goal"`  // daily_goal_minutes - minutes studied today
	XPReward      int     `json:"xp_reward"`
	DueCardCount  int     `json:"due_card_count"`
}
