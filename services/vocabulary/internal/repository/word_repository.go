package repository

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/omnilingo/vocabulary-service/internal/domain"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

// WordRepository defines the contract for word data access.
type WordRepository interface {
	GetByID(ctx context.Context, id uuid.UUID) (*domain.Word, error)
	Lookup(ctx context.Context, req domain.LookupRequest) (*domain.Word, error)
	SearchDictionary(ctx context.Context, req domain.DictionarySearchRequest) ([]*domain.Word, error)
	Search(ctx context.Context, req domain.SearchRequest) (*domain.SearchResult, error)
	Create(ctx context.Context, w *domain.Word) error
	Update(ctx context.Context, w *domain.Word) error
}

// wordRepository is the PostgreSQL + Redis implementation.
type wordRepository struct {
	db  *pgxpool.Pool
	rdb *redis.Client
	log *zap.Logger
}

// NewWordRepository constructs a WordRepository.
func NewWordRepository(db *pgxpool.Pool, rdb *redis.Client, log *zap.Logger) WordRepository {
	return &wordRepository{db: db, rdb: rdb, log: log}
}

// ─── GetByID ──────────────────────────────────────────────────────────────────

func (r *wordRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Word, error) {
	// Check Redis cache
	cacheKey := fmt.Sprintf("vocab:word:%s", id)
	if cached, err := r.rdb.Get(ctx, cacheKey).Bytes(); err == nil {
		var w domain.Word
		if json.Unmarshal(cached, &w) == nil {
			return &w, nil
		}
	}

	// Fetch from DB
	w, err := r.fetchWordByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Populate meanings + examples
	w.Meanings, _ = r.fetchMeanings(ctx, id)
	w.Examples, _ = r.fetchExamples(ctx, id)

	// Cache for 1 hour (fail-soft)
	if data, err := json.Marshal(w); err == nil {
		r.rdb.Set(ctx, cacheKey, data, wordCacheTTL).Err() //nolint:errcheck
	}

	return w, nil
}

func (r *wordRepository) fetchWordByID(ctx context.Context, id uuid.UUID) (*domain.Word, error) {
	const q = `
		SELECT id, language, lemma, reading, pos, ipa, frequency_rank, level, extra,
		       COALESCE(source, ''), COALESCE(source_id, ''), created_at, updated_at
		FROM words WHERE id = $1`
	row := r.db.QueryRow(ctx, q, id)
	return scanWord(row)
}

// ─── Dictionary Lookup ───────────────────────────────────────────────────────

func (r *wordRepository) Lookup(ctx context.Context, req domain.LookupRequest) (*domain.Word, error) {
	req.Language = strings.TrimSpace(req.Language)
	req.Word = strings.TrimSpace(req.Word)
	if req.UILang == "" {
		req.UILang = "en"
	}
	if req.Language == "" {
		return nil, domain.ErrLanguageRequired
	}
	if req.Word == "" {
		return nil, domain.ErrSearchQueryEmpty
	}

	cacheKey := fmt.Sprintf("vocab:lookup:%s:%s:%s", req.Language, req.Word, req.UILang)
	if cached, err := r.rdb.Get(ctx, cacheKey).Bytes(); err == nil {
		var w domain.Word
		if json.Unmarshal(cached, &w) == nil {
			return &w, nil
		}
	}

	const q = `
		SELECT id, language, lemma, reading, pos, ipa, frequency_rank, level, extra,
		       COALESCE(source, ''), COALESCE(source_id, ''), created_at, updated_at
		FROM words
		WHERE language = $1
		  AND (lemma = $2 OR lower(lemma) = lower($2) OR reading = $2)
		ORDER BY CASE WHEN lemma = $2 THEN 0 WHEN reading = $2 THEN 1 ELSE 2 END,
		         frequency_rank ASC, lemma ASC
		LIMIT 1`
	w, err := scanWord(r.db.QueryRow(ctx, q, req.Language, req.Word))
	if err != nil {
		return nil, err
	}
	w.Meanings, _ = r.fetchMeaningsForLookup(ctx, w.ID, req.UILang)
	w.Examples, _ = r.fetchExamples(ctx, w.ID)

	if data, err := json.Marshal(w); err == nil {
		r.rdb.Set(ctx, cacheKey, data, 24*wordCacheTTL).Err() //nolint:errcheck
	}
	return w, nil
}

