package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/omnilingo/gamification-service/internal/domain"
	"github.com/omnilingo/gamification-service/internal/service"
	"go.uber.org/zap"
)

type GamificationHandler struct {
	svc service.GamificationService
	log *zap.Logger
}

func NewGamificationHandler(svc service.GamificationService, log *zap.Logger) *GamificationHandler {
	return &GamificationHandler{svc: svc, log: log}
}

func (h *GamificationHandler) Register(r fiber.Router) {
	v1 := r.Group("/api/v1/gamification")

	// GET /api/v1/gamification/profile
	v1.Get("/profile", h.GetProfile)

	// GET /api/v1/gamification/leaderboard/:leagueId?limit=50
	v1.Get("/leaderboard/:leagueId", h.GetLeaderboard)

	// POST /api/v1/gamification/streak/freeze
	v1.Post("/streak/freeze", h.FreezeStreak)

	// GET /api/v1/gamification/achievements
	v1.Get("/achievements", h.ListAchievements)
}

// GetProfile — GET /api/v1/gamification/profile
func (h *GamificationHandler) GetProfile(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	profile, err := h.svc.GetProfile(c.Context(), userID)
	if err != nil { return handleError(c, err) }
	return c.JSON(fiber.Map{"profile": profile})
}

// GetLeaderboard — GET /api/v1/gamification/leaderboard/:leagueId
func (h *GamificationHandler) GetLeaderboard(c *fiber.Ctx) error {
	leagueID := c.Params("leagueId")
	limit := 50
	if l := c.QueryInt("limit", 50); l > 0 && l <= 100 { limit = l }

	entries, err := h.svc.GetLeaderboard(c.Context(), leagueID, limit)
	if err != nil { return handleError(c, err) }
	return c.JSON(fiber.Map{"leaderboard": entries, "league": leagueID})
}

// FreezeStreak — POST /api/v1/gamification/streak/freeze
func (h *GamificationHandler) FreezeStreak(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	if err := h.svc.FreezeStreak(c.Context(), userID); err != nil {
		return handleError(c, err)
	}
	return c.JSON(fiber.Map{"message": "streak frozen successfully"})
}

// ListAchievements — GET /api/v1/gamification/achievements
func (h *GamificationHandler) ListAchievements(c *fiber.Ctx) error {
	achs, err := h.svc.ListAchievements(c.Context())
	if err != nil { return handleError(c, err) }
	return c.JSON(fiber.Map{"achievements": achs})
}

func handleError(c *fiber.Ctx, err error) error {
	if de, ok := err.(*domain.DomainError); ok {
		return c.Status(de.StatusCode).JSON(fiber.Map{"error": de.Code, "message": de.Message})
	}
	return c.Status(500).JSON(fiber.Map{"error": "INTERNAL_ERROR", "message": "internal server error"})
}
