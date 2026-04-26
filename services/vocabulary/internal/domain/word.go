package domain

import (
	"time"

	"github.com/google/uuid"
)

// ─── Word Catalog (system-level) ──────────────────────────────────────────────

// Word represents a single entry in the system vocabulary catalog.
type Word struct {
	ID            uuid.UUID      `json:"id"`
	Language      string         `json:"language"`       // "ja", "en", "zh", "ko"
	Lemma         string         `json:"lemma"`          // base form
	Reading       string         `json:"reading"`        // kana for ja, pinyin for zh
	POS           string         `json:"pos"`            // part of speech: noun, verb, adj...
	IPA           string         `json:"ipa"`            // IPA pronunciation
	FrequencyRank int            `json:"frequency_rank"` // lower = more common
	Level         string         `json:"level"`          // A1, N5, HSK1...
	Extra         map[string]any `json:"extra"`          // language-specific fields (kanji radical, pinyin, etc.)
	Source        string         `json:"source,omitempty"`
	SourceID      string         `json:"source_id,omitempty"`
	Meanings      []WordMeaning  `json:"meanings"`
	Examples      []WordExample  `json:"examples"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
}

// WordMeaning holds a translation/meaning in a specific UI language.
type WordMeaning struct {
	ID         uuid.UUID `json:"id"`
	WordID     uuid.UUID `json:"word_id"`
	UILanguage string    `json:"ui_language"` // "vi", "en", "ja"
	Meaning    string    `json:"meaning"`
	OrderIdx   int       `json:"order_idx"`
}

// WordExample holds an example sentence for a word.
type WordExample struct {
	ID          uuid.UUID         `json:"id"`
	WordID      uuid.UUID         `json:"word_id"`
	Sentence    string            `json:"sentence"`
	Translation map[string]string `json:"translation"` // {"vi": "...", "en": "..."}
	AudioURL    string            `json:"audio_url"`
}

// ─── Decks ────────────────────────────────────────────────────────────────────

// Deck is a collection of words belonging to a user (or system).
type Deck struct {
	ID        uuid.UUID `json:"id"`
	OwnerID   uuid.UUID `json:"owner_id"` // user UUID or system sentinel UUID
	Language  string    `json:"language"`
	Name      string    `json:"name"`
	IsPublic  bool      `json:"is_public"`
	CardCount int       `json:"card_count"` // computed
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ─── User Cards ───────────────────────────────────────────────────────────────

// UserCard links a user to a word via a deck.
type UserCard struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	DeckID    uuid.UUID `json:"deck_id"`
	WordID    uuid.UUID `json:"word_id"`
	Suspended bool      `json:"suspended"` // true = marked known, out of SRS
	AddedAt   time.Time `json:"added_at"`
	// Enriched on read
	Word *Word `json:"word,omitempty"`
}

// ─── Request / Response DTOs ──────────────────────────────────────────────────

// SearchRequest defines parameters for word search.
type SearchRequest struct {
	Query    string   `json:"query"`
	Language string   `json:"language"`
	UILang   string   `json:"ui_lang"`
	Level    string   `json:"level"`     // optional filter
	POS      []string `json:"pos"`       // optional filter
	Page     int      `json:"page"`      // 1-indexed
	PageSize int      `json:"page_size"` // default 20, max 100
}

// LookupRequest defines parameters for exact dictionary lookup.
type LookupRequest struct {
	Language string `json:"language"`
	Word     string `json:"word"`
	UILang   string `json:"ui_lang"`
}

// DictionarySearchRequest defines compact GET search parameters for BFF auto-fill.
type DictionarySearchRequest struct {
	Query    string `json:"query"`
	Language string `json:"language"`
	UILang   string `json:"ui_lang"`
	Limit    int    `json:"limit"`
}

// SearchResult holds paginated word search results.
type SearchResult struct {
	Words    []*Word `json:"words"`
	Total    int     `json:"total"`
	Page     int     `json:"page"`
	PageSize int     `json:"page_size"`
}

// CreateDeckRequest holds input for deck creation.
type CreateDeckRequest struct {
	Language string `json:"language"`
	Name     string `json:"name"`
	IsPublic bool   `json:"is_public"`
}

// AddCardRequest holds input for adding a word to a deck.
type AddCardRequest struct {
	WordID     uuid.UUID `json:"word_id"`
	Lemma      string    `json:"lemma"`
	Meaning    string    `json:"meaning"`
	UILanguage string    `json:"ui_language"`
	IPA        string    `json:"ipa"`
	POS        string    `json:"pos"`
	Reading    string    `json:"reading"`
}

// CreateWordRequest holds input for admin word creation.
type CreateWordRequest struct {
	Language      string             `json:"language"`
	Lemma         string             `json:"lemma"`
	Reading       string             `json:"reading"`
	POS           string             `json:"pos"`
	IPA           string             `json:"ipa"`
	FrequencyRank int                `json:"frequency_rank"`
	Level         string             `json:"level"`
	Extra         map[string]any     `json:"extra"`
	Source        string             `json:"source"`
	SourceID      string             `json:"source_id"`
	Meanings      []CreateMeaningReq `json:"meanings"`
	Examples      []CreateExampleReq `json:"examples"`
}

// CreateMeaningReq is a sub-request for word meanings.
type CreateMeaningReq struct {
	UILanguage string `json:"ui_language"`
	Meaning    string `json:"meaning"`
	OrderIdx   int    `json:"order_idx"`
}

// CreateExampleReq is a sub-request for word examples.
type CreateExampleReq struct {
	Sentence    string            `json:"sentence"`
	Translation map[string]string `json:"translation"`
	AudioURL    string            `json:"audio_url"`
}
