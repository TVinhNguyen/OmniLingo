package messaging

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/twmb/franz-go/pkg/kgo"
	"go.uber.org/zap"
)

// OutboxEvent is a pending Kafka message stored durably in Postgres.
type OutboxEvent struct {
	ID      int64
	Topic   string
	Key     string
	Payload json.RawMessage
}

// OutboxRepository reads/writes outbox_events.
type OutboxRepository struct{ db *pgxpool.Pool }

func NewOutboxRepository(db *pgxpool.Pool) *OutboxRepository {
	return &OutboxRepository{db: db}
}

// Enqueue inserts an event into outbox_events via the connection pool.
// NOTE: This is NOT transactional with the caller's domain write — it uses
// the shared pool, not a pgx.Tx. Acceptable for MVP1 (see ADR-010).
// Phase 2: accept pgx.Tx parameter for true atomic write (like payment-service).
func (r *OutboxRepository) Enqueue(ctx context.Context, topic string, payload interface{}) error {
	data, err := json.Marshal(payload)
	if err != nil { return err }
	_, err = r.db.Exec(ctx,
		`INSERT INTO outbox_events (topic, key, payload) VALUES ($1, $2, $3)`,
		topic, uuid.New().String(), json.RawMessage(data))
	return err
}

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

// OutboxWorker polls outbox_events and publishes to Kafka via franz-go.
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
			w.log.Info("outbox worker: final flush on shutdown")
			w.flush(context.Background())
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

	client, err := kgo.NewClient(kgo.SeedBrokers(w.brokers...))
	if err != nil { w.log.Error("outbox: kafka client error", zap.Error(err)); return }
	defer client.Close()

	for _, e := range events {
		rec := &kgo.Record{Topic: e.Topic, Key: []byte(e.Key), Value: e.Payload}
		results := client.ProduceSync(ctx, rec)
		if err := results.FirstErr(); err != nil {
			w.log.Error("outbox kafka publish failed", zap.String("topic", e.Topic), zap.Error(err))
			_ = w.repo.MarkFailed(ctx, e.ID, err.Error())
		} else {
			_ = w.repo.MarkSent(ctx, e.ID)
			w.log.Debug("outbox flushed", zap.String("topic", e.Topic))
		}
	}
}
