package service

import (
	"context"
	"math"
	"time"

	"github.com/google/uuid"
	"github.com/omnilingo/learning-service/internal/client"
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
	GetTodayMission(ctx context.Context, userID uuid.UUID) (*domain.TodayMission, error)

	// T3 — Onboarding state machine
	GetOnboardingState(ctx context.Context, userID uuid.UUID) (*domain.OnboardingState, error)
	UpdateOnboardingStep(ctx context.Context, userID uuid.UUID, step domain.OnboardingStep, answers map[string]any) error
	CompleteOnboarding(ctx context.Context, userID uuid.UUID, cefr, trackID *string) error
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
	profileRepo    repository.ProfileRepository
	pathRepo       repository.PathRepository
	attemptRepo    repository.AttemptRepository
	onboardingRepo repository.OnboardingRepository
	publisher      messaging.Publisher
	outbox         *messaging.OutboxRepository
	contentClient  client.ContentClient
	log            *zap.Logger
}

func NewLearningService(
	profileRepo repository.ProfileRepository,
	pathRepo repository.PathRepository,
	attemptRepo repository.AttemptRepository,
	onboardingRepo repository.OnboardingRepository,
	publisher messaging.Publisher,
	outboxRepo *messaging.OutboxRepository,
	contentClient client.ContentClient,
	log *zap.Logger,
) LearningService {
	return &learningService{
		profileRepo: profileRepo, pathRepo: pathRepo, attemptRepo: attemptRepo,
		onboardingRepo: onboardingRepo, publisher: publisher, outbox: outboxRepo,
		contentClient: contentClient, log: log,
	}
}

func (s *learningService) GetProfile(ctx context.Context, userID uuid.UUID) (*domain.LearningProfile, error) {
	return s.profileRepo.Get(ctx, userID)
}

func (s *learningService) SetProfile(ctx context.Context, p *domain.LearningProfile) error {
	if p.PrimaryLanguage == "" {
		return domain.Errorf("BAD_REQUEST", "primary_language is required")
	}
	if p.DailyGoalMinutes == 0 { p.DailyGoalMinutes = 10 }
	if p.LearningLanguages == nil { p.LearningLanguages = []string{} }
	return s.profileRepo.Upsert(ctx, p)
}

func (s *learningService) SetGoals(ctx context.Context, userID uuid.UUID, goals []domain.Goal) error {
	profile, err := s.profileRepo.Get(ctx, userID)
	if err != nil {
		// Auto-create minimal profile if not exists
		profile = &domain.LearningProfile{
			UserID: userID, PrimaryLanguage: "en",
			DailyGoalMinutes: 10, LearningLanguages: []string{},
		}
	}
	profile.Goals = goals
	if err := s.profileRepo.Upsert(ctx, profile); err != nil { return domain.ErrInternalError }

	event := domain.GoalSetEvent{
		EventID: uuid.New().String(), UserID: userID.String(),
		Goals: goals, CreatedAt: time.Now().UTC(),
	}
	if err := s.outbox.Enqueue(ctx, domain.TopicGoalSet, event); err != nil {
		s.log.Warn("outbox insert goal.set failed", zap.Error(err))
	}
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

	// Outbox: durable Kafka event
	event := domain.LessonStartedEvent{
		EventID: uuid.New().String(), UserID: userID.String(),
		LessonID: lessonID, Language: opts.Language, CreatedAt: time.Now().UTC(),
	}
	if err := s.outbox.Enqueue(ctx, domain.TopicLessonStarted, event); err != nil {
		s.log.Warn("outbox insert lesson.started failed", zap.Error(err))
	}
	return attempt, nil
}

