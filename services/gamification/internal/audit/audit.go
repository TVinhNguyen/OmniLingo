package audit

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/segmentio/kafka-go"
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

const auditTopic = "audit.gamification.events"

// Event is an immutable record of a security-relevant action.
type Event struct {
	EventID   string `json:"event_id"`
	Service   string `json:"service"`
	UserID    string `json:"user_id"`
	Action    Action `json:"action"`
	RequestID string `json:"request_id"`
	Result    string `json:"result"` // "SUCCESS" | "FAILURE"
	Details   string `json:"details,omitempty"`
	Timestamp string `json:"timestamp"`
}

// Service records audit events via structured logging and Kafka.
type Service struct {
	log     *zap.Logger
	writer  *kafka.Writer
	service string
}

// New creates a new audit Service with direct Kafka writer.
func New(log *zap.Logger, brokers []string, serviceName string) *Service {
	w := kafka.NewWriter(kafka.WriterConfig{
		Brokers:      brokers,
		Topic:        auditTopic,
		Balancer:     &kafka.LeastBytes{},
		BatchTimeout: 10 * time.Millisecond,
	})
	return &Service{log: log.Named("audit"), writer: w, service: serviceName}
}

// NewNoKafka creates a log-only audit Service (for testing or Kafka-disabled env).
func NewNoKafka(log *zap.Logger, serviceName string) *Service {
	return &Service{log: log.Named("audit"), writer: nil, service: serviceName}
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
	if s.writer == nil {
		return
	}
	if err := s.writer.WriteMessages(ctx, kafka.Message{
		Key:   []byte(evt.EventID),
		Value: raw,
	}); err != nil {
		s.log.Warn("audit: failed to publish event to kafka", zap.Error(err))
	}
}

// Close shuts down the Kafka writer.
func (s *Service) Close() {
	if s.writer != nil {
		_ = s.writer.Close()
	}
}
