package audit

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/omnilingo/pkg/outbox"
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

const auditTopic = "audit.vocabulary.events"

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

// Service records audit events via structured logging and outbox.
type Service struct {
	log     *zap.Logger
	outbox  *outbox.Repository
	service string
}

// New creates a new audit Service.
func New(log *zap.Logger, outboxRepo *outbox.Repository, serviceName string) *Service {
	return &Service{log: log.Named("audit"), outbox: outboxRepo, service: serviceName}
}

// Record logs and durably inserts a security-relevant audit event into the outbox.
func (s *Service) Record(ctx context.Context, userID string, action Action, requestID, result, details string) {
	evt := Event{
		EventID:   uuid.New().String(),
		Service:   s.service,
		UserID:    userID,
		Action:    action,
		RequestID: requestID,
		Result:    result,
		Details:   details,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}

	raw, err := json.Marshal(evt)
	if err != nil {
		s.log.Error("audit: failed to marshal event", zap.Error(err))
		return
	}

	// Always log locally (structured)
	s.log.Info("AUDIT", zap.ByteString("event", raw))

	// Durable outbox insert for Kafka relay
	if err := s.outbox.Enqueue(ctx, auditTopic, evt); err != nil {
		s.log.Warn("audit: outbox insert failed", zap.Error(err))
	}
}
