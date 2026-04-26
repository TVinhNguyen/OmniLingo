package service

import (
	"context"
	"strings"

	"github.com/google/uuid"
	"github.com/omnilingo/vocabulary-service/internal/domain"
	"github.com/omnilingo/vocabulary-service/internal/repository"
	"go.uber.org/zap"
)

// WordService defines the business logic for word catalog operations.
type WordService interface {
	GetByID(ctx context.Context, id uuid.UUID) (*domain.Word, error)
	Lookup(ctx context.Context, req domain.LookupRequest) (*domain.Word, error)
	SearchDictionary(ctx context.Context, req domain.DictionarySearchRequest) ([]*domain.Word, error)
	Search(ctx context.Context, req domain.SearchRequest) (*domain.SearchResult, error)
	CreateWord(ctx context.Context, req domain.CreateWordRequest) (*domain.Word, error)
	UpdateWord(ctx context.Context, id uuid.UUID, req domain.CreateWordRequest) (*domain.Word, error)
}

type wordService struct {
	wordRepo repository.WordRepository
	log      *zap.Logger
}

// NewWordService constructs a WordService.
func NewWordService(wordRepo repository.WordRepository, log *zap.Logger) WordService {
	return &wordService{wordRepo: wordRepo, log: log}
}

func (s *wordService) GetByID(ctx context.Context, id uuid.UUID) (*domain.Word, error) {
	return s.wordRepo.GetByID(ctx, id)
}

func (s *wordService) Lookup(ctx context.Context, req domain.LookupRequest) (*domain.Word, error) {
	return s.wordRepo.Lookup(ctx, req)
}

func (s *wordService) SearchDictionary(ctx context.Context, req domain.DictionarySearchRequest) ([]*domain.Word, error) {
	return s.wordRepo.SearchDictionary(ctx, req)
}

func (s *wordService) Search(ctx context.Context, req domain.SearchRequest) (*domain.SearchResult, error) {
	if strings.TrimSpace(req.Query) == "" && req.Language == "" {
		return nil, domain.ErrSearchQueryEmpty
	}
	return s.wordRepo.Search(ctx, req)
}

func (s *wordService) CreateWord(ctx context.Context, req domain.CreateWordRequest) (*domain.Word, error) {
	if err := validateCreateWord(req); err != nil {
		return nil, err
	}
	w := &domain.Word{
		ID:            uuid.New(),
		Language:      req.Language,
		Lemma:         req.Lemma,
		Reading:       req.Reading,
		POS:           req.POS,
		IPA:           req.IPA,
		FrequencyRank: req.FrequencyRank,
		Level:         req.Level,
		Extra:         req.Extra,
		Source:        req.Source,
		SourceID:      req.SourceID,
	}
	for _, m := range req.Meanings {
		w.Meanings = append(w.Meanings, domain.WordMeaning{
			UILanguage: m.UILanguage,
			Meaning:    m.Meaning,
			OrderIdx:   m.OrderIdx,
		})
	}
	for _, ex := range req.Examples {
		w.Examples = append(w.Examples, domain.WordExample{
			Sentence:    ex.Sentence,
			Translation: ex.Translation,
			AudioURL:    ex.AudioURL,
		})
	}
	if err := s.wordRepo.Create(ctx, w); err != nil {
		return nil, err
	}
	return w, nil
}

func (s *wordService) UpdateWord(ctx context.Context, id uuid.UUID, req domain.CreateWordRequest) (*domain.Word, error) {
	w, err := s.wordRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	w.Lemma = req.Lemma
	w.Reading = req.Reading
	w.POS = req.POS
	w.IPA = req.IPA
	w.FrequencyRank = req.FrequencyRank
	w.Level = req.Level
	w.Extra = req.Extra
	w.Source = req.Source
	w.SourceID = req.SourceID
	if err := s.wordRepo.Update(ctx, w); err != nil {
		return nil, err
	}
	return w, nil
}

func validateCreateWord(req domain.CreateWordRequest) error {
	if req.Language == "" {
		return domain.ErrLanguageRequired
	}
	if strings.TrimSpace(req.Lemma) == "" {
		return domain.ErrInvalidInput
	}
	return nil
}
