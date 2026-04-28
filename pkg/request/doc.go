/*
Package request provides generic Fiber request parsing and validation for OmniLingo Go services.

# Design contract

  - Parse[T](c) (T, error) — unmarshal JSON body into T, validate struct tags, return 400 on failure.
  - ParseUUID(c, param) (uuid.UUID, error) — extract and parse a UUID path param, return 400 on failure.
  - ParsePagination(c) (limit, offset int) — safe integer extraction with defaults and caps.

# Validation tags

Uses go-playground/validator/v10. Fields annotated with `validate:"required"`, `validate:"min=N"`,
`validate:"email"` etc. are enforced automatically. Field-level errors are returned as:

	{"error": "VALIDATION_ERROR", "message": "email: required; password: min=10"}

# ADR note

This package is in-process only — no adapter needed. Validation rules live here (locality).
Handler tests become pure wiring tests (no rule coverage needed there).
*/
package request
