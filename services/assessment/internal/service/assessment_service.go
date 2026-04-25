package service

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/omnilingo/assessment-service/internal/domain"
	"github.com/omnilingo/assessment-service/internal/messaging"
	"github.com/omnilingo/assessment-service/internal/repository"
	"go.uber.org/zap"
)

// AssessmentService handles exercise and test submissions.
type AssessmentService interface {
	SubmitExercise(ctx context.Context, req SubmitExerciseRequest) (*domain.Submission, error)
	StartTest(ctx context.Context, userID uuid.UUID, testID string) (*domain.TestSession, error)
	SubmitTest(ctx context.Context, req SubmitTestRequest) (*domain.TestSession, error)
	GetTestResult(ctx context.Context, sessionID, userID uuid.UUID) (*domain.TestSession, error)
	ListSubmissions(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.Submission, int, error)
}

type SubmitExerciseRequest struct {
	UserID       uuid.UUID            `json:"user_id"`
	ExerciseID   string               `json:"exercise_id"`
	ExerciseType domain.ExerciseType  `json:"exercise_type"`
	Answer       any                  `json:"answer"`
	CorrectAnswer any                 `json:"-"` // populated from content-service or inline
	MaxScore     float64              `json:"max_score"`
	SkillTag     string               `json:"skill_tag"`
	Language     string               `json:"language"`
}

type SubmitTestRequest struct {
	UserID    uuid.UUID      `json:"user_id"`
	SessionID uuid.UUID      `json:"session_id"`
	Answers   map[string]any `json:"answers"` // question_id → answer
}

type assessmentService struct {
	subRepo     repository.SubmissionRepository
	testRepo    repository.TestSessionRepository
	outbox      *messaging.OutboxRepository
	log         *zap.Logger
}

func NewAssessmentService(
	subRepo repository.SubmissionRepository,
	testRepo repository.TestSessionRepository,
	outbox *messaging.OutboxRepository,
	log *zap.Logger,
) AssessmentService {
	return &assessmentService{
		subRepo:  subRepo,
		testRepo: testRepo,
		outbox:   outbox,
		log:      log,
	}
}

func (s *assessmentService) SubmitExercise(ctx context.Context, req SubmitExerciseRequest) (*domain.Submission, error) {
	now := time.Now().UTC()
	sub := &domain.Submission{
		ID:           uuid.New(),
		UserID:       req.UserID,
		ExerciseID:   req.ExerciseID,
		ExerciseType: req.ExerciseType,
		Answer:       req.Answer,
		SkillTag:     req.SkillTag,
		Language:     req.Language,
		SubmittedAt:  now,
	}

	maxScore := req.MaxScore
	if maxScore <= 0 {
		maxScore = 1.0
	}

	// Auto-grade where possible
	result := Grade(req.ExerciseType, req.Answer, req.CorrectAnswer, maxScore)
	gradedAt := time.Now().UTC()
	sub.Result = result
	sub.GradedAt = &gradedAt

	if err := s.subRepo.Save(ctx, sub); err != nil {
		s.log.Error("failed to save submission", zap.Error(err))
		return nil, domain.ErrInternalError
	}

	// Publish event (fire-and-forget outbox enqueue)
	event := domain.NewExerciseGradedEvent(sub)
	if err := s.outbox.Enqueue(ctx, "assessment.exercise.graded", event); err != nil {
		s.log.Warn("failed to enqueue exercise graded event", zap.Error(err))
	}

	return sub, nil
}

func (s *assessmentService) StartTest(ctx context.Context, userID uuid.UUID, testID string) (*domain.TestSession, error) {
	session := &domain.TestSession{
		ID:        uuid.New(),
		UserID:    userID,
		TestID:    testID,
		Status:    domain.TestStatusStarted,
		Answers:   make(map[string]any),
		StartedAt: time.Now().UTC(),
	}
	if err := s.testRepo.Create(ctx, session); err != nil {
		return nil, domain.ErrInternalError
	}
	return session, nil
}

func (s *assessmentService) SubmitTest(ctx context.Context, req SubmitTestRequest) (*domain.TestSession, error) {
	session, err := s.testRepo.FindByID(ctx, req.SessionID)
	if err != nil {
		return nil, domain.ErrNotFound
	}
	if session.UserID != req.UserID {
		return nil, domain.ErrForbidden
	}
	if session.Status == domain.TestStatusCompleted {
		return nil, domain.Errorf("ALREADY_COMPLETED", "test session already completed")
	}

	session.Answers = req.Answers
	session.Status = domain.TestStatusCompleted
	now := time.Now().UTC()
	session.CompletedAt = &now

	// Placeholder scoring — real scoring requires answer key from question bank
	totalScore := 0.0
	session.TotalScore = &totalScore
	session.SkillScores = map[string]float64{}

	if err := s.testRepo.Update(ctx, session); err != nil {
		return nil, domain.ErrInternalError
	}

	// Publish test completed event to outbox
	event := domain.TestCompletedEvent{
		EventID:     uuid.New().String(),
		UserID:      session.UserID.String(),
		SessionID:   session.ID.String(),
		TestID:      session.TestID,
		TotalScore:  totalScore,
		SkillScores: session.SkillScores,
		CreatedAt:   time.Now().UTC(),
	}
	if err := s.outbox.Enqueue(ctx, "assessment.test.completed", event); err != nil {
		s.log.Warn("failed to enqueue test completed event", zap.Error(err))
	}

	return session, nil
}

func (s *assessmentService) GetTestResult(ctx context.Context, sessionID, userID uuid.UUID) (*domain.TestSession, error) {
	session, err := s.testRepo.FindByID(ctx, sessionID)
	if err != nil {
		return nil, domain.ErrNotFound
	}
	if session.UserID != userID {
		return nil, domain.ErrForbidden
	}
	return session, nil
}

func (s *assessmentService) ListSubmissions(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.Submission, int, error) {
	return s.subRepo.ListByUser(ctx, userID, limit, offset)
}
