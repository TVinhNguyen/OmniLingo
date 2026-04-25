package audit

import (
	"context"

	"go.uber.org/zap"

	"github.com/omnilingo/omnilingo/services/identity/internal/domain"
	"github.com/omnilingo/omnilingo/services/identity/internal/messaging"
)

// Service records security-relevant audit events.
// Events are both logged via zap (for local visibility)
// and durably inserted into the outbox_events table for relay to Kafka.
type Service struct {
	log    *zap.Logger
	outbox *messaging.OutboxRepository
}

// NewService creates a new audit Service.
func NewService(log *zap.Logger, outbox *messaging.OutboxRepository) *Service {
	return &Service{log: log, outbox: outbox}
}

// Record logs an audit event and inserts it into the outbox for Kafka relay.
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

	// Durable outbox insert for Kafka relay (replaces fire-and-forget publish)
	if err := s.outbox.Enqueue(ctx, domain.TopicAuditEvent, event); err != nil {
		s.log.Error("outbox insert audit event failed", zap.Error(err))
	}
}
