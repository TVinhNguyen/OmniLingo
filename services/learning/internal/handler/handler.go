package handler

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/omnilingo/learning-service/internal/domain"
	"github.com/omnilingo/learning-service/internal/service"
	"go.uber.org/zap"
)

type LearningHandler struct {
	svc service.LearningService
	log *zap.Logger
}

func New(svc service.LearningService, log *zap.Logger) *LearningHandler {
	return &LearningHandler{svc: svc, log: log}
}

func (h *LearningHandler) Register(r fiber.Router) {
	v1 := r.Group("/api/v1/learning")

	// Profile & goals
	v1.Get("/profile", h.GetProfile)
	v1.Put("/profile", h.SetProfile)
	v1.Post("/goals", h.SetGoals)

	// Paths
	v1.Get("/paths", h.ListPaths)
	v1.Post("/paths", h.CreatePath)

	// Lesson lifecycle
	v1.Post("/lessons/:id/start", h.StartLesson)
	v1.Post("/lessons/:id/complete", h.CompleteLesson)
	v1.Get("/history", h.GetHistory)

	// GET /api/v1/learning/today-mission
	v1.Get("/today-mission", h.GetTodayMission)

	// T3: Onboarding state machine
	onb := r.Group("/api/v1/onboarding")
	onb.Get("/state", h.GetOnboardingState)
	onb.Post("/step", h.UpdateOnboardingStep)
	onb.Post("/complete", h.CompleteOnboarding)
}

func (h *LearningHandler) GetProfile(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	p, err := h.svc.GetProfile(c.Context(), userID)
	if err != nil { return handleError(c, err) }
	return c.JSON(fiber.Map{"profile": p})
}

func (h *LearningHandler) SetProfile(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	var body domain.LearningProfile
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "invalid body"})
	}
	body.UserID = userID
	if err := h.svc.SetProfile(c.Context(), &body); err != nil { return handleError(c, err) }
	return c.Status(200).JSON(fiber.Map{"message": "profile updated"})
}

func (h *LearningHandler) SetGoals(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	var body struct{ Goals []domain.Goal `json:"goals"` }
	if err := c.BodyParser(&body); err != nil || body.Goals == nil {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "goals array required"})
	}
	if err := h.svc.SetGoals(c.Context(), userID, body.Goals); err != nil { return handleError(c, err) }
	return c.JSON(fiber.Map{"message": "goals updated", "count": len(body.Goals)})
}

func (h *LearningHandler) ListPaths(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	paths, err := h.svc.ListPaths(c.Context(), userID)
	if err != nil { return handleError(c, err) }
	if paths == nil { paths = []*domain.LearningPath{} }
	return c.JSON(fiber.Map{"paths": paths})
}

