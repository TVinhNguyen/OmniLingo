package outbox

import (
	"context"
	"time"

	"go.uber.org/zap"
)

const (
	defaultPollInterval = 5 * time.Second
	defaultBatchSize    = 50
)

// WorkerOption configures a Worker.
type WorkerOption func(*Worker)

// WithPollInterval sets the polling interval (default: 5s).
func WithPollInterval(d time.Duration) WorkerOption {
	return func(w *Worker) { w.interval = d }
}

// WithBatchSize sets the maximum number of events per flush (default: 50).
func WithBatchSize(n int) WorkerOption {
	return func(w *Worker) { w.batchSize = n }
}

// Worker polls outbox_events and relays them to Kafka via Publisher.
//
// Lifecycle is caller-controlled:
//
//	worker := outbox.NewWorker(repo, pub, log)
//	go worker.Run(ctx) // exits when ctx is cancelled; performs one final flush
type Worker struct {
	repo      *Repository
	pub       Publisher
	log       *zap.Logger
	interval  time.Duration
	batchSize int
}

// NewWorker creates a Worker. Callers must call Run to start the relay loop.
// If log is nil, a no-op logger is used.
func NewWorker(repo *Repository, pub Publisher, log *zap.Logger, opts ...WorkerOption) *Worker {
	if log == nil {
		log = zap.NewNop()
	}
	w := &Worker{
		repo:      repo,
		pub:       pub,
		log:       log,
		interval:  defaultPollInterval,
		batchSize: defaultBatchSize,
	}
	for _, o := range opts {
		o(w)
	}
	return w
}

// Run starts the relay loop. It blocks until ctx is cancelled, then performs
// one final flush before returning. Designed to be called in a goroutine:
//
//	go worker.Run(ctx)
func (w *Worker) Run(ctx context.Context) {
	ticker := time.NewTicker(w.interval)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			w.log.Info("outbox worker: shutting down, flushing remaining events")
			w.flush(context.Background()) // final flush — use Background so it isn't cancelled
			return
		case <-ticker.C:
			w.flush(ctx)
		}
	}
}

// flush fetches pending events in a transaction, publishes them, and marks
// each event sent or failed — all within the same tx for relay correctness.
//
// Note: the Enqueue path is still non-transactional (ADR-010 MVP1). Only the
// relay worker uses a tx — this prevents concurrent workers from double-delivering.
func (w *Worker) flush(ctx context.Context) {
	tx, err := w.repo.db.Begin(ctx)
	if err != nil {
		w.log.Error("outbox: begin tx failed", zap.Error(err))
		return
	}
	defer tx.Rollback(ctx) //nolint:errcheck // rollback on any non-commit exit

	events, err := w.repo.listPending(ctx, tx, w.batchSize)
	if err != nil {
		w.log.Error("outbox: list pending failed", zap.Error(err))
		return
	}
	if len(events) == 0 {
		return
	}

	// Group by topic for batched Kafka writes.
	byTopic := make(map[string][]Event)
	for _, e := range events {
		byTopic[e.Topic] = append(byTopic[e.Topic], e)
	}

	for topic, topicEvents := range byTopic {
		msgs := make([]Message, len(topicEvents))
		for i, e := range topicEvents {
			msgs[i] = Message{Key: []byte(e.Key), Payload: e.Payload}
		}

		if err := w.pub.Publish(ctx, topic, msgs); err != nil {
			w.log.Error("outbox: publish failed",
				zap.String("topic", topic),
				zap.Int("count", len(msgs)),
				zap.Error(err))
			for _, e := range topicEvents {
				if ferr := w.repo.markFailed(ctx, tx, e.ID, err.Error()); ferr != nil {
					w.log.Error("outbox: markFailed failed", zap.Int64("id", e.ID), zap.Error(ferr))
				}
			}
		} else {
			for _, e := range topicEvents {
				if serr := w.repo.markSent(ctx, tx, e.ID); serr != nil {
					// BUG-1: If markSent fails, abort the whole batch — do NOT commit.
					// The events will be re-published next flush. Consumers must be idempotent.
					w.log.Error("outbox: markSent failed — aborting batch to prevent duplicate commit",
						zap.Int64("id", e.ID), zap.Error(serr))
					return // tx.Rollback called by defer
				}
			}
			w.log.Info("outbox: flushed",
				zap.String("topic", topic),
				zap.Int("count", len(topicEvents)))
		}
	}

	if err := tx.Commit(ctx); err != nil {
		w.log.Error("outbox: commit failed", zap.Error(err))
	}
}
