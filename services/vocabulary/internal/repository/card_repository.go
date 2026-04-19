package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/omnilingo/vocabulary-service/internal/domain"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

// wordCacheTTL is the cache duration for word entries.
const wordCacheTTL = time.Hour

// CardRepository defines the contract for user_cards data access.
type CardRepository interface {
	AddCard(ctx context.Context, card *domain.UserCard) error
	GetCard(ctx context.Context, id uuid.UUID) (*domain.UserCard, error)
	RemoveCard(ctx context.Context, userID, cardID uuid.UUID) error
	MarkKnown(ctx context.Context, userID, cardID uuid.UUID) error
	BulkAdd(ctx context.Context, cards []*domain.UserCard) (added, skipped int, err error)
}

type cardRepository struct {
	db  *pgxpool.Pool
	rdb *redis.Client
	log *zap.Logger
}

// NewCardRepository constructs a CardRepository.
func NewCardRepository(db *pgxpool.Pool, rdb *redis.Client, log *zap.Logger) CardRepository {
	return &cardRepository{db: db, rdb: rdb, log: log}
}

func (r *cardRepository) AddCard(ctx context.Context, card *domain.UserCard) error {
	const q = `
		INSERT INTO user_cards (id, user_id, deck_id, word_id, added_at)
		VALUES ($1,$2,$3,$4,$5)
		ON CONFLICT (user_id, deck_id, word_id) DO NOTHING`
	tag, err := r.db.Exec(ctx, q, card.ID, card.UserID, card.DeckID, card.WordID, card.AddedAt)
	if err != nil {
		return fmt.Errorf("add card: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrCardAlreadyInDeck
	}
	return nil
}

func (r *cardRepository) GetCard(ctx context.Context, id uuid.UUID) (*domain.UserCard, error) {
	const q = `
		SELECT id, user_id, deck_id, word_id, suspended, added_at
		FROM user_cards WHERE id=$1`
	row := r.db.QueryRow(ctx, q, id)
	var c domain.UserCard
	err := row.Scan(&c.ID, &c.UserID, &c.DeckID, &c.WordID, &c.Suspended, &c.AddedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrCardNotFound
		}
		return nil, err
	}
	return &c, nil
}

func (r *cardRepository) RemoveCard(ctx context.Context, userID, cardID uuid.UUID) error {
	tag, err := r.db.Exec(ctx,
		`DELETE FROM user_cards WHERE id=$1 AND user_id=$2`, cardID, userID)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrCardNotFound
	}
	return nil
}

func (r *cardRepository) MarkKnown(ctx context.Context, userID, cardID uuid.UUID) error {
	tag, err := r.db.Exec(ctx,
		`UPDATE user_cards SET suspended=true WHERE id=$1 AND user_id=$2`, cardID, userID)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrCardNotFound
	}
	return nil
}

// BulkAdd inserts multiple cards, skipping duplicates — used by Anki importer.
func (r *cardRepository) BulkAdd(ctx context.Context, cards []*domain.UserCard) (added, skipped int, err error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return 0, 0, err
	}
	defer tx.Rollback(ctx) //nolint:errcheck

	const q = `
		INSERT INTO user_cards (id, user_id, deck_id, word_id, added_at)
		VALUES ($1,$2,$3,$4,$5)
		ON CONFLICT (user_id, deck_id, word_id) DO NOTHING`

	for _, c := range cards {
		tag, err := tx.Exec(ctx, q, c.ID, c.UserID, c.DeckID, c.WordID, c.AddedAt)
		if err != nil {
			r.log.Warn("bulk add card error", zap.Error(err), zap.Stringer("word_id", c.WordID))
			skipped++
			continue
		}
		if tag.RowsAffected() == 0 {
			skipped++
		} else {
			added++
		}
	}
	return added, skipped, tx.Commit(ctx)
}
