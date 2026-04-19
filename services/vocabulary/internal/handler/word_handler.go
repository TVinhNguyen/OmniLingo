package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/omnilingo/vocabulary-service/internal/domain"
	"github.com/omnilingo/vocabulary-service/internal/metrics"
	"github.com/omnilingo/vocabulary-service/internal/service"
	"go.uber.org/zap"
)

// WordHandler handles public word lookup and admin CRUD.
type WordHandler struct {
	wordSvc service.WordService
	log     *zap.Logger
}

// NewWordHandler constructs a WordHandler.
func NewWordHandler(wordSvc service.WordService, log *zap.Logger) *WordHandler {
	return &WordHandler{wordSvc: wordSvc, log: log}
}

// RegisterRoutes binds routes on the given Fiber router group.
func (h *WordHandler) RegisterRoutes(public, admin fiber.Router) {
	public.Get("/entries/:id", h.GetEntry)
	public.Post("/entries/search", h.SearchEntries)
	admin.Post("/words", h.CreateWord)
	admin.Patch("/words/:id", h.UpdateWord)
}

// GetEntry godoc
// GET /api/v1/vocab/entries/:id
func (h *WordHandler) GetEntry(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "BAD_REQUEST", Message: "invalid word id",
		})
	}
	word, err := h.wordSvc.GetByID(c.Context(), id)
	if err != nil {
		return HandleError(c, err, h.log)
	}
	return c.JSON(fiber.Map{"word": word})
}

// SearchEntries godoc
// POST /api/v1/vocab/entries/search
func (h *WordHandler) SearchEntries(c *fiber.Ctx) error {
	var req domain.SearchRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "BAD_REQUEST", Message: "invalid request body",
		})
	}
	result, err := h.wordSvc.Search(c.Context(), req)
	if err != nil {
		metrics.WordSearchTotal.WithLabelValues(req.Language, "error").Inc()
		return HandleError(c, err, h.log)
	}
	metrics.WordSearchTotal.WithLabelValues(req.Language, "success").Inc()
	return c.JSON(result)
}

// CreateWord godoc (admin)
// POST /api/v1/vocab/admin/words
func (h *WordHandler) CreateWord(c *fiber.Ctx) error {
	var req domain.CreateWordRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "BAD_REQUEST", Message: "invalid request body",
		})
	}
	word, err := h.wordSvc.CreateWord(c.Context(), req)
	if err != nil {
		return HandleError(c, err, h.log)
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"word": word})
}

// UpdateWord godoc (admin)
// PATCH /api/v1/vocab/admin/words/:id
func (h *WordHandler) UpdateWord(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "BAD_REQUEST", Message: "invalid word id",
		})
	}
	var req domain.CreateWordRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "BAD_REQUEST", Message: "invalid request body",
		})
	}
	word, err := h.wordSvc.UpdateWord(c.Context(), id, req)
	if err != nil {
		return HandleError(c, err, h.log)
	}
	return c.JSON(fiber.Map{"word": word})
}
