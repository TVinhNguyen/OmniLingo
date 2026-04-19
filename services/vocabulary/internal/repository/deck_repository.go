package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/omnilingo/vocabulary-service/internal/domain"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

// DeckRepository defines the contract for deck data access.
type DeckRepository interface {
	ListByUser(ctx context.Context, userID uuid.UUID) ([]*domain.Deck, error)
	GetByID(ctx context.Context, id uuid.UUID) (*domain.Deck, error)
	Create(ctx context.Context, d *domain.Deck) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type deckRepository struct {
	db  *pgxpool.Pool
	rdb *redis.Client
	log *zap.Logger
}

// NewDeckRepository constructs a DeckRepository.
func NewDeckRepository(db *pgxpool.Pool, rdb *redis.Client, log *zap.Logger) DeckRepository {
	return &deckRepository{db: db, rdb: rdb, log: log}
}

func (r *deckRepository) ListByUser(ctx context.Context, userID uuid.UUID) ([]*domain.Deck, error) {
	const q = `
		SELECT d.id, d.owner_id, d.language, d.name, d.is_public, d.created_at, d.updated_at,
		       COUNT(uc.id) AS card_count
		FROM decks d
		LEFT JOIN user_cards uc ON uc.deck_id = d.id AND uc.user_id = $1
		WHERE d.owner_id = $1
		GROUP BY d.id
		ORDER BY d.created_at DESC`
	rows, err := r.db.Query(ctx, q, userID)
	if err != nil {
		return nil, fmt.Errorf("list decks: %w", err)
	}
	defer rows.Close()

	var decks []*domain.Deck
	for rows.Next() {
		d, err := scanDeck(rows)
		if err == nil {
			decks = append(decks, d)
		}
	}
	return decks, nil
}

func (r *deckRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Deck, error) {
	const q = `
		SELECT d.id, d.owner_id, d.language, d.name, d.is_public, d.created_at, d.updated_at,
		       COUNT(uc.id) AS card_count
		FROM decks d
		LEFT JOIN user_cards uc ON uc.deck_id = d.id
		WHERE d.id = $1
		GROUP BY d.id`
	row := r.db.QueryRow(ctx, q, id)
	d, err := scanDeck(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrDeckNotFound
		}
		return nil, err
	}
	return d, nil
}

func (r *deckRepository) Create(ctx context.Context, d *domain.Deck) error {
	const q = `
		INSERT INTO decks (id, owner_id, language, name, is_public)
		VALUES ($1,$2,$3,$4,$5)`
	_, err := r.db.Exec(ctx, q, d.ID, d.OwnerID, d.Language, d.Name, d.IsPublic)
	return err
}

func (r *deckRepository) Delete(ctx context.Context, id uuid.UUID) error {
	tag, err := r.db.Exec(ctx, `DELETE FROM decks WHERE id=$1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrDeckNotFound
	}
	return nil
}

func scanDeck(row pgx.Row) (*domain.Deck, error) {
	var d domain.Deck
	err := row.Scan(&d.ID, &d.OwnerID, &d.Language, &d.Name,
		&d.IsPublic, &d.CreatedAt, &d.UpdatedAt, &d.CardCount)
	if err != nil {
		return nil, err
	}
	return &d, nil
}
