package request

import (
	"fmt"
	"strings"
	"sync"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// ─── Validator singleton ───────────────────────────────────────────────────────

var (
	validate     *validator.Validate
	validateOnce sync.Once
)

func getValidator() *validator.Validate {
	validateOnce.Do(func() {
		validate = validator.New()
	})
	return validate
}

// ─── Parse ────────────────────────────────────────────────────────────────────

// Parse unmarshals the JSON request body into T and validates struct tags.
// Returns a 400 fiber.Error on unmarshal failure or validation error.
// Validation rules are expressed as `validate:"..."` struct tags.
//
// Example:
//
//	type RegisterRequest struct {
//	    Email    string `json:"email"    validate:"required,email"`
//	    Password string `json:"password" validate:"required,min=10"`
//	    Name     string `json:"name"     validate:"required"`
//	}
//
//	req, err := request.Parse[RegisterRequest](c)
//	if err != nil { return err }
func Parse[T any](c *fiber.Ctx) (T, error) {
	var out T
	if err := c.BodyParser(&out); err != nil {
		return out, fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}
	if err := getValidator().Struct(&out); err != nil {
		return out, fiber.NewError(fiber.StatusBadRequest, formatValidationErrors(err))
	}
	return out, nil
}

// ─── ParseUUID ────────────────────────────────────────────────────────────────

// ParseUUID extracts a path parameter by name and parses it as a UUID.
// Returns a 400 fiber.Error if the param is absent or not a valid UUID.
//
// Example:
//
//	userID, err := request.ParseUUID(c, "id")
//	if err != nil { return err }
func ParseUUID(c *fiber.Ctx, param string) (uuid.UUID, error) {
	raw := c.Params(param)
	id, err := uuid.Parse(raw)
	if err != nil {
		return uuid.Nil, fiber.NewError(fiber.StatusBadRequest,
			fmt.Sprintf("invalid %s: must be a valid UUID", param))
	}
	return id, nil
}

// ─── ParsePagination ──────────────────────────────────────────────────────────

// ParsePagination extracts `limit` and `offset` query params with safe defaults.
//   - limit: default 20, max 100
//   - offset: default 0, min 0
//
// Example:
//
//	limit, offset := request.ParsePagination(c)
func ParsePagination(c *fiber.Ctx) (limit, offset int) {
	limit = c.QueryInt("limit", 20)
	offset = c.QueryInt("offset", 0)
	if limit <= 0 {
		limit = 20
	} else if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	} else if offset > 10000 {
		offset = 10000
	}
	return limit, offset
}

// ─── Error formatting ─────────────────────────────────────────────────────────

// formatValidationErrors converts go-playground/validator ValidationErrors
// into a human-readable comma-separated field list.
// Output: "email: required; password: min=10"
func formatValidationErrors(err error) string {
	var ve validator.ValidationErrors
	if !isValidationError(err, &ve) {
		return err.Error()
	}
	msgs := make([]string, 0, len(ve))
	for _, fe := range ve {
		field := strings.ToLower(fe.Field())
		msgs = append(msgs, fmt.Sprintf("%s: %s", field, ruleMsg(fe)))
	}
	return strings.Join(msgs, "; ")
}

func isValidationError(err error, ve *validator.ValidationErrors) bool {
	if e, ok := err.(validator.ValidationErrors); ok {
		*ve = e
		return true
	}
	return false
}

// ruleMsg returns a short human-readable message for a single field error.
func ruleMsg(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return "required"
	case "email":
		return "must be a valid email"
	case "min":
		return fmt.Sprintf("min length %s", fe.Param())
	case "max":
		return fmt.Sprintf("max length %s", fe.Param())
	case "uuid":
		return "must be a valid UUID"
	case "oneof":
		return fmt.Sprintf("must be one of: %s", fe.Param())
	default:
		return fe.Tag()
	}
}
