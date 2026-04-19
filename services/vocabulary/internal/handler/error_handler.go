package handler

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/omnilingo/vocabulary-service/internal/domain"
	"go.uber.org/zap"
)

// ErrorResponse is the standard API error envelope.
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}

// HandleError maps domain errors to HTTP responses per coding-standards.md §4.1.
func HandleError(c *fiber.Ctx, err error, log *zap.Logger) error {
	var de *domain.DomainError
	if errors.As(err, &de) {
		status := domainCodeToStatus(de.Code)
		return c.Status(status).JSON(ErrorResponse{
			Error:   de.Code,
			Message: de.Message,
		})
	}

	// Fiber errors (e.g., 413, 405)
	var fe *fiber.Error
	if errors.As(err, &fe) {
		return c.Status(fe.Code).JSON(ErrorResponse{
			Error:   "HTTP_ERROR",
			Message: fe.Message,
		})
	}

	log.Error("unhandled error", zap.Error(err))
	return c.Status(fiber.StatusInternalServerError).JSON(ErrorResponse{
		Error:   "INTERNAL_ERROR",
		Message: "internal server error",
	})
}

func domainCodeToStatus(code string) int {
	switch code {
	case "NOT_FOUND":
		return fiber.StatusNotFound
	case "CONFLICT":
		return fiber.StatusConflict
	case "BAD_REQUEST", "VALIDATION_ERROR":
		return fiber.StatusBadRequest
	case "UNAUTHORIZED":
		return fiber.StatusUnauthorized
	case "FORBIDDEN":
		return fiber.StatusForbidden
	case "UNPROCESSABLE":
		return fiber.StatusUnprocessableEntity
	default:
		return fiber.StatusInternalServerError
	}
}
