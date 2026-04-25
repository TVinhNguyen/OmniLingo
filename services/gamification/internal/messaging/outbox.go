package messaging

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/segmentio/kafka-go"
	"go.uber.org/zap"
)

// OutboxEvent is a pending Kafka message stored durably in Postgres.
type OutboxEvent struct {
	ID      int64
	Topic   string
	Key     string
	Payload json.RawMessage
}

// OutboxRepository reads/writes outbox_events in the learning-service DB.
type OutboxRepository struct{ db *pgxpool.Pool }

func NewOutboxRepository(db *pgxpool.Pool) *OutboxRepository {
	return &OutboxRepository{db: db}
}

// InsertTx writes an event inside the caller's transaction — call with the same
// pgx.Tx as the domain write to ensure atomicity.
func (r *OutboxRepository) InsertTx(ctx context.Context, topic string, payload interface{}) error {
	data, err := json.Marshal(payload)
	if err != nil { return err }
	_, err = r.db.Exec(ctx,
		`INSERT INTO outbox_events (topic, key, payload) VALUES ($1, $2, $3)`,
		topic, uuid.New().String(), json.RawMessage(data))
	return err
}

// ListPending returns up to limit unsent events (FOR UPDATE SKIP LOCKED for concurrency safety).
func (r *OutboxRepository) ListPending(ctx context.Context, limit int) ([]OutboxEvent, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, topic, key, payload FROM outbox_events
		WHERE sent_at IS NULL AND attempts < 5
		ORDER BY created_at LIMIT $1 FOR UPDATE SKIP LOCKED`, limit)
	if err != nil { return nil, err }
	defer rows.Close()
	var events []OutboxEvent
	for rows.Next() {
		var e OutboxEvent
		if err := rows.Scan(&e.ID, &e.Topic, &e.Key, &e.Payload); err != nil { continue }
		events = append(events, e)
	}
	return events, nil
}

func (r *OutboxRepository) MarkSent(ctx context.Context, id int64) error {
	_, err := r.db.Exec(ctx,
		`UPDATE outbox_events SET sent_at=now(), attempts=attempts+1 WHERE id=$1`, id)
	return err
}

func (r *OutboxRepository) MarkFailed(ctx context.Context, id int64, errMsg string) error {
	_, err := r.db.Exec(ctx,
		`UPDATE outbox_events SET attempts=attempts+1, last_error=$1 WHERE id=$2`, errMsg, id)
	return err
}

// ─── Relay Worker ──────────────────────────────────────────────────────────────

// OutboxWorker polls outbox_events and publishes them to Kafka.
// Run as: go worker.Run(ctx)   — exits cleanly when ctx is cancelled.
type OutboxWorker struct {
	repo    *OutboxRepository
	brokers []string
	log     *zap.Logger
}

func NewOutboxWorker(repo *OutboxRepository, brokers []string, log *zap.Logger) *OutboxWorker {
	return &OutboxWorker{repo: repo, brokers: brokers, log: log}
}

func (w *OutboxWorker) Run(ctx context.Context) {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			w.log.Info("outbox worker: shutting down, flushing remaining events")
			w.flush(context.Background()) // one final flush on shutdown
			return
		case <-ticker.C:
			w.flush(ctx)
		}
	}
}

func (w *OutboxWorker) flush(ctx context.Context) {
	events, err := w.repo.ListPending(ctx, 50)
	if err != nil { w.log.Error("outbox list failed", zap.Error(err)); return }
	if len(events) == 0 { return }

	byTopic := make(map[string][]OutboxEvent)
	for _, e := range events { byTopic[e.Topic] = append(byTopic[e.Topic], e) }

	for topic, topicEvents := range byTopic {
		writer := kafka.NewWriter(kafka.WriterConfig{
			Brokers: w.brokers, Topic: topic,
			Balancer: &kafka.LeastBytes{}, BatchTimeout: 10 * time.Millisecond,
		})
		msgs := make([]kafka.Message, len(topicEvents))
		for i, e := range topicEvents {
			msgs[i] = kafka.Message{Key: []byte(e.Key), Value: e.Payload}
		}
		if err := writer.WriteMessages(ctx, msgs...); err != nil {
			w.log.Error("outbox kafka publish failed", zap.String("topic", topic), zap.Error(err))
			for _, e := range topicEvents { _ = w.repo.MarkFailed(ctx, e.ID, err.Error()) }
		} else {
			for _, e := range topicEvents { _ = w.repo.MarkSent(ctx, e.ID) }
			w.log.Info("outbox flushed", zap.String("topic", topic), zap.Int("count", len(topicEvents)))
		}
		_ = writer.Close()
	}
}
