// Package service implements the progress calculation logic.
// Uses Exponential Moving Average (EMA) for skill score updates,
// weighted by difficulty and time recency.
package service

import (
	"context"
	"encoding/json"
	"math"
	"time"

	"github.com/google/uuid"
	"github.com/omnilingo/progress-service/internal/domain"
	"github.com/omnilingo/progress-service/internal/repository"
	"go.uber.org/zap"
)

const (
	// EMA smoothing factor: 0.2 → recent events have 20% weight, 80% is historical
	emaAlpha = 0.2
	// Default model version for cert predictions
	modelVersion = "1.0-ema"
)

// certSkillWeights maps standardized tests to the skill weights used for prediction.
var certSkillWeights = map[string]map[string]float64{
	"ielts":  {"listening": 0.25, "reading": 0.25, "writing": 0.25, "speaking": 0.25},
	"toeic":  {"listening": 0.5, "reading": 0.5},
	"jlpt":   {"vocab": 0.33, "reading": 0.33, "grammar": 0.34},
	"hsk":    {"vocab": 0.4, "reading": 0.3, "grammar": 0.3},
	"toefl":  {"listening": 0.25, "reading": 0.25, "writing": 0.25, "speaking": 0.25},
}

// ProgressService handles skill score updates and cert predictions.
type ProgressService interface {
	GetOverview(ctx context.Context, userID uuid.UUID, language string) (*domain.SkillOverview, error)
	GetSkillHistory(ctx context.Context, userID uuid.UUID, language, skill string, days int) ([]*domain.ScoreHistoryEntry, error)
	GetPredictedScore(ctx context.Context, userID uuid.UUID, certCode string) (*domain.CertPrediction, error)
	GetActivityHeatmap(ctx context.Context, userID uuid.UUID, days int) ([]*domain.ActivityDay, error)
	HandleExerciseGraded(ctx context.Context, event *domain.ExerciseGradedEvent) error
	HandleLessonCompleted(ctx context.Context, event *domain.LessonCompletedEvent) error
}

type progressService struct {
	scoreRepo    repository.SkillScoreRepository
	predRepo     repository.CertPredictionRepository
	activityRepo repository.ActivityDailyRepository
	log          *zap.Logger
}

func NewProgressService(
	scoreRepo    repository.SkillScoreRepository,
	predRepo     repository.CertPredictionRepository,
	activityRepo repository.ActivityDailyRepository,
	log          *zap.Logger,
) ProgressService {
	return &progressService{scoreRepo: scoreRepo, predRepo: predRepo, activityRepo: activityRepo, log: log}
}

// GetOverview returns all skill scores for a user in a language.
func (s *progressService) GetOverview(ctx context.Context, userID uuid.UUID, language string) (*domain.SkillOverview, error) {
	scores, err := s.scoreRepo.GetOverview(ctx, userID, language)
	if err != nil {
		return nil, domain.ErrInternalError
	}
	overview := &domain.SkillOverview{
		UserID:   userID,
		Language: language,
		Skills:   make(map[string]domain.SkillScore),
	}
	for _, sc := range scores {
		overview.Skills[string(sc.Skill)] = *sc
	}
	return overview, nil
}

// GetSkillHistory returns time-series history for a single skill.
func (s *progressService) GetSkillHistory(ctx context.Context, userID uuid.UUID, language, skill string, days int) ([]*domain.ScoreHistoryEntry, error) {
	limit := days
	if limit <= 0 || limit > 90 { limit = 30 }
	return s.scoreRepo.GetHistory(ctx, userID, language, skill, limit)
}

// GetActivityHeatmap returns per-day activity for the heatmap UI.
func (s *progressService) GetActivityHeatmap(ctx context.Context, userID uuid.UUID, days int) ([]*domain.ActivityDay, error) {
	if days <= 0 || days > 365 { days = 365 }
	return s.activityRepo.GetHeatmap(ctx, userID, days)
}

// GetPredictedScore computes or retrieves a cert score prediction.
func (s *progressService) GetPredictedScore(ctx context.Context, userID uuid.UUID, certCode string) (*domain.CertPrediction, error) {
	weights, ok := certSkillWeights[certCode]
	if !ok {
		return nil, domain.Errorf("UNSUPPORTED_CERT", "cert %q not supported for prediction", certCode)
	}

	// Load all relevant skill scores
	pred := &domain.CertPrediction{
		UserID:       userID,
		CertCode:     certCode,
		ModelVersion: modelVersion,
		ComputedAt:   time.Now().UTC(),
	}
	totalWeight := 0.0
	weightedSum := 0.0
	for skill, weight := range weights {
		sc, err := s.scoreRepo.GetSkillScore(ctx, userID, "", skill)
		if err == nil {
			weightedSum += sc.Score * weight
			totalWeight += weight
		}
	}
	if totalWeight > 0 {
		pred.PredictedScore = weightedSum / totalWeight
	}
	pred.PredictedBand = scoreToBand(certCode, pred.PredictedScore)

	// Cache prediction
	_ = s.predRepo.Upsert(ctx, pred)
	return pred, nil
}

