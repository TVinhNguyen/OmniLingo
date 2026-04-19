package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/omnilingo/vocabulary-service/internal/anki"
	"github.com/omnilingo/vocabulary-service/internal/metrics"
	"github.com/omnilingo/vocabulary-service/internal/middleware"
	"go.uber.org/zap"
)

// AnkiHandler handles Anki .apkg import.
type AnkiHandler struct {
	importer    *anki.Importer
	maxFileSize int64
	log         *zap.Logger
}

// NewAnkiHandler constructs an AnkiHandler.
func NewAnkiHandler(importer *anki.Importer, maxFileSize int64, log *zap.Logger) *AnkiHandler {
	return &AnkiHandler{importer: importer, maxFileSize: maxFileSize, log: log}
}

// RegisterRoutes binds import routes.
func (h *AnkiHandler) RegisterRoutes(protected fiber.Router) {
	protected.Post("/import/anki", h.ImportAnki)
}

// ImportAnki godoc — POST /api/v1/vocab/import/anki
// Accepts multipart/form-data with fields: file (.apkg), language, deck_name
func (h *AnkiHandler) ImportAnki(c *fiber.Ctx) error {
	uid, err := middleware.UserIDFromCtx(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(ErrorResponse{
			Error: "UNAUTHORIZED", Message: "authentication required",
		})
	}

	language := c.FormValue("language")
	deckName := c.FormValue("deck_name")
	if language == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "BAD_REQUEST", Message: "language is required",
		})
	}
	if deckName == "" {
		deckName = "Anki Import " + uuid.New().String()[:8]
	}

	fileHeader, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "BAD_REQUEST", Message: "file field is required (.apkg)",
		})
	}
	if fileHeader.Size > h.maxFileSize {
		return c.Status(fiber.StatusRequestEntityTooLarge).JSON(ErrorResponse{
			Error: "PAYLOAD_TOO_LARGE",
			Message: "file exceeds maximum allowed size",
		})
	}

	file, err := fileHeader.Open()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "BAD_REQUEST", Message: "cannot read file",
		})
	}
	defer file.Close()

	buf := make([]byte, fileHeader.Size)
	if _, err := file.Read(buf); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ErrorResponse{
			Error: "BAD_REQUEST", Message: "cannot read file content",
		})
	}

	result, err := h.importer.Import(c.Context(), uid, language, deckName, buf)
	if err != nil {
		metrics.AnkiImportTotal.WithLabelValues("error").Inc()
		return HandleError(c, err, h.log)
	}

	metrics.AnkiImportTotal.WithLabelValues("success").Inc()
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":  "✅ Anki import completed",
		"deck_id":  result.DeckID,
		"added":    result.Added,
		"skipped":  result.Skipped,
		"language": result.Language,
	})
}
