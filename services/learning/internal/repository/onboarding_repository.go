package repository

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/omnilingo/learning-service/internal/domain"
)

// OnboardingRepository persists and retrieves onboarding state.
type OnboardingRepository interface {
	GetState(ctx context.Context, userID uuid.UUID) (*domain.OnboardingState, error)
	UpsertStep(ctx context.Context, userID uuid.UUID, step domain.OnboardingStep, answers map[string]any) error
	Complete(ctx context.Context, userID uuid.UUID, cefr, trackID *string) error
}

type onboardingRepo struct{ db *pgxpool.Pool }

func NewOnboardingRepository(db *pgxpool.Pool) OnboardingRepository {
	return &onboardingRepo{db: db}
}

func (r *onboardingRepo) GetState(ctx context.Context, userID uuid.UUID) (*domain.OnboardingState, error) {
	row := r.db.QueryRow(ctx, `
		SELECT user_id, step, answers, placement_cefr, recommended_track_id, completed_at
		FROM user_onboarding WHERE user_id = $1`, userID)

	var rawAnswers []byte
	s := &domain.OnboardingState{}
	err := row.Scan(&s.UserID, &s.Step, &rawAnswers, &s.PlacementCefr, &s.RecommendedTrackId, &s.CompletedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			// Return a fresh state for users who haven't started onboarding
			return &domain.OnboardingState{
				UserID:  userID.String(),
				Step:    domain.StepLanguageSelect,
				Answers: map[string]any{},
			}, nil
		}
		return nil, err
	}
	s.Answers = map[string]any{}
	_ = json.Unmarshal(rawAnswers, &s.Answers)
	return s, nil
}

func (r *onboardingRepo) UpsertStep(ctx context.Context, userID uuid.UUID, step domain.OnboardingStep, answers map[string]any) error {
	answersJSON, _ := json.Marshal(answers)
	_, err := r.db.Exec(ctx, `
		INSERT INTO user_onboarding (user_id, step, answers, updated_at)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (user_id) DO UPDATE SET
			step       = EXCLUDED.step,
			answers    = user_onboarding.answers || EXCLUDED.answers, -- merge, not replace
			updated_at = EXCLUDED.updated_at`,
		userID, step, answersJSON, time.Now().UTC())
	return err
}

func (r *onboardingRepo) Complete(ctx context.Context, userID uuid.UUID, cefr, trackID *string) error {
	now := time.Now().UTC()
	_, err := r.db.Exec(ctx, `
		INSERT INTO user_onboarding (user_id, step, answers, placement_cefr, recommended_track_id, completed_at, updated_at)
		VALUES ($1, $2, '{}', $3, $4, $5, $5)
		ON CONFLICT (user_id) DO UPDATE SET
			step                 = EXCLUDED.step,
			placement_cefr       = COALESCE(EXCLUDED.placement_cefr, user_onboarding.placement_cefr),
			recommended_track_id = COALESCE(EXCLUDED.recommended_track_id, user_onboarding.recommended_track_id),
			completed_at         = EXCLUDED.completed_at,
			updated_at           = EXCLUDED.updated_at`,
		userID, domain.StepDone, cefr, trackID, now)
	return err
}
