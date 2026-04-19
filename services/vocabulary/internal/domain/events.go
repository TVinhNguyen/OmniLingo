package domain

import (
	"time"

	"github.com/google/uuid"
)

// ─── Kafka Event Types ────────────────────────────────────────────────────────

// CardAddedEvent is emitted when a user adds a word to a deck.
// srs-service subscribes to this to schedule the initial SRS state.
type CardAddedEvent struct {
	EventID   string    `json:"event_id"`
	UserID    uuid.UUID `json:"user_id"`
	DeckID    uuid.UUID `json:"deck_id"`
	CardID    uuid.UUID `json:"card_id"`
	WordID    uuid.UUID `json:"word_id"`
	Language  string    `json:"language"`
	Level     string    `json:"level"`
	CreatedAt time.Time `json:"created_at"`
}

// CardRemovedEvent is emitted when a user removes a card from a deck.
type CardRemovedEvent struct {
	EventID   string    `json:"event_id"`
	UserID    uuid.UUID `json:"user_id"`
	CardID    uuid.UUID `json:"card_id"`
	WordID    uuid.UUID `json:"word_id"`
	CreatedAt time.Time `json:"created_at"`
}

// CardMarkedKnownEvent is emitted when a user marks a card as already known.
type CardMarkedKnownEvent struct {
	EventID   string    `json:"event_id"`
	UserID    uuid.UUID `json:"user_id"`
	CardID    uuid.UUID `json:"card_id"`
	WordID    uuid.UUID `json:"word_id"`
	CreatedAt time.Time `json:"created_at"`
}

// DeckCreatedEvent is emitted when a user creates a new deck.
type DeckCreatedEvent struct {
	EventID   string    `json:"event_id"`
	UserID    uuid.UUID `json:"user_id"`
	DeckID    uuid.UUID `json:"deck_id"`
	Language  string    `json:"language"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

// ImportCompletedEvent is emitted after an Anki import completes.
type ImportCompletedEvent struct {
	EventID      string    `json:"event_id"`
	UserID       uuid.UUID `json:"user_id"`
	DeckID       uuid.UUID `json:"deck_id"`
	WordsAdded   int       `json:"words_added"`
	WordsSkipped int       `json:"words_skipped"`
	CreatedAt    time.Time `json:"created_at"`
}

// Kafka topic constants
const (
	TopicCardAdded        = "vocabulary.card.added"
	TopicCardRemoved      = "vocabulary.card.removed"
	TopicCardMarkedKnown  = "vocabulary.card.marked_known"
	TopicDeckCreated      = "vocabulary.deck.created"
	TopicImportCompleted  = "vocabulary.import.completed"
)
