package domain

// ─── Domain Errors ────────────────────────────────────────────────────────────

// DomainError carries a machine-readable code and a human message.
type DomainError struct {
	Code    string
	Message string
}

func (e *DomainError) Error() string { return e.Message }

// Sentinel errors — handlers map these to HTTP status codes.
var (
	ErrWordNotFound       = &DomainError{Code: "NOT_FOUND", Message: "word not found"}
	ErrDeckNotFound       = &DomainError{Code: "NOT_FOUND", Message: "deck not found"}
	ErrCardNotFound       = &DomainError{Code: "NOT_FOUND", Message: "card not found"}
	ErrDeckNotOwned       = &DomainError{Code: "FORBIDDEN", Message: "you do not own this deck"}
	ErrCardAlreadyInDeck  = &DomainError{Code: "CONFLICT", Message: "word already in deck"}
	ErrWordAlreadyExists  = &DomainError{Code: "CONFLICT", Message: "word with this (language, lemma, pos) already exists"}
	ErrInvalidInput       = &DomainError{Code: "BAD_REQUEST", Message: "invalid input"}
	ErrDeckNameRequired   = &DomainError{Code: "BAD_REQUEST", Message: "deck name is required"}
	ErrLanguageRequired   = &DomainError{Code: "BAD_REQUEST", Message: "language is required"}
	ErrWordIDRequired     = &DomainError{Code: "BAD_REQUEST", Message: "word_id is required"}
	ErrSearchQueryEmpty   = &DomainError{Code: "BAD_REQUEST", Message: "search query is required"}
	ErrAnkiParseFailed    = &DomainError{Code: "BAD_REQUEST", Message: "failed to parse Anki .apkg file"}
	ErrInternalError      = &DomainError{Code: "INTERNAL_ERROR", Message: "internal server error"}
	ErrUnauthorized       = &DomainError{Code: "UNAUTHORIZED", Message: "authentication required"}
	ErrForbidden          = &DomainError{Code: "FORBIDDEN", Message: "insufficient permissions"}
)
