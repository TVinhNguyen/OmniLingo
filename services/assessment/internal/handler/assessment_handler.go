package handler

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/omnilingo/assessment-service/internal/domain"
	"github.com/omnilingo/assessment-service/internal/metrics"
	"github.com/omnilingo/assessment-service/internal/service"
	"github.com/prometheus/client_golang/prometheus"
	"go.uber.org/zap"
)

type AssessmentHandler struct {
	svc service.AssessmentService
	log *zap.Logger
}

func NewAssessmentHandler(svc service.AssessmentService, log *zap.Logger) *AssessmentHandler {
	return &AssessmentHandler{svc: svc, log: log}
}

func (h *AssessmentHandler) Register(router fiber.Router) {
	v1 := router.Group("/api/v1/assessments")

	// Exercise submission
	v1.Post("/exercises/:id/submit", h.SubmitExercise)
	v1.Get("/submissions", h.ListSubmissions)

	// Mock test lifecycle
	v1.Post("/tests/:id/start", h.StartTest)
	v1.Post("/tests/:sessionId/submit", h.SubmitTest)
	v1.Get("/tests/:sessionId/result", h.GetTestResult)
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

// SubmitExercise godoc
// POST /api/v1/assessments/exercises/:id/submit
func (h *AssessmentHandler) SubmitExercise(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)

	var body struct {
		ExerciseType  domain.ExerciseType `json:"exercise_type"`
		Answer        any                 `json:"answer"`
		CorrectAnswer any                 `json:"correct_answer,omitempty"`
		MaxScore      float64             `json:"max_score"`
		SkillTag      string              `json:"skill_tag"`
		Language      string              `json:"language"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "invalid request body"})
	}
	if body.ExerciseType == "" {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "exercise_type required"})
	}

	timer := prometheus.NewTimer(metrics.GradingDuration)
	defer timer.ObserveDuration()
	sub, err := h.svc.SubmitExercise(c.Context(), service.SubmitExerciseRequest{
		UserID:        userID,
		ExerciseID:    c.Params("id"),
		ExerciseType:  body.ExerciseType,
		Answer:        body.Answer,
		CorrectAnswer: body.CorrectAnswer,
		MaxScore:      body.MaxScore,
		SkillTag:      body.SkillTag,
		Language:      body.Language,
	})

	if err != nil {
		return handleError(c, err)
	}

	correct := "false"
	if sub.Result != nil && sub.Result.Correct { correct = "true" }
	metrics.ExercisesGraded.WithLabelValues(string(body.ExerciseType), correct).Inc()

	return c.Status(201).JSON(fiber.Map{"submission": sub})
}

// ListSubmissions godoc — GET /api/v1/assessments/submissions
func (h *AssessmentHandler) ListSubmissions(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	limit  := parseIntQuery(c, "limit", 20, 1, 100)
	offset := parseIntQuery(c, "offset", 0, 0, 10000)

	subs, total, err := h.svc.ListSubmissions(c.Context(), userID, limit, offset)
	if err != nil {
		return handleError(c, err)
	}
	return c.JSON(fiber.Map{
		"submissions": subs,
		"meta": fiber.Map{"total": total, "limit": limit, "offset": offset},
	})
}

// StartTest godoc — POST /api/v1/assessments/tests/:id/start
func (h *AssessmentHandler) StartTest(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	testID := c.Params("id")
	session, err := h.svc.StartTest(c.Context(), userID, testID)
	if err != nil {
		return handleError(c, err)
	}
	return c.Status(201).JSON(fiber.Map{"session": session})
}

// SubmitTest godoc — POST /api/v1/assessments/tests/:sessionId/submit
func (h *AssessmentHandler) SubmitTest(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	sessionID, err := uuid.Parse(c.Params("sessionId"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "invalid session id"})
	}

	var body struct {
		Answers map[string]any `json:"answers"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "invalid request body"})
	}

	session, err := h.svc.SubmitTest(c.Context(), service.SubmitTestRequest{
		UserID: userID, SessionID: sessionID, Answers: body.Answers,
	})
	if err != nil {
		return handleError(c, err)
	}
	metrics.TestsCompleted.Inc()
	return c.JSON(fiber.Map{"session": session})
}

// GetTestResult godoc — GET /api/v1/assessments/tests/:sessionId/result
func (h *AssessmentHandler) GetTestResult(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	sessionID, err := uuid.Parse(c.Params("sessionId"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "invalid session id"})
	}
	session, err := h.svc.GetTestResult(c.Context(), sessionID, userID)
	if err != nil {
		return handleError(c, err)
	}
	return c.JSON(fiber.Map{"session": session})
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

func handleError(c *fiber.Ctx, err error) error {
	if de, ok := err.(*domain.DomainError); ok {
		return c.Status(de.StatusCode).JSON(fiber.Map{"error": de.Code, "message": de.Message})
	}
	return c.Status(500).JSON(fiber.Map{"error": "INTERNAL_ERROR", "message": "internal server error"})
}

func parseIntQuery(c *fiber.Ctx, key string, def, min, max int) int {
	v, err := strconv.Atoi(c.Query(key, strconv.Itoa(def)))
	if err != nil || v < min {
		return min
	}
	if v > max {
		return max
	}
	return v
}
