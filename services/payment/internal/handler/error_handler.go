package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/omnilingo/payment-service/internal/domain"
)

// mapError converts domain errors to appropriate HTTP responses.
func mapError(c *fiber.Ctx, err error) error {
	if de, ok := err.(*domain.DomainError); ok {
		return c.Status(de.StatusCode).JSON(fiber.Map{
			"error": de.Code, "message": de.Message,
		})
	}
	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		"error": "INTERNAL_ERROR", "message": "an unexpected error occurred",
	})
}
