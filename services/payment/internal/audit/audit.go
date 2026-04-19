package audit

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/omnilingo/payment-service/internal/messaging"
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

const auditTopic = "audit.payment.events"

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

// Service records audit events via structured logging and Kafka.
type Service struct {
	log       *zap.Logger
	publisher messaging.Publisher
	service   string
}

// New creates a new audit Service.
func New(log *zap.Logger, publisher messaging.Publisher, serviceName string) *Service {
	return &Service{log: log.Named("audit"), publisher: publisher, service: serviceName}
}

// Record logs and publishes a security-relevant audit event.
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

	// Publish to Kafka for SIEM / S3 Object Lock archival (best-effort)
	if err := s.publisher.Publish(ctx, auditTopic, raw); err != nil {
		s.log.Warn("audit: failed to publish event to kafka", zap.Error(err))
	}
}
