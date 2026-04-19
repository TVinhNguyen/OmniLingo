package service

import (
	"context"
	"encoding/json"
	"math"
	"time"

	"github.com/google/uuid"
	"github.com/omnilingo/learning-service/internal/domain"
	"github.com/omnilingo/learning-service/internal/messaging"
	"github.com/omnilingo/learning-service/internal/repository"
	"go.uber.org/zap"
)

// xpForLesson computes XP earned from a lesson score (0–100 normalized).
func xpForLesson(score float64) int {
	base := 20.0
	bonus := math.Round(score * 0.3) // up to +30 XP for perfect score
	return int(base + bonus)
}

// LearningService orchestrates lesson flow and user learning profiles.
type LearningService interface {
	GetProfile(ctx context.Context, userID uuid.UUID) (*domain.LearningProfile, error)
	SetProfile(ctx context.Context, profile *domain.LearningProfile) error
	SetGoals(ctx context.Context, userID uuid.UUID, goals []domain.Goal) error

	ListPaths(ctx context.Context, userID uuid.UUID) ([]*domain.LearningPath, error)
	CreatePath(ctx context.Context, userID uuid.UUID, language, templateID string) (*domain.LearningPath, error)

	StartLesson(ctx context.Context, userID uuid.UUID, lessonID string, opts StartOpts) (*domain.LessonAttempt, error)
	CompleteLesson(ctx context.Context, req CompleteRequest) (*domain.LessonAttempt, error)
	GetHistory(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.LessonAttempt, int, error)
}

type StartOpts struct {
	LessonVersion int
	PathID        *uuid.UUID
	Language      string
}

type CompleteRequest struct {
	UserID       uuid.UUID
	AttemptID    int64
	Score        float64 // 0-100
	TimeSpentSec int
	Language     string
	SkillTag     string
}

type learningService struct {
	profileRepo  repository.ProfileRepository
	pathRepo     repository.PathRepository
	attemptRepo  repository.AttemptRepository
	publisher    messaging.Publisher
	log          *zap.Logger
}

func NewLearningService(
	profileRepo repository.ProfileRepository,
	pathRepo repository.PathRepository,
	attemptRepo repository.AttemptRepository,
	publisher messaging.Publisher,
	log *zap.Logger,
) LearningService {
	return &learningService{
		profileRepo: profileRepo, pathRepo: pathRepo, attemptRepo: attemptRepo,
		publisher: publisher, log: log,
	}
}

func (s *learningService) GetProfile(ctx context.Context, userID uuid.UUID) (*domain.LearningProfile, error) {
	return s.profileRepo.Get(ctx, userID)
}

func (s *learningService) SetProfile(ctx context.Context, p *domain.LearningProfile) error {
	if p.PrimaryLanguage == "" {
		return domain.Errorf("BAD_REQUEST", "primary_language is required")
	}
	if p.Preferences.DailyGoalMinutes == 0 { p.Preferences.DailyGoalMinutes = 15 }
	return s.profileRepo.Upsert(ctx, p)
}

func (s *learningService) SetGoals(ctx context.Context, userID uuid.UUID, goals []domain.Goal) error {
	profile, err := s.profileRepo.Get(ctx, userID)
	if err != nil {
		// Auto-create minimal profile if not exists
		profile = &domain.LearningProfile{
			UserID: userID, PrimaryLanguage: "en",
			Preferences: domain.Prefs{DailyGoalMinutes: 15},
		}
	}
	profile.Goals = goals
	if err := s.profileRepo.Upsert(ctx, profile); err != nil { return domain.ErrInternalError }

	event := domain.GoalSetEvent{
		EventID: uuid.New().String(), UserID: userID.String(),
		Goals: goals, CreatedAt: time.Now().UTC(),
	}
	payload, _ := json.Marshal(event)
	go func() {
		if err := s.publisher.Publish(context.Background(), "learning.goal.set", payload); err != nil {
			s.log.Warn("failed to publish goal.set", zap.Error(err))
		}
	}()
	return nil
}

func (s *learningService) ListPaths(ctx context.Context, userID uuid.UUID) ([]*domain.LearningPath, error) {
	return s.pathRepo.List(ctx, userID)
}

func (s *learningService) CreatePath(ctx context.Context, userID uuid.UUID, language, templateID string) (*domain.LearningPath, error) {
	if language == "" || templateID == "" {
		return nil, domain.Errorf("BAD_REQUEST", "language and path_template_id required")
	}
	path := &domain.LearningPath{
		ID: uuid.New(), UserID: userID, Language: language,
		PathTemplateID: templateID, ProgressPct: 0,
	}
	if err := s.pathRepo.Create(ctx, path); err != nil { return nil, domain.ErrInternalError }
	return path, nil
}

func (s *learningService) StartLesson(ctx context.Context, userID uuid.UUID, lessonID string, opts StartOpts) (*domain.LessonAttempt, error) {
	// Idempotent: reuse existing active attempt
	if existing, err := s.attemptRepo.GetActive(ctx, userID, lessonID); err == nil {
		return existing, nil
	}
	ver := opts.LessonVersion
	if ver <= 0 { ver = 1 }
	attempt := &domain.LessonAttempt{
		UserID: userID, LessonID: lessonID,
		LessonVersion: ver, PathID: opts.PathID, StartedAt: time.Now().UTC(),
	}
	if err := s.attemptRepo.Create(ctx, attempt); err != nil { return nil, domain.ErrInternalError }

	// Publish started event
	event := domain.LessonStartedEvent{
		EventID: uuid.New().String(), UserID: userID.String(),
		LessonID: lessonID, Language: opts.Language, CreatedAt: time.Now().UTC(),
	}
	payload, _ := json.Marshal(event)
	go func() {
		if err := s.publisher.Publish(context.Background(), "learning.lesson.started", payload); err != nil {
			s.log.Warn("publish lesson.started failed", zap.Error(err))
		}
	}()
	return attempt, nil
}

func (s *learningService) CompleteLesson(ctx context.Context, req CompleteRequest) (*domain.LessonAttempt, error) {
	xp := xpForLesson(req.Score)
	attempt, err := s.attemptRepo.Complete(ctx, req.AttemptID, req.Score, xp, req.TimeSpentSec)
	if err != nil { return nil, domain.ErrNotFound }

	// Publish completed event
	event := domain.LessonCompletedEvent{
		EventID: uuid.New().String(), UserID: req.UserID.String(),
		LessonID: attempt.LessonID, Language: req.Language,
		Score: req.Score, XPEarned: xp, TimeSpentSec: req.TimeSpentSec,
		SkillEmphasis: req.SkillTag, CreatedAt: time.Now().UTC(),
	}
	payload, _ := json.Marshal(event)
	go func() {
		if err := s.publisher.Publish(context.Background(), "learning.lesson.completed", payload); err != nil {
			s.log.Warn("publish lesson.completed failed", zap.Error(err))
		}
	}()
	return attempt, nil
}

func (s *learningService) GetHistory(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.LessonAttempt, int, error) {
	if limit <= 0 || limit > 100 { limit = 20 }
	return s.attemptRepo.ListByUser(ctx, userID, limit, offset)
}
