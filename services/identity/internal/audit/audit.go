package audit

import (
	"context"

	"go.uber.org/zap"

	"github.com/omnilingo/omnilingo/services/identity/internal/domain"
	"github.com/omnilingo/omnilingo/services/identity/internal/messaging"
)

// Service records security-relevant audit events.
// Events are both logged via zap (for local visibility)
// and published to Kafka "audit.identity.events" topic (for SIEM/S3 archival).
type Service struct {
	log       *zap.Logger
	publisher *messaging.Publisher
}

// NewService creates a new audit Service.
func NewService(log *zap.Logger, publisher *messaging.Publisher) *Service {
	return &Service{log: log, publisher: publisher}
}

// Record logs an audit event and publishes it to Kafka.
func (s *Service) Record(ctx context.Context, event domain.AuditEvent) {
	// Always log locally (structured)
	s.log.Info("AUDIT",
		zap.String("event_id", event.EventID),
		zap.String("action", string(event.Action)),
		zap.String("user_id", event.UserID),
		zap.String("ip", event.IP),
		zap.String("result", event.Result),
		zap.String("request_id", event.RequestID),
		zap.String("details", event.Details),
	)

	// Publish to Kafka for SIEM / S3 Object Lock archival
	s.publisher.Publish(ctx, domain.TopicAuditEvent, event)
}
