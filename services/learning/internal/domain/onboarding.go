package domain

import "time"

// OnboardingStep enumerates the ordered steps in the onboarding flow.
type OnboardingStep string

const (
	StepLanguageSelect OnboardingStep = "language_select" // step 1: pick target language
	StepGoalSelect     OnboardingStep = "goal_select"     // step 2: pick learning goal
	StepLevelSelect    OnboardingStep = "level_select"    // step 3: self-rate level / skip to placement
	StepPlacement      OnboardingStep = "placement"       // step 4: placement test (optional)
	StepDone           OnboardingStep = "done"            // onboarding complete
)

// OnboardingState holds the cumulative state of a user's onboarding progress.
type OnboardingState struct {
	UserID              string            `json:"userId"`
	Step                OnboardingStep    `json:"step"`
	Answers             map[string]any    `json:"answers"` // merged across steps
	PlacementCefr       *string           `json:"placementCefr,omitempty"`
	RecommendedTrackId  *string           `json:"recommendedTrackId,omitempty"`
	CompletedAt         *time.Time        `json:"completedAt,omitempty"`
}
