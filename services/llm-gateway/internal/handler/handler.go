package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/omnilingo/llm-gateway/internal/domain"
	"github.com/omnilingo/llm-gateway/internal/middleware"
	"github.com/omnilingo/llm-gateway/internal/service"
	"go.uber.org/zap"
)

// CompletionHandler handles POST /api/v1/completions
type CompletionHandler struct {
	svc service.GatewayService
	log *zap.Logger
}

func NewCompletionHandler(svc service.GatewayService, log *zap.Logger) *CompletionHandler {
	return &CompletionHandler{svc: svc, log: log}
}

func (h *CompletionHandler) RegisterRoutes(r fiber.Router, auth *middleware.JWKSAuth) {
	g := r.Group("/completions", auth.Handler())
	g.Post("/", h.Complete)
	g.Get("/budget", h.GetBudget)
}

type completionReq struct {
	Messages       []domain.Message `json:"messages"`
	PreferredModel string           `json:"preferred_model"`
	MaxTokens      int              `json:"max_tokens"`
	Temperature    float64          `json:"temperature"`
	CallerService  string           `json:"caller_service"`
	UseCache       bool             `json:"use_cache"`
}

// Complete godoc
// POST /api/v1/completions
// Unified LLM completion endpoint for internal services.
func (h *CompletionHandler) Complete(c *fiber.Ctx) error {
	userID, ok := middleware.UserIDFromCtx(c)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "UNAUTHORIZED", "message": "authentication required",
		})
	}

	var req completionReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "BAD_REQUEST", "message": "invalid request body",
		})
	}
	if len(req.Messages) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "BAD_REQUEST", "message": "messages must not be empty",
		})
	}

	domainReq := &domain.CompletionRequest{
		RequestID:      uuid.New().String(),
		UserID:         userID,
		CallerSvc:      req.CallerService,
		PreferredModel: req.PreferredModel,
		Messages:       req.Messages,
		MaxTokens:      req.MaxTokens,
		Temperature:    req.Temperature,
		UseCache:       req.UseCache,
	}

	resp, err := h.svc.Complete(c.Context(), domainReq)
	if err != nil {
		return mapError(c, err)
	}

	return c.JSON(resp)
}

// GetBudget godoc
// GET /api/v1/completions/budget
// Returns the authenticated user's current daily token budget.
func (h *CompletionHandler) GetBudget(c *fiber.Ctx) error {
	// Budget info comes from the service — placeholder for now
	return c.JSON(fiber.Map{"message": "budget endpoint not yet wired to service"})
}

func mapError(c *fiber.Ctx, err error) error {
	if de, ok := err.(*domain.DomainError); ok {
		return c.Status(de.StatusCode).JSON(fiber.Map{
			"error": de.Code, "message": de.Message,
		})
	}
	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		"error": "INTERNAL_ERROR", "message": "internal server error",
	})
}
