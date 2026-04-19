package domain

import "fmt"

type DomainError struct {
	Code       string
	Message    string
	StatusCode int
}

func (e *DomainError) Error() string { return e.Message }

var (
	ErrNotFound      = &DomainError{Code: "NOT_FOUND", Message: "resource not found", StatusCode: 404}
	ErrUnauthorized  = &DomainError{Code: "UNAUTHORIZED", Message: "authentication required", StatusCode: 401}
	ErrForbidden     = &DomainError{Code: "FORBIDDEN", Message: "insufficient permissions", StatusCode: 403}
	ErrBadRequest    = &DomainError{Code: "BAD_REQUEST", Message: "invalid request", StatusCode: 400}
	ErrConflict      = &DomainError{Code: "CONFLICT", Message: "resource already exists", StatusCode: 409}
	ErrInternalError = &DomainError{Code: "INTERNAL_ERROR", Message: "internal server error", StatusCode: 500}
)

func Errorf(code, format string, args ...any) *DomainError {
	return &DomainError{Code: code, Message: fmt.Sprintf(format, args...), StatusCode: 400}
}
