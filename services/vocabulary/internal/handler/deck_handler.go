package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/omnilingo/vocabulary-service/internal/domain"
	"github.com/omnilingo/vocabulary-service/internal/metrics"
	"github.com/omnilingo/vocabulary-service/internal/middleware"
	"github.com/omnilingo/vocabulary-service/internal/service"
	"github.com/omnilingo/pkg/request"
	"go.uber.org/zap"
)

// DeckHandler handles deck and card operations.
type DeckHandler struct {
	deckSvc service.DeckService
	log     *zap.Logger
}

// NewDeckHandler constructs a DeckHandler.
func NewDeckHandler(deckSvc service.DeckService, log *zap.Logger) *DeckHandler {
	return &DeckHandler{deckSvc: deckSvc, log: log}
}

// RegisterRoutes binds deck/card routes on a protected group.
func (h *DeckHandler) RegisterRoutes(protected fiber.Router) {
	protected.Get("/decks", h.ListDecks)
	protected.Post("/decks", h.CreateDeck)
	protected.Get("/decks/:id", h.GetDeck)
	protected.Delete("/decks/:id", h.DeleteDeck)
	protected.Get("/decks/:id/cards", h.ListCards)
	protected.Post("/decks/:id/cards", h.AddCard)
	protected.Delete("/decks/:deckId/cards/:cardId", h.RemoveCard)
	protected.Post("/cards/:id/mark-known", h.MarkKnown)
}

// ListDecks godoc — GET /api/v1/vocab/decks
func (h *DeckHandler) ListDecks(c *fiber.Ctx) error {
	uid, err := middleware.UserIDFromCtx(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(ErrorResponse{
			Error: "UNAUTHORIZED", Message: "authentication required",
		})
	}
	decks, err := h.deckSvc.ListDecks(c.Context(), uid)
	if err != nil {
		return HandleError(c, err, h.log)
	}
	return c.JSON(fiber.Map{"decks": decks})
}

// CreateDeck godoc — POST /api/v1/vocab/decks
func (h *DeckHandler) CreateDeck(c *fiber.Ctx) error {
	uid, err := middleware.UserIDFromCtx(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(ErrorResponse{
			Error: "UNAUTHORIZED", Message: "authentication required",
		})
	}
	req, err := request.Parse[domain.CreateDeckRequest](c)
	if err != nil {
		return HandleError(c, err, h.log)
	}
	deck, err := h.deckSvc.CreateDeck(c.Context(), uid, req)
	if err != nil {
		return HandleError(c, err, h.log)
	}
	metrics.DeckCreatedTotal.Inc()
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"deck": deck})
}

// GetDeck godoc — GET /api/v1/vocab/decks/:id
func (h *DeckHandler) GetDeck(c *fiber.Ctx) error {
	uid, err := middleware.UserIDFromCtx(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(ErrorResponse{
			Error: "UNAUTHORIZED", Message: "authentication required",
		})
	}
	deckID, err := request.ParseUUID(c, "id")
	if err != nil {
		return HandleError(c, err, h.log)
	}
	deck, err := h.deckSvc.GetDeck(c.Context(), uid, deckID)
	if err != nil {
		return HandleError(c, err, h.log)
	}
	return c.JSON(fiber.Map{"deck": deck})
}

// DeleteDeck godoc — DELETE /api/v1/vocab/decks/:id
func (h *DeckHandler) DeleteDeck(c *fiber.Ctx) error {
	uid, err := middleware.UserIDFromCtx(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(ErrorResponse{
			Error: "UNAUTHORIZED", Message: "authentication required",
		})
	}
	deckID, err := request.ParseUUID(c, "id")
	if err != nil {
		return HandleError(c, err, h.log)
	}
	if err := h.deckSvc.DeleteDeck(c.Context(), uid, deckID); err != nil {
		return HandleError(c, err, h.log)
	}
	return c.SendStatus(fiber.StatusNoContent)
}

// ListCards godoc — GET /api/v1/vocab/decks/:id/cards
func (h *DeckHandler) ListCards(c *fiber.Ctx) error {
	uid, err := middleware.UserIDFromCtx(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(ErrorResponse{
			Error: "UNAUTHORIZED", Message: "authentication required",
		})
	}
	deckID, err := request.ParseUUID(c, "id")
	if err != nil {
		return HandleError(c, err, h.log)
	}
	cards, err := h.deckSvc.ListCards(c.Context(), uid, deckID)
	if err != nil {
		return HandleError(c, err, h.log)
	}
	return c.JSON(fiber.Map{"cards": cards})
}

// AddCard godoc — POST /api/v1/vocab/decks/:id/cards
func (h *DeckHandler) AddCard(c *fiber.Ctx) error {
	uid, err := middleware.UserIDFromCtx(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(ErrorResponse{
			Error: "UNAUTHORIZED", Message: "authentication required",
		})
	}
	deckID, err := request.ParseUUID(c, "id")
	if err != nil {
		return HandleError(c, err, h.log)
	}
	req, err := request.Parse[domain.AddCardRequest](c)
	if err != nil {
		return HandleError(c, err, h.log)
	}
	card, err := h.deckSvc.AddCard(c.Context(), uid, deckID, req)
	if err != nil {
		return HandleError(c, err, h.log)
	}
	metrics.CardAddedTotal.Inc()
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"card": card})
}

// RemoveCard godoc — DELETE /api/v1/vocab/decks/:deckId/cards/:cardId
func (h *DeckHandler) RemoveCard(c *fiber.Ctx) error {
	uid, err := middleware.UserIDFromCtx(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(ErrorResponse{
			Error: "UNAUTHORIZED", Message: "authentication required",
		})
	}
	deckID, err := request.ParseUUID(c, "deckId")
	if err != nil {
		return HandleError(c, err, h.log)
	}
	cardID, err := request.ParseUUID(c, "cardId")
	if err != nil {
		return HandleError(c, err, h.log)
	}
	if err := h.deckSvc.RemoveCard(c.Context(), uid, deckID, cardID); err != nil {
		return HandleError(c, err, h.log)
	}
	return c.SendStatus(fiber.StatusNoContent)
}

// MarkKnown godoc — POST /api/v1/vocab/cards/:id/mark-known
func (h *DeckHandler) MarkKnown(c *fiber.Ctx) error {
	uid, err := middleware.UserIDFromCtx(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(ErrorResponse{
			Error: "UNAUTHORIZED", Message: "authentication required",
		})
	}
	cardID, err := request.ParseUUID(c, "id")
	if err != nil {
		return HandleError(c, err, h.log)
	}
	if err := h.deckSvc.MarkKnown(c.Context(), uid, cardID); err != nil {
		return HandleError(c, err, h.log)
	}
	return c.JSON(fiber.Map{"message": "card marked as known"})
}
