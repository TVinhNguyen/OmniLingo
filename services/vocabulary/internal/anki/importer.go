package anki

import (
	"archive/zip"
	"bytes"
	"context"
	"database/sql"
	"fmt"
	"io"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/omnilingo/pkg/outbox"
	"github.com/omnilingo/vocabulary-service/internal/domain"
	"github.com/omnilingo/vocabulary-service/internal/messaging"
	"github.com/omnilingo/vocabulary-service/internal/repository"
	_ "github.com/mattn/go-sqlite3" // SQLite driver
	"go.uber.org/zap"
)

// Importer parses Anki .apkg files and inserts cards into a user deck.
type Importer struct {
	wordRepo repository.WordRepository
	cardRepo repository.CardRepository
	deckRepo repository.DeckRepository
	pub      messaging.Publisher
	outbox   *outbox.Repository
	log      *zap.Logger
}

// NewImporter constructs an Anki Importer.
func NewImporter(
	wordRepo repository.WordRepository,
	cardRepo repository.CardRepository,
	deckRepo repository.DeckRepository,
	pub messaging.Publisher,
	outboxRepo *outbox.Repository,
	log *zap.Logger,
) *Importer {
	return &Importer{
		wordRepo: wordRepo,
		cardRepo: cardRepo,
		deckRepo: deckRepo,
		pub:      pub,
		outbox:   outboxRepo,
		log:      log,
	}
}

// ImportResult holds the result of an Anki import.
type ImportResult struct {
	DeckID   uuid.UUID `json:"deck_id"`
	Added    int       `json:"words_added"`
	Skipped  int       `json:"words_skipped"`
	Language string    `json:"language"`
}

// Import processes an .apkg byte blob and creates a new deck for the user.
func (im *Importer) Import(ctx context.Context, userID uuid.UUID, language, deckName string, data []byte) (*ImportResult, error) {
	// Step 1: Open zip archive (apkg is a zip)
	zr, err := zip.NewReader(bytes.NewReader(data), int64(len(data)))
	if err != nil {
		return nil, domain.ErrAnkiParseFailed
	}

	// Step 2: Extract collection.anki2 (SQLite DB)
	var dbBytes []byte
	for _, f := range zr.File {
		if filepath.Base(f.Name) == "collection.anki2" || filepath.Base(f.Name) == "collection.anki21" {
			rc, err := f.Open()
			if err != nil {
				return nil, domain.ErrAnkiParseFailed
			}
			dbBytes, err = io.ReadAll(rc)
			rc.Close()
			if err != nil {
				return nil, domain.ErrAnkiParseFailed
			}
			break
		}
	}
	if len(dbBytes) == 0 {
		return nil, domain.ErrAnkiParseFailed
	}

	// Step 3: Open SQLite in-memory from bytes
	tmpFile := fmt.Sprintf("/tmp/anki_%s.db", uuid.New().String())
	if err := writeTemp(tmpFile, dbBytes); err != nil {
		return nil, domain.ErrAnkiParseFailed
	}

	db, err := sql.Open("sqlite3", tmpFile)
	if err != nil {
		return nil, domain.ErrAnkiParseFailed
	}
	defer db.Close()

	// Step 4: Query notes (front/back flashcards)
	rows, err := db.QueryContext(ctx, `SELECT flds FROM notes LIMIT 1000`)
	if err != nil {
		return nil, domain.ErrAnkiParseFailed
	}
	defer rows.Close()

	// Step 5: Create a new deck for this import
	deck := &domain.Deck{
		ID:       uuid.New(),
		OwnerID:  userID,
		Language: language,
		Name:     deckName,
		IsPublic: false,
	}
	if err := im.deckRepo.Create(ctx, deck); err != nil {
		return nil, fmt.Errorf("create import deck: %w", err)
	}

	// Step 6: For each note, upsert word + add card
	var cards []*domain.UserCard
	skipped := 0

	for rows.Next() {
		var flds string
		if err := rows.Scan(&flds); err != nil {
			skipped++
			continue
		}
		// Anki fields are separated by 0x1f
		parts := strings.SplitN(flds, "\x1f", 2)
		if len(parts) < 1 || strings.TrimSpace(parts[0]) == "" {
			skipped++
			continue
		}
		front := strings.TrimSpace(parts[0])
		back := ""
		if len(parts) == 2 {
			back = strings.TrimSpace(parts[1])
		}

		// Upsert word into catalog
		wordReq := domain.CreateWordRequest{
			Language: language,
			Lemma:    front,
			POS:      "unknown",
			Meanings: []domain.CreateMeaningReq{
				{UILanguage: "en", Meaning: back},
			},
		}
		word := &domain.Word{
			ID:       uuid.New(),
			Language: language,
			Lemma:    front,
			POS:      "unknown",
			Meanings: []domain.WordMeaning{{UILanguage: "en", Meaning: back}},
		}
		// Try to create; if conflict, just find by lemma (simplified)
		if err := im.wordRepo.Create(ctx, word); err != nil {
			// Word likely exists: do a search to find it
			result, searchErr := im.wordRepo.Search(ctx, domain.SearchRequest{
				Query:    front,
				Language: language,
				Page:     1,
				PageSize: 1,
			})
			if searchErr != nil || len(result.Words) == 0 {
				im.log.Warn("anki import: cannot find/create word", zap.String("lemma", front))
				skipped++
				continue
			}
			word = result.Words[0]
		}
		_ = wordReq // used above

		cards = append(cards, &domain.UserCard{
			ID:      uuid.New(),
			UserID:  userID,
			DeckID:  deck.ID,
			WordID:  word.ID,
			AddedAt: time.Now().UTC(),
		})
	}

	// Step 7: Bulk insert cards
	added, sk, err := im.cardRepo.BulkAdd(ctx, cards)
	if err != nil {
		im.log.Error("anki bulk add error", zap.Error(err))
	}
	skipped += sk

	// Step 8: Emit completion event
	evt := &domain.ImportCompletedEvent{
		EventID:      uuid.New().String(),
		UserID:       userID,
		DeckID:       deck.ID,
		WordsAdded:   added,
		WordsSkipped: skipped,
		CreatedAt:    time.Now().UTC(),
	}
	if err := im.outbox.Enqueue(ctx, domain.TopicImportCompleted, evt); err != nil {
		im.log.Warn("outbox insert import.completed failed", zap.Error(err))
	}

	return &ImportResult{
		DeckID:   deck.ID,
		Added:    added,
		Skipped:  skipped,
		Language: language,
	}, nil
}

func writeTemp(path string, data []byte) error {
	f, err := createFile(path)
	if err != nil {
		return err
	}
	_, err = f.Write(data)
	f.Close()
	return err
}
