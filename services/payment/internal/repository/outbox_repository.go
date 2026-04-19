package repository

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// OutboxEntry is a pending Kafka message stored transactionally alongside the business write.
type OutboxEntry struct {
	ID        uuid.UUID
	Topic     string
	Key       string
	Payload   json.RawMessage
	CreatedAt time.Time
}

// OutboxRepository reads pending outbox entries and marks them published.
type OutboxRepository interface {
	// InsertTx inserts an outbox entry within an existing transaction (dbtx is pgx.Tx).
	InsertTx(ctx context.Context, dbtx pgx.Tx, entry *OutboxEntry) error
	// FetchPending returns up to limit pending entries ordered by created_at ASC.
	FetchPending(ctx context.Context, limit int) ([]*OutboxEntry, error)
	// MarkPublished sets status='published' and published_at=now().
	MarkPublished(ctx context.Context, id uuid.UUID) error
	// MarkFailed increments attempts and sets last_error, leaves status pending for retry.
	MarkFailed(ctx context.Context, id uuid.UUID, errMsg string) error
}

type outboxRepo struct{ db *pgxpool.Pool }

func NewOutboxRepository(db *pgxpool.Pool) OutboxRepository {
	return &outboxRepo{db: db}
}

func (r *outboxRepo) InsertTx(ctx context.Context, dbtx pgx.Tx, entry *OutboxEntry) error {
	entry.ID = uuid.New()
	entry.CreatedAt = time.Now().UTC()
	_, err := dbtx.Exec(ctx, `
		INSERT INTO payment_outbox (id, topic, key, payload, status, created_at)
		VALUES ($1, $2, $3, $4, 'pending', $5)`,
		entry.ID, entry.Topic, entry.Key, []byte(entry.Payload), entry.CreatedAt)
	return err
}

func (r *outboxRepo) FetchPending(ctx context.Context, limit int) ([]*OutboxEntry, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, topic, key, payload, created_at
		FROM payment_outbox
		WHERE status = 'pending'
		ORDER BY created_at ASC
		LIMIT $1
		FOR UPDATE SKIP LOCKED`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entries []*OutboxEntry
	for rows.Next() {
		e := &OutboxEntry{}
		if err := rows.Scan(&e.ID, &e.Topic, &e.Key, &e.Payload, &e.CreatedAt); err != nil {
			return nil, err
		}
		entries = append(entries, e)
	}
	return entries, rows.Err()
}

func (r *outboxRepo) MarkPublished(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `
		UPDATE payment_outbox
		SET status='published', published_at=now()
		WHERE id=$1`, id)
	return err
}

func (r *outboxRepo) MarkFailed(ctx context.Context, id uuid.UUID, errMsg string) error {
	_, err := r.db.Exec(ctx, `
		UPDATE payment_outbox
		SET attempts = attempts + 1, last_error=$2
		WHERE id=$1`, id, errMsg)
	return err
}