func (r *wordRepository) SearchDictionary(ctx context.Context, req domain.DictionarySearchRequest) ([]*domain.Word, error) {
	req.Language = strings.TrimSpace(req.Language)
	req.Query = strings.TrimSpace(req.Query)
	if req.UILang == "" {
		req.UILang = "en"
	}
	if req.Limit < 1 || req.Limit > 50 {
		req.Limit = 10
	}
	if req.Language == "" {
		return nil, domain.ErrLanguageRequired
	}
	if req.Query == "" {
		return nil, domain.ErrSearchQueryEmpty
	}

	const q = `
		SELECT id, language, lemma, reading, pos, ipa, frequency_rank, level, extra,
		       COALESCE(source, ''), COALESCE(source_id, ''), created_at, updated_at
		FROM words
		WHERE language = $1
		  AND (lemma % $2 OR lemma ILIKE $2 || '%' OR reading ILIKE $2 || '%')
		ORDER BY CASE WHEN lemma = $2 THEN 0 WHEN reading = $2 THEN 1 ELSE 2 END,
		         similarity(lemma, $2) DESC, frequency_rank ASC
		LIMIT $3`
	rows, err := r.db.Query(ctx, q, req.Language, req.Query, req.Limit)
	if err != nil {
		return nil, fmt.Errorf("dictionary search: %w", err)
	}
	defer rows.Close()

	words := make([]*domain.Word, 0)
	for rows.Next() {
		w, err := scanWord(rows)
		if err != nil {
			return nil, err
		}
		w.Meanings, _ = r.fetchMeaningsForLookup(ctx, w.ID, req.UILang)
		w.Examples, _ = r.fetchExamples(ctx, w.ID)
		words = append(words, w)
	}
	return words, rows.Err()
}

// ─── Search ───────────────────────────────────────────────────────────────────

func (r *wordRepository) Search(ctx context.Context, req domain.SearchRequest) (*domain.SearchResult, error) {
	if req.Page < 1 {
		req.Page = 1
	}
	if req.PageSize < 1 || req.PageSize > 100 {
		req.PageSize = 20
	}
	offset := (req.Page - 1) * req.PageSize

	// Build dynamic WHERE
	args := []any{req.Query, req.Language}
	where := []string{
		"language = $2",
		"(lemma % $1 OR lemma ILIKE $1 || '%')",
	}
	pIdx := 3
	if req.Level != "" {
		where = append(where, fmt.Sprintf("level = $%d", pIdx))
		args = append(args, req.Level)
		pIdx++
	}
	if len(req.POS) > 0 {
		where = append(where, fmt.Sprintf("pos = ANY($%d)", pIdx))
		args = append(args, req.POS)
		pIdx++
	}

	whereClause := strings.Join(where, " AND ")

	// Count
	var total int
	countQ := fmt.Sprintf("SELECT COUNT(*) FROM words WHERE %s", whereClause)
	if err := r.db.QueryRow(ctx, countQ, args...).Scan(&total); err != nil {
		return nil, fmt.Errorf("count words: %w", err)
	}

	// Data
	args = append(args, req.PageSize, offset)
	dataQ := fmt.Sprintf(`
		SELECT id, language, lemma, reading, pos, ipa, frequency_rank, level, extra,
		       COALESCE(source, ''), COALESCE(source_id, ''), created_at, updated_at
		FROM words WHERE %s
		ORDER BY frequency_rank ASC
		LIMIT $%d OFFSET $%d`, whereClause, pIdx, pIdx+1)

	rows, err := r.db.Query(ctx, dataQ, args...)
	if err != nil {
		return nil, fmt.Errorf("search words: %w", err)
	}
	defer rows.Close()

	words := make([]*domain.Word, 0)
	for rows.Next() {
		w, err := scanWord(rows)
		if err != nil {
			continue
		}
		words = append(words, w)
	}

	return &domain.SearchResult{
		Words:    words,
		Total:    total,
		Page:     req.Page,
		PageSize: req.PageSize,
	}, nil
}

// ─── Create ───────────────────────────────────────────────────────────────────

