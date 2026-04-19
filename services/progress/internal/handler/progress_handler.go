package handler

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/omnilingo/progress-service/internal/domain"
	"github.com/omnilingo/progress-service/internal/service"
	"go.uber.org/zap"
)

type ProgressHandler struct {
	svc service.ProgressService
	log *zap.Logger
}

func NewProgressHandler(svc service.ProgressService, log *zap.Logger) *ProgressHandler {
	return &ProgressHandler{svc: svc, log: log}
}

func (h *ProgressHandler) Register(router fiber.Router) {
	v1 := router.Group("/api/v1/progress")

	// GET /api/v1/progress/overview?language=ja
	v1.Get("/overview", h.GetOverview)

	// GET /api/v1/progress/skills?language=ja&skill=listening
	v1.Get("/skills", h.GetSkill)

	// GET /api/v1/progress/history?language=ja&skill=listening&days=30
	v1.Get("/history", h.GetHistory)

	// GET /api/v1/progress/predicted-score?cert=ielts
	v1.Get("/predicted-score", h.GetPredictedScore)
}

// GetOverview — GET /api/v1/progress/overview?language=ja
func (h *ProgressHandler) GetOverview(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	language := c.Query("language")
	if language == "" {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "language query param required"})
	}
	overview, err := h.svc.GetOverview(c.Context(), userID, language)
	if err != nil {
		return handleError(c, err)
	}
	return c.JSON(fiber.Map{"overview": overview})
}

// GetSkill — GET /api/v1/progress/skills?language=ja&skill=listening
func (h *ProgressHandler) GetSkill(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	language := c.Query("language")
	skill := c.Query("skill")
	if language == "" || skill == "" {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "language and skill required"})
	}
	overview, err := h.svc.GetOverview(c.Context(), userID, language)
	if err != nil {
		return handleError(c, err)
	}
	sc, ok := overview.Skills[skill]
	if !ok {
		return c.Status(404).JSON(fiber.Map{"error": "NOT_FOUND", "message": "no score recorded yet"})
	}
	return c.JSON(fiber.Map{"skill": sc})
}

// GetHistory — GET /api/v1/progress/history?language=ja&skill=listening&days=30
func (h *ProgressHandler) GetHistory(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	language := c.Query("language")
	skill := c.Query("skill")
	days, _ := strconv.Atoi(c.Query("days", "30"))
	if language == "" || skill == "" {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "language and skill required"})
	}
	history, err := h.svc.GetSkillHistory(c.Context(), userID, language, skill, days)
	if err != nil {
		return handleError(c, err)
	}
	if history == nil { history = []*domain.ScoreHistoryEntry{} }
	return c.JSON(fiber.Map{"history": history, "language": language, "skill": skill})
}

// GetPredictedScore — GET /api/v1/progress/predicted-score?cert=ielts
func (h *ProgressHandler) GetPredictedScore(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	cert := c.Query("cert")
	if cert == "" {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "cert query param required (ielts|toeic|jlpt|hsk)"})
	}
	pred, err := h.svc.GetPredictedScore(c.Context(), userID, cert)
	if err != nil {
		return handleError(c, err)
	}
	return c.JSON(fiber.Map{"prediction": pred})
}

func handleError(c *fiber.Ctx, err error) error {
	if de, ok := err.(*domain.DomainError); ok {
		return c.Status(de.StatusCode).JSON(fiber.Map{"error": de.Code, "message": de.Message})
	}
	return c.Status(500).JSON(fiber.Map{"error": "INTERNAL_ERROR", "message": "internal server error"})
}