func (s *learningService) CompleteLesson(ctx context.Context, req CompleteRequest) (*domain.LessonAttempt, error) {
	xp := xpForLesson(req.Score)
	attempt, err := s.attemptRepo.Complete(ctx, req.AttemptID, req.Score, xp, req.TimeSpentSec)
	if err != nil { return nil, domain.ErrNotFound }

	// Outbox: durable Kafka event
	event := domain.LessonCompletedEvent{
		EventID: uuid.New().String(), UserID: req.UserID.String(),
		LessonID: attempt.LessonID, Language: req.Language,
		Score: req.Score, XPEarned: xp, TimeSpentSec: req.TimeSpentSec,
		SkillEmphasis: req.SkillTag, CreatedAt: time.Now().UTC(),
	}
	if err := s.outbox.Enqueue(ctx, domain.TopicLessonCompleted, event); err != nil {
		s.log.Warn("outbox insert lesson.completed failed", zap.Error(err))
	}
	return attempt, nil
}

func (s *learningService) GetHistory(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.LessonAttempt, int, error) {
	if limit <= 0 || limit > 100 { limit = 20 }
	return s.attemptRepo.ListByUser(ctx, userID, limit, offset)
}

// GetTodayMission assembles the user's daily mission widget data.
func (s *learningService) GetTodayMission(ctx context.Context, userID uuid.UUID) (*domain.TodayMission, error) {
	mission := &domain.TodayMission{
		MinutesToGoal: 15, // default daily goal
		XPReward:      50,
		DueCardCount:  0,
	}

	// Attempt to pull active learning paths
	paths, err := s.ListPaths(ctx, userID)
	if err != nil || len(paths) == 0 {
		return mission, nil // no active path — return stub
	}

	activePath := paths[0]
	// TodayMission does not have a Language field, we just omit assigning it
	
	unitID := activePath.CurrentUnitID
	if unitID == "" || s.contentClient == nil {
		return mission, nil // No active unit or client uninitialized
	}

	// Fetch lessons for the active unit from content-service
	lessons, err := s.contentClient.GetUnitLessons(ctx, unitID)
	if err != nil {
		s.log.Warn("failed to fetch unit lessons", zap.Error(err), zap.String("unitId", unitID))
		return mission, nil
	}

	// Fetch completed lessons for the user
	attempts, _, err := s.attemptRepo.ListByUser(ctx, userID, 100, 0)
	completedLessonIDs := make(map[string]bool)
	if err == nil {
		for _, a := range attempts {
			if a.CompletedAt != nil {
				completedLessonIDs[a.LessonID] = true
			}
		}
	}

	// Find the first non-completed lesson
	for _, l := range lessons {
		if !completedLessonIDs[l.ID] {
			copiedID := l.ID
			mission.LessonID = &copiedID
			// Resolve title intelligently
			title := l.Title["en"]
			if t, ok := l.Title["vi"]; ok { title = t }
			mission.LessonTitle = &title
			break
		}
	}

	return mission, nil
}

// ─── T3: Onboarding ───────────────────────────────────────────────────────────

func (s *learningService) GetOnboardingState(ctx context.Context, userID uuid.UUID) (*domain.OnboardingState, error) {
	return s.onboardingRepo.GetState(ctx, userID)
}

func (s *learningService) UpdateOnboardingStep(ctx context.Context, userID uuid.UUID, step domain.OnboardingStep, answers map[string]any) error {
	// Validate step
	switch step {
	case domain.StepLanguageSelect, domain.StepGoalSelect, domain.StepLevelSelect, domain.StepPlacement, domain.StepDone:
	default:
		return domain.Errorf("BAD_REQUEST", "invalid onboarding step: %s", step)
	}
	return s.onboardingRepo.UpsertStep(ctx, userID, step, answers)
}

func (s *learningService) CompleteOnboarding(ctx context.Context, userID uuid.UUID, cefr, trackID *string) error {
	if err := s.onboardingRepo.Complete(ctx, userID, cefr, trackID); err != nil {
		return err
	}
	// Auto-enroll track if a recommendation is provided
	if trackID != nil && *trackID != "" {
		state, _ := s.onboardingRepo.GetState(ctx, userID) // re-read to get primary_language
		lang := "en"
		if state != nil {
			if v, ok := state.Answers["target_language"].(string); ok && v != "" {
				lang = v
			}
		}
		_, _ = s.CreatePath(ctx, userID, lang, *trackID)
	}
	return nil
}