// HandleExerciseGraded updates skill score from an exercise.graded Kafka event.
func (s *progressService) HandleExerciseGraded(ctx context.Context, event *domain.ExerciseGradedEvent) error {
	if event.Language == "" || event.SkillTag == "" {
		return nil // insufficient info to update
	}
	userID, err := uuid.Parse(event.UserID)
	if err != nil { return nil }

	ratioScore := 0.0
	if event.MaxScore > 0 {
		ratioScore = (event.Score / event.MaxScore) * 100.0
	}
	return s.updateSkillEMA(ctx, userID, event.Language, domain.Skill(event.SkillTag), ratioScore, event.EventID)
}

// HandleLessonCompleted updates skill score from a learning.lesson.completed Kafka event.
func (s *progressService) HandleLessonCompleted(ctx context.Context, event *domain.LessonCompletedEvent) error {
	if event.Language == "" || event.SkillEmphasis == "" { return nil }
	userID, err := uuid.Parse(event.UserID)
	if err != nil { return nil }

	// Update skill EMA score
	if err := s.updateSkillEMA(ctx, userID, event.Language, domain.Skill(event.SkillEmphasis), event.Score, event.EventID); err != nil {
		return err
	}

	// C2 fix: Upsert today's activity aggregate so the heatmap stays current
	minutes := event.TimeSpentSec / 60
	if minutes < 1 && event.TimeSpentSec > 0 {
		minutes = 1 // round up sub-minute sessions
	}
	if upsertErr := s.activityRepo.Upsert(ctx, userID, minutes, event.XPEarned, 1); upsertErr != nil {
		// Non-fatal: log and continue — skill score update already succeeded
		s.log.Warn("activityRepo.Upsert failed", zap.Error(upsertErr))
	}
	return nil
}

// updateSkillEMA applies Exponential Moving Average to skill score.
// new_score = alpha * new_value + (1 - alpha) * old_score
// Upsert and history insert are wrapped in a single database transaction.
func (s *progressService) updateSkillEMA(ctx context.Context, userID uuid.UUID, language string, skill domain.Skill, newValue float64, eventRef string) error {
	existing, err := s.scoreRepo.GetSkillScore(ctx, userID, language, string(skill))

	var newScore float64
	var delta *float64
	now := time.Now().UTC()

	if err != nil { // no existing score: initialise
		newScore = newValue
	} else {
		newScore = emaAlpha*newValue + (1-emaAlpha)*existing.Score
		d := newScore - existing.Score
		delta = &d
	}

	// Clamp to [0, 100]
	newScore = math.Max(0, math.Min(100, newScore))

	sc := &domain.SkillScore{
		UserID: userID, Language: language, Skill: skill,
		Score: newScore, UpdatedAt: now,
	}
	entry := &domain.ScoreHistoryEntry{
		UserID: userID, Language: language, Skill: skill,
		Score: newScore, Delta: delta, EventRef: eventRef, RecordedAt: now,
	}

	// Atomic: upsert score + history in one transaction
	if err := s.scoreRepo.UpsertWithHistory(ctx, sc, entry); err != nil {
		s.log.Error("failed to upsert skill score with history", zap.Error(err))
		return domain.ErrInternalError
	}
	return nil
}

// scoreToBand maps a normalized 0–100 score to a certification band.
func scoreToBand(cert string, score float64) string {
	return ScoreToBandExport(cert, score)
}

// ScoreToBandExport is an exported alias for testing.
func ScoreToBandExport(cert string, score float64) string {
	switch cert {
	case "ielts":
		switch {
		case score >= 90: return "9.0"
		case score >= 85: return "8.0"
		case score >= 78: return "7.0"
		case score >= 70: return "6.5"
		case score >= 62: return "6.0"
		case score >= 55: return "5.5"
		case score >= 48: return "5.0"
		default: return "4.0"
		}
	case "toeic":
		switch {
		case score >= 90: return "900+"
		case score >= 80: return "785-900"
		case score >= 70: return "600-785"
		case score >= 55: return "405-600"
		default: return "<405"
		}
	case "jlpt":
		switch {
		case score >= 90: return "N1"
		case score >= 75: return "N2"
		case score >= 60: return "N3"
		case score >= 45: return "N4"
		default: return "N5"
		}
	default:
		return ""
	}
}

// decodeEvent is used to deserialize Kafka messages.
func decodeEvent[T any](data []byte) (T, error) {
	var v T
	err := json.Unmarshal(data, &v)
	return v, err
}
