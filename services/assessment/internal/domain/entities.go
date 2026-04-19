package domain

import (
	"time"

	"github.com/google/uuid"
)

// ─── Submission request ───────────────────────────────────────────────────────

// ExerciseType enumerates supported auto-gradable exercise types.
type ExerciseType string

const (
	ExerciseMultipleChoice ExerciseType = "multiple_choice"
	ExerciseGapFill        ExerciseType = "gap_fill"
	ExerciseMatching        ExerciseType = "matching"
	ExerciseDictation      ExerciseType = "dictation"
	ExerciseSpeaking       ExerciseType = "speaking_prompt"
	ExerciseWriting        ExerciseType = "writing_prompt"
)

// Rating is used by auto-grader to express correctness as a ratio.
type GradeResult struct {
	Score       float64 `json:"score"`        // 0.0–1.0
	MaxScore    float64 `json:"max_score"`
	Correct     bool    `json:"correct"`
	Explanation string  `json:"explanation,omitempty"`
	Detail      any     `json:"detail,omitempty"`
}

// ─── Submission ───────────────────────────────────────────────────────────────

type Submission struct {
	ID           uuid.UUID    `json:"id"`
	UserID       uuid.UUID    `json:"user_id"`
	ExerciseID   string       `json:"exercise_id"`
	ExerciseType ExerciseType `json:"exercise_type"`
	Answer       any          `json:"answer"` // varies per type
	Result       *GradeResult `json:"result,omitempty"`
	SkillTag     string       `json:"skill_tag,omitempty"`
	Language     string       `json:"language,omitempty"`
	SubmittedAt  time.Time    `json:"submitted_at"`
	GradedAt     *time.Time   `json:"graded_at,omitempty"`
}

// ─── Mock Test ────────────────────────────────────────────────────────────────

type TestStatus string

const (
	TestStatusStarted   TestStatus = "started"
	TestStatusCompleted TestStatus = "completed"
	TestStatusAbandoned TestStatus = "abandoned"
)

type TestSession struct {
	ID          uuid.UUID         `json:"id"`
	UserID      uuid.UUID         `json:"user_id"`
	TestID      string            `json:"test_id"`
	Status      TestStatus        `json:"status"`
	Answers     map[string]any    `json:"answers,omitempty"` // question_id → answer
	TotalScore  *float64          `json:"total_score,omitempty"`
	SkillScores map[string]float64 `json:"skill_scores,omitempty"`
	StartedAt   time.Time         `json:"started_at"`
	CompletedAt *time.Time        `json:"completed_at,omitempty"`
}

// ─── Question Bank Entry ──────────────────────────────────────────────────────

type Question struct {
	ID           string    `json:"id"`
	Cert         string    `json:"cert"`     // ielts|toeic|jlpt|hsk
	Section      string    `json:"section"`  // listening|reading|writing|speaking
	Part         int       `json:"part"`
	Difficulty   float64   `json:"difficulty"` // 0..1
	QuestionText string    `json:"question_text"`
	Choices      []string  `json:"choices,omitempty"`
	Answer       string    `json:"answer"`
	Explanation  string    `json:"explanation,omitempty"`
	SkillsTested []string  `json:"skills_tested,omitempty"`
	Language     string    `json:"language"`
	CreatedAt    time.Time `json:"created_at"`
}
