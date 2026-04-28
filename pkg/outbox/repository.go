package outbox

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Event is a pending Kafka message stored durably in Postgres.
type Event struct {
	ID      int64
	Topic   string
	Key     string
	Payload json.RawMessage
}

// Repository reads and writes outbox_events in a single service's DB.
// Each service instantiates its own Repository pointing at its own pool.
type Repository struct{ db *pgxpool.Pool }

// NewRepository creates a Repository backed by the given connection pool.
func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

// Enqueue inserts an event into outbox_events via the shared connection pool.
//
// NOTE (ADR-010 MVP1): This is NOT transactional with the caller's domain
// write. The event may be lost if the process crashes between the domain write
// and this call. Acceptable for MVP1.
//
// Phase 2: use EnqueueTx to gain atomicity — see Phase 2 hook below.
func (r *Repository) Enqueue(ctx context.Context, topic string, payload interface{}) error {
	return r.EnqueueWithKey(ctx, topic, uuid.New().String(), payload)
}

// EnqueueWithKey inserts an event with a caller-supplied key.
// Use this when ordering matters (e.g., all events for the same user_id must
// go to the same Kafka partition): pass userID.String() as the key to ensure
// consistent partitioning. (BUG-5 fix)
func (r *Repository) EnqueueWithKey(ctx context.Context, topic, key string, payload interface{}) error {
	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	_, err = r.db.Exec(ctx,
		`INSERT INTO outbox_events (topic, key, payload) VALUES ($1, $2, $3)`,
		topic, key, json.RawMessage(data))
	return err
}

// EnqueueTx inserts an event inside an existing pgx.Tx, making the outbox
// write atomic with the caller's domain write.
//
// PHASE 2 HOOK (ADR-010): Uncomment and use this method when upgrading from
// MVP1 to full transactional outbox. Rename Enqueue → EnqueueTx at call sites,
// threading the caller's pgx.Tx through.
//
// func (r *Repository) EnqueueTx(ctx context.Context, tx pgx.Tx, topic string, payload interface{}) error {
//     data, err := json.Marshal(payload)
//     if err != nil { return err }
//     _, err = tx.Exec(ctx,
//         `INSERT INTO outbox_events (topic, key, payload) VALUES ($1, $2, $3)`,
//         topic, uuid.New().String(), json.RawMessage(data))
//     return err
// }

// listPending returns up to limit unsent events inside the given transaction.
// Uses FOR UPDATE SKIP LOCKED so concurrent workers don't double-process events.
func (r *Repository) listPending(ctx context.Context, tx pgx.Tx, limit int) ([]Event, error) {
	rows, err := tx.Query(ctx, `
		SELECT id, topic, key, payload FROM outbox_events
		WHERE sent_at IS NULL AND attempts < 5
		ORDER BY created_at LIMIT $1 FOR UPDATE SKIP LOCKED`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var events []Event
	for rows.Next() {
		var e Event
		if err := rows.Scan(&e.ID, &e.Topic, &e.Key, &e.Payload); err != nil {
			return nil, fmt.Errorf("outbox: scan row: %w", err)
		}
		events = append(events, e)
	}
	return events, nil
}

func (r *Repository) markSent(ctx context.Context, tx pgx.Tx, id int64) error {
	_, err := tx.Exec(ctx,
		`UPDATE outbox_events SET sent_at=now(), attempts=attempts+1 WHERE id=$1`, id)
	return err
}

func (r *Repository) markFailed(ctx context.Context, tx pgx.Tx, id int64, errMsg string) error {
	_, err := tx.Exec(ctx,
		`UPDATE outbox_events SET attempts=attempts+1, last_error=$1 WHERE id=$2`, errMsg, id)
	return err
}
