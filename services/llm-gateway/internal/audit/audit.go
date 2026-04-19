package audit

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

// Action represents a loggable security-relevant action.
type Action string

const (
	ActionRead         Action = "DATA_READ"
	ActionWrite        Action = "DATA_WRITE"
	ActionDelete       Action = "DATA_DELETE"
	ActionUnauthorized Action = "AUTHZ_DENIED"
)

// Event is an immutable record of a security-relevant action.
type Event struct {
	EventID   string  `json:"event_id"`
	Service   string  `json:"service"`
	UserID    string  `json:"user_id"`
	Action    Action  `json:"action"`
	RequestID string  `json:"request_id"`
	Result    string  `json:"result"`  // "SUCCESS" | "FAILURE"
	Details   string  `json:"details,omitempty"`
	Timestamp string  `json:"timestamp"`
}

// Logger records audit events via structured logging.
// Events are written as structured JSON at INFO level on the "AUDIT" logger.
// For services with a Kafka publisher, promote to using Service below.
type Logger struct {
	log     *zap.Logger
	service string
}

// NewLogger creates a log-only audit Logger (no Kafka).
func NewLogger(log *zap.Logger, serviceName string) *Logger {
	return &Logger{log: log.Named("audit"), service: serviceName}
}

// Record emits a structured audit log entry.
func (l *Logger) Record(_ context.Context, userID string, action Action, requestID, result, details string) {
	evt := Event{
		EventID:   uuid.New().String(),
		Service:   l.service,
		UserID:    userID,
		Action:    action,
		RequestID: requestID,
		Result:    result,
		Details:   details,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}
	// Marshal for consistency with downstream SIEM ingestion
	raw, _ := json.Marshal(evt)
	l.log.Info("AUDIT", zap.ByteString("event", raw))
}