func (r *wordRepository) Create(ctx context.Context, w *domain.Word) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx) //nolint:errcheck

	extraJSON, _ := json.Marshal(w.Extra)
	const q = `
		INSERT INTO words (id, language, lemma, reading, pos, ipa, frequency_rank, level, extra, source, source_id)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NULLIF($10,''),NULLIF($11,''))
		ON CONFLICT (language, lemma, pos) DO NOTHING`
	tag, err := tx.Exec(ctx, q, w.ID, w.Language, w.Lemma, w.Reading, w.POS, w.IPA,
		w.FrequencyRank, w.Level, extraJSON, w.Source, w.SourceID)
	if err != nil {
		return fmt.Errorf("insert word: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrWordAlreadyExists
	}

	// Insert meanings
	for _, m := range w.Meanings {
		_, err := tx.Exec(ctx,
			`INSERT INTO word_meanings (id, word_id, ui_language, meaning, order_idx) VALUES ($1,$2,$3,$4,$5)`,
			uuid.New(), w.ID, m.UILanguage, m.Meaning, m.OrderIdx)
		if err != nil {
			return fmt.Errorf("insert meaning: %w", err)
		}
	}

	// Insert examples
	for _, ex := range w.Examples {
		translJSON, _ := json.Marshal(ex.Translation)
		_, err := tx.Exec(ctx,
			`INSERT INTO word_examples (id, word_id, sentence, translation, audio_url) VALUES ($1,$2,$3,$4,$5)`,
			uuid.New(), w.ID, ex.Sentence, translJSON, ex.AudioURL)
		if err != nil {
			return fmt.Errorf("insert example: %w", err)
		}
	}

	return tx.Commit(ctx)
}

// ─── Update ───────────────────────────────────────────────────────────────────

func (r *wordRepository) Update(ctx context.Context, w *domain.Word) error {
	extraJSON, _ := json.Marshal(w.Extra)
	const q = `
		UPDATE words
		SET lemma=$2, reading=$3, pos=$4, ipa=$5, frequency_rank=$6, level=$7,
		    extra=$8, source=NULLIF($9,''), source_id=NULLIF($10,''), updated_at=now()
		WHERE id=$1`
	tag, err := r.db.Exec(ctx, q, w.ID, w.Lemma, w.Reading, w.POS, w.IPA,
		w.FrequencyRank, w.Level, extraJSON, w.Source, w.SourceID)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrWordNotFound
	}
	// Invalidate cache
	r.rdb.Del(ctx, fmt.Sprintf("vocab:word:%s", w.ID)) //nolint:errcheck
	return nil
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

func scanWord(row pgx.Row) (*domain.Word, error) {
	var w domain.Word
	var extraRaw []byte
	err := row.Scan(&w.ID, &w.Language, &w.Lemma, &w.Reading, &w.POS, &w.IPA,
		&w.FrequencyRank, &w.Level, &extraRaw, &w.Source, &w.SourceID, &w.CreatedAt, &w.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrWordNotFound
		}
		return nil, err
	}
	if len(extraRaw) > 0 {
		json.Unmarshal(extraRaw, &w.Extra) //nolint:errcheck
	}
	return &w, nil
}

func (r *wordRepository) fetchMeanings(ctx context.Context, wordID uuid.UUID) ([]domain.WordMeaning, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, word_id, ui_language, meaning, order_idx FROM word_meanings WHERE word_id=$1 ORDER BY order_idx`,
		wordID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var ms []domain.WordMeaning
	for rows.Next() {
		var m domain.WordMeaning
		if err := rows.Scan(&m.ID, &m.WordID, &m.UILanguage, &m.Meaning, &m.OrderIdx); err == nil {
			ms = append(ms, m)
		}
	}
	return ms, nil
}

func (r *wordRepository) fetchMeaningsForLookup(ctx context.Context, wordID uuid.UUID, uiLang string) ([]domain.WordMeaning, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, word_id, ui_language, meaning, order_idx
		FROM word_meanings
		WHERE word_id=$1 AND (ui_language=$2 OR ui_language='en')
		ORDER BY CASE WHEN ui_language=$2 THEN 0 ELSE 1 END, order_idx`,
		wordID, uiLang)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var ms []domain.WordMeaning
	for rows.Next() {
		var m domain.WordMeaning
		if err := rows.Scan(&m.ID, &m.WordID, &m.UILanguage, &m.Meaning, &m.OrderIdx); err == nil {
			ms = append(ms, m)
		}
	}
	return ms, rows.Err()
}

func (r *wordRepository) fetchExamples(ctx context.Context, wordID uuid.UUID) ([]domain.WordExample, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, word_id, sentence, translation, audio_url FROM word_examples WHERE word_id=$1`,
		wordID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var exs []domain.WordExample
	for rows.Next() {
		var ex domain.WordExample
		var transRaw []byte
		if err := rows.Scan(&ex.ID, &ex.WordID, &ex.Sentence, &transRaw, &ex.AudioURL); err == nil {
			json.Unmarshal(transRaw, &ex.Translation) //nolint:errcheck
			exs = append(exs, ex)
		}
	}
	return exs, nil
}