func (h *LearningHandler) CreatePath(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	var body struct {
		Language       string `json:"language"`
		PathTemplateID string `json:"path_template_id"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "invalid body"})
	}
	path, err := h.svc.CreatePath(c.Context(), userID, body.Language, body.PathTemplateID)
	if err != nil { return handleError(c, err) }
	return c.Status(201).JSON(fiber.Map{"path": path})
}

func (h *LearningHandler) StartLesson(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	lessonID := c.Params("id")
	var body struct {
		Language      string `json:"language"`
		LessonVersion int    `json:"lesson_version"`
	}
	_ = c.BodyParser(&body)
	attempt, err := h.svc.StartLesson(c.Context(), userID, lessonID, service.StartOpts{
		LessonVersion: body.LessonVersion, Language: body.Language,
	})
	if err != nil { return handleError(c, err) }
	return c.Status(201).JSON(fiber.Map{"attempt": attempt})
}

func (h *LearningHandler) CompleteLesson(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	var body struct {
		AttemptID    int64   `json:"attempt_id"`
		Score        float64 `json:"score"`
		TimeSpentSec int     `json:"time_spent_sec"`
		Language     string  `json:"language"`
		SkillTag     string  `json:"skill_tag"`
	}
	if err := c.BodyParser(&body); err != nil || body.AttemptID == 0 {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "attempt_id required"})
	}
	attempt, err := h.svc.CompleteLesson(c.Context(), service.CompleteRequest{
		UserID: userID, AttemptID: body.AttemptID,
		Score: body.Score, TimeSpentSec: body.TimeSpentSec,
		Language: body.Language, SkillTag: body.SkillTag,
	})
	if err != nil { return handleError(c, err) }
	return c.JSON(fiber.Map{"attempt": attempt})
}

func (h *LearningHandler) GetHistory(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	limit  := clamp(c.QueryInt("limit", 20), 1, 100)
	offset := max0(c.QueryInt("offset", 0))
	list, total, err := h.svc.GetHistory(c.Context(), userID, limit, offset)
	if err != nil { return handleError(c, err) }
	if list == nil { list = []*domain.LessonAttempt{} }
	return c.JSON(fiber.Map{
		"history": list,
		"meta": fiber.Map{"total": total, "limit": limit, "offset": offset},
	})
}

// GetTodayMission — GET /api/v1/learning/today-mission
// Returns: next lesson in active path + minutes remaining to daily goal + due SRS card count.
func (h *LearningHandler) GetTodayMission(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	mission, err := h.svc.GetTodayMission(c.Context(), userID)
	if err != nil { return handleError(c, err) }
	return c.JSON(fiber.Map{"mission": mission})
}

func handleError(c *fiber.Ctx, err error) error {
	if de, ok := err.(*domain.DomainError); ok {
		return c.Status(de.StatusCode).JSON(fiber.Map{"error": de.Code, "message": de.Message})
	}
	return c.Status(500).JSON(fiber.Map{"error": "INTERNAL_ERROR", "message": "internal server error"})
}

func clamp(v, lo, hi int) int {
	if v < lo { return lo }
	if v > hi { return hi }
	return v
}
func max0(v int) int {
	if v < 0 { return 0 }
	return v
}

var _ = strconv.Itoa // suppress unused import warning

// ─── T3: Onboarding handlers ──────────────────────────────────────────────────

// GetOnboardingState — GET /api/v1/onboarding/state
func (h *LearningHandler) GetOnboardingState(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	state, err := h.svc.GetOnboardingState(c.Context(), userID)
	if err != nil { return handleError(c, err) }
	return c.JSON(fiber.Map{"state": state})
}

// UpdateOnboardingStep — POST /api/v1/onboarding/step
// Body: { "step": "goal_select", "data": { "goal": "cert_ielts" } }
func (h *LearningHandler) UpdateOnboardingStep(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	var body struct {
		Step domain.OnboardingStep `json:"step"`
		Data map[string]any        `json:"data"`
	}
	if err := c.BodyParser(&body); err != nil || body.Step == "" {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "step and data required"})
	}
	if err := h.svc.UpdateOnboardingStep(c.Context(), userID, body.Step, body.Data); err != nil {
		return handleError(c, err)
	}
	state, _ := h.svc.GetOnboardingState(c.Context(), userID)
	return c.JSON(fiber.Map{"state": state})
}

// CompleteOnboarding — POST /api/v1/onboarding/complete
// Body: { "placementCefr": "B1", "recommendedTrackId": "en-vi-b1-track" }
func (h *LearningHandler) CompleteOnboarding(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	var body struct {
		PlacementCefr      *string `json:"placementCefr"`
		RecommendedTrackId *string `json:"recommendedTrackId"`
	}
	_ = c.BodyParser(&body) // both fields are optional
	if err := h.svc.CompleteOnboarding(c.Context(), userID, body.PlacementCefr, body.RecommendedTrackId); err != nil {
		return handleError(c, err)
	}
	state, _ := h.svc.GetOnboardingState(c.Context(), userID)
	return c.JSON(fiber.Map{"state": state})
}
