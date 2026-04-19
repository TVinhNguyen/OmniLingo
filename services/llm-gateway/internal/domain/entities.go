package domain

import (
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
)

// ─── Provider ─────────────────────────────────────────────────────────────────

type ProviderName string

const (
	ProviderAnthropic ProviderName = "anthropic"
	ProviderOpenAI    ProviderName = "openai"
	ProviderGoogle    ProviderName = "google"
)

// Model names per provider
const (
	// Anthropic
	ModelClaude3Haiku  = "claude-3-haiku-20240307"
	ModelClaude3Sonnet = "claude-3-5-sonnet-20241022"
	ModelClaude3Opus   = "claude-3-opus-20240229"
	// OpenAI
	ModelGPT4oMini = "gpt-4o-mini"
	ModelGPT4o     = "gpt-4o"
	// Google
	ModelGeminiFlash = "gemini-1.5-flash"
	ModelGeminiPro   = "gemini-1.5-pro"
)

// ─── Request / Response ────────────────────────────────────────────────────────

// Message is a single turn in a conversation.
type Message struct {
	Role    string `json:"role"`    // "user" | "assistant" | "system"
	Content string `json:"content"`
}

// CompletionRequest is the unified LLM completion request (provider-agnostic).
type CompletionRequest struct {
	// Caller metadata
	RequestID string    `json:"request_id"`
	UserID    uuid.UUID `json:"user_id"`
	CallerSvc string    `json:"caller_service"` // "ai-tutor", "writing-ai", etc.

	// Which model to prefer (gateway may override based on tier/budget)
	PreferredModel string `json:"preferred_model,omitempty"`

	Messages    []Message `json:"messages"`
	MaxTokens   int       `json:"max_tokens"`
	Temperature float64   `json:"temperature"`
	Stream      bool      `json:"stream"`

	// Caching hint: if true the gateway tries to serve from semantic cache
	UseCache bool `json:"use_cache"`
}

// CompletionResponse is the unified response returned to callers.
type CompletionResponse struct {
	RequestID    string       `json:"request_id"`
	Provider     ProviderName `json:"provider"`
	Model        string       `json:"model"`
	Content      string       `json:"content"`
	PromptTokens int          `json:"prompt_tokens"`
	OutputTokens int          `json:"output_tokens"`
	TotalTokens  int          `json:"total_tokens"`
	CacheHit     bool         `json:"cache_hit"`
	LatencyMs    int64        `json:"latency_ms"`
}

// ─── Request Log ──────────────────────────────────────────────────────────────

// LLMRequestLog is persisted to Postgres for cost tracking and audit.
type LLMRequestLog struct {
	ID           uuid.UUID    `json:"id"`
	RequestID    string       `json:"request_id"`
	UserID       uuid.UUID    `json:"user_id"`
	CallerSvc    string       `json:"caller_service"`
	Provider     ProviderName `json:"provider"`
	Model        string       `json:"model"`
	PromptTokens int          `json:"prompt_tokens"`
	OutputTokens int          `json:"output_tokens"`
	CostUSD      float64      `json:"cost_usd"`
	CacheHit     bool         `json:"cache_hit"`
	LatencyMs    int64        `json:"latency_ms"`
	Error        string       `json:"error,omitempty"`
	CreatedAt    time.Time    `json:"created_at"`
}

// ─── Budget ───────────────────────────────────────────────────────────────────

// DailyBudget tracks a user's token usage for the current UTC day.
type DailyBudget struct {
	UserID       uuid.UUID `json:"user_id"`
	Date         string    `json:"date"`        // "2026-04-18"
	TokensUsed   int       `json:"tokens_used"`
	TokensLimit  int       `json:"tokens_limit"` // -1 = unlimited
}

// Remaining returns how many tokens remain. -1 = unlimited.
func (b *DailyBudget) Remaining() int {
	if b.TokensLimit < 0 {
		return -1
	}
	remaining := b.TokensLimit - b.TokensUsed
	if remaining < 0 {
		return 0
	}
	return remaining
}

// ─── Prompt Template ──────────────────────────────────────────────────────────

// PromptTemplate is a named reusable prompt stored in Postgres.
type PromptTemplate struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Template  string    `json:"template"` // Go text/template syntax
	Model     string    `json:"model"`    // preferred model for this template
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ─── Domain Errors ─────────────────────────────────────────────────────────────

type DomainError struct {
	Code       string
	Message    string
	StatusCode int
}

func (e *DomainError) Error() string { return e.Message }

func Errorf(code, format string, args ...any) *DomainError {
	return &DomainError{Code: code, Message: fmt.Sprintf(format, args...), StatusCode: http.StatusBadRequest}
}

var (
	ErrUnauthorized = &DomainError{Code: "UNAUTHORIZED", Message: "authentication required", StatusCode: http.StatusUnauthorized}
	ErrBudgetExhausted = &DomainError{Code: "BUDGET_EXHAUSTED", Message: "daily token budget exceeded — upgrade your plan", StatusCode: http.StatusTooManyRequests}
	ErrNoProvider   = &DomainError{Code: "NO_PROVIDER", Message: "all LLM providers are unavailable", StatusCode: http.StatusServiceUnavailable}
	ErrBadRequest   = &DomainError{Code: "BAD_REQUEST", Message: "bad request", StatusCode: http.StatusBadRequest}
	ErrInternal     = &DomainError{Code: "INTERNAL_ERROR", Message: "internal server error", StatusCode: http.StatusInternalServerError}
)
