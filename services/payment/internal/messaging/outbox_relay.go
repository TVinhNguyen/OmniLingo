package messaging

import (
	"context"
	"time"

	"github.com/omnilingo/payment-service/internal/repository"
	"go.uber.org/zap"
)

// OutboxRelay polls payment_outbox for pending entries and publishes them to Kafka.
// Run in a background goroutine. Stops gracefully when ctx is cancelled.
type OutboxRelay struct {
	outbox    repository.OutboxRepository
	publisher Publisher
	log       *zap.Logger
	interval  time.Duration
}

func NewOutboxRelay(
	outbox repository.OutboxRepository,
	publisher Publisher,
	log *zap.Logger,
) *OutboxRelay {
	return &OutboxRelay{
		outbox:    outbox,
		publisher: publisher,
		log:       log,
		interval:  5 * time.Second, // poll every 5s
	}
}

// Run starts the relay loop. Blocks until ctx is done.
func (r *OutboxRelay) Run(ctx context.Context) {
	ticker := time.NewTicker(r.interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			r.log.Info("outbox relay stopping")
			return
		case <-ticker.C:
			if err := r.flush(ctx); err != nil {
				r.log.Warn("outbox relay flush error", zap.Error(err))
			}
		}
	}
}

func (r *OutboxRelay) flush(ctx context.Context) error {
	entries, err := r.outbox.FetchPending(ctx, 100)
	if err != nil {
		return err
	}
	for _, entry := range entries {
		if err := r.publishEntry(ctx, entry); err != nil {
			r.log.Warn("outbox: failed to publish",
				zap.String("id", entry.ID.String()),
				zap.String("topic", entry.Topic),
				zap.Error(err))
			if markErr := r.outbox.MarkFailed(ctx, entry.ID, err.Error()); markErr != nil {
				r.log.Error("outbox: failed to mark entry as failed", zap.Error(markErr))
			}
		} else {
			if markErr := r.outbox.MarkPublished(ctx, entry.ID); markErr != nil {
				r.log.Error("outbox: published but failed to mark", zap.Error(markErr))
			}
		}
	}
	return nil
}

func (r *OutboxRelay) publishEntry(ctx context.Context, entry *repository.OutboxEntry) error {
	return r.publisher.Publish(ctx, entry.Topic, []byte(entry.Payload))
}
