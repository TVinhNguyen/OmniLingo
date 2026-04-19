package domain

import (
	"time"

	"github.com/google/uuid"
)

// ExerciseGradedEvent is emitted after every auto-graded exercise.
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

// TestCompletedEvent is emitted after a mock test is fully graded.
type TestCompletedEvent struct {
	EventID     string             `json:"event_id"`
	UserID      string             `json:"user_id"`
	SessionID   string             `json:"session_id"`
	TestID      string             `json:"test_id"`
	TotalScore  float64            `json:"total_score"`
	SkillScores map[string]float64 `json:"skill_scores"`
	CreatedAt   time.Time          `json:"created_at"`
}

func NewExerciseGradedEvent(sub *Submission) ExerciseGradedEvent {
	score := 0.0
	maxScore := 1.0
	if sub.Result != nil {
		score = sub.Result.Score
		maxScore = sub.Result.MaxScore
	}
	return ExerciseGradedEvent{
		EventID:      uuid.New().String(),
		UserID:       sub.UserID.String(),
		ExerciseID:   sub.ExerciseID,
		ExerciseType: string(sub.ExerciseType),
		Score:        score,
		MaxScore:     maxScore,
		SkillTag:     sub.SkillTag,
		Language:     sub.Language,
		CreatedAt:    time.Now().UTC(),
	}
}
