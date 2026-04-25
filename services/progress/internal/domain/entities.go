package domain

import (
	"time"

	"github.com/google/uuid"
)

// Skill represents a measurable language skill.
type Skill string

const (
	SkillListening  Skill = "listening"
	SkillReading    Skill = "reading"
	SkillWriting    Skill = "writing"
	SkillSpeaking   Skill = "speaking"
	SkillVocab      Skill = "vocab"
	SkillGrammar    Skill = "grammar"
)

// SkillScore represents the current score for a user/language/skill combination.
type SkillScore struct {
	UserID    uuid.UUID `json:"user_id"`
	Language  string    `json:"language"`
	Skill     Skill     `json:"skill"`
	Score     float64   `json:"score"`    // 0–100
	CILow     *float64  `json:"ci_low,omitempty"`
	CIHigh    *float64  `json:"ci_high,omitempty"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ScoreHistoryEntry is a point-in-time record of a skill score change.
type ScoreHistoryEntry struct {
	ID         int64     `json:"id"`
	UserID     uuid.UUID `json:"user_id"`
	Language   string    `json:"language"`
	Skill      Skill     `json:"skill"`
	Score      float64   `json:"score"`
	Delta      *float64  `json:"delta,omitempty"`
	EventRef   string    `json:"event_ref,omitempty"` // e.g. "assessment.exercise.graded:uuid"
	RecordedAt time.Time `json:"recorded_at"`
}

// ActivityDay is one day's aggregated study activity (for the heatmap UI).
type ActivityDay struct {
	Date            string `json:"date"`             // "YYYY-MM-DD"
	Minutes         int    `json:"minutes"`
	Xp              int    `json:"xp"`
	LessonsCompleted int   `json:"lessonsCompleted"`
}

type SkillOverview struct {
	UserID   uuid.UUID             `json:"user_id"`
	Language string                `json:"language"`
	Skills   map[string]SkillScore `json:"skills"`
}

// CertPrediction holds a predicted certification score.
type CertPrediction struct {
	UserID         uuid.UUID  `json:"user_id"`
	CertCode       string     `json:"cert_code"` // ielts|toeic|jlpt_n3|hsk3
	PredictedScore float64    `json:"predicted_score"`
	PredictedBand  string     `json:"predicted_band,omitempty"` // e.g. "B2", "6.5"
	ModelVersion   string     `json:"model_version"`
	ComputedAt     time.Time  `json:"computed_at"`
}

// ─── Kafka event consumed by progress-service ─────────────────────────────────

type ExerciseGradedEvent struct {
	EventID      string    `json:"event_id"`
	UserID       string    `json:"user_id"`
	ExerciseID   string    `json:"exercise_id"`
	ExerciseType string    `json:"exercise_type"`
	Score        float64   `json:"score"`
	MaxScore     float64   `json:"max_score"`
	SkillTag     string    `json:"skill_tag"`
	Language     string    `json:"language"`
	CreatedAt    time.Time `json:"created_at"`
}

type LessonCompletedEvent struct {
	EventID        string    `json:"event_id"`
	UserID         string    `json:"user_id"`
	LessonID       string    `json:"lesson_id"`
	Language       string    `json:"language"`
	SkillEmphasis  string    `json:"skill_emphasis"`
	Score          float64   `json:"score"`
	XPEarned       int       `json:"xp_earned"`
	TimeSpentSec   int       `json:"time_spent_sec"`
	CreatedAt      time.Time `json:"created_at"`
}
