package service

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/omnilingo/vocabulary-service/internal/domain"
	"github.com/omnilingo/vocabulary-service/internal/messaging"
	"github.com/omnilingo/vocabulary-service/internal/repository"
	"go.uber.org/zap"
)

// DeckService defines business logic for deck and card management.
type DeckService interface {
	ListDecks(ctx context.Context, userID uuid.UUID) ([]*domain.Deck, error)
	GetDeck(ctx context.Context, userID, deckID uuid.UUID) (*domain.Deck, error)
	CreateDeck(ctx context.Context, userID uuid.UUID, req domain.CreateDeckRequest) (*domain.Deck, error)
	DeleteDeck(ctx context.Context, userID, deckID uuid.UUID) error
	AddCard(ctx context.Context, userID, deckID uuid.UUID, req domain.AddCardRequest) (*domain.UserCard, error)
	ListCards(ctx context.Context, userID, deckID uuid.UUID) ([]*domain.UserCard, error)
	RemoveCard(ctx context.Context, userID, deckID uuid.UUID, cardID uuid.UUID) error
	MarkKnown(ctx context.Context, userID, cardID uuid.UUID) error
}

type deckService struct {
	deckRepo repository.DeckRepository
	cardRepo repository.CardRepository
	wordRepo repository.WordRepository
	pub      messaging.Publisher
	outbox   *messaging.OutboxRepository
	log      *zap.Logger
}

// NewDeckService constructs a DeckService.
func NewDeckService(
	deckRepo repository.DeckRepository,
	cardRepo repository.CardRepository,
	wordRepo repository.WordRepository,
	pub messaging.Publisher,
	outboxRepo *messaging.OutboxRepository,
	log *zap.Logger,
) DeckService {
	return &deckService{
		deckRepo: deckRepo,
		cardRepo: cardRepo,
		wordRepo: wordRepo,
		pub:      pub,
		outbox:   outboxRepo,
		log:      log,
	}
}

func (s *deckService) ListDecks(ctx context.Context, userID uuid.UUID) ([]*domain.Deck, error) {
	return s.deckRepo.ListByUser(ctx, userID)
}

func (s *deckService) GetDeck(ctx context.Context, userID, deckID uuid.UUID) (*domain.Deck, error) {
	d, err := s.deckRepo.GetByID(ctx, deckID)
	if err != nil {
		return nil, err
	}
	// Ownership or public access check
	if d.OwnerID != userID && !d.IsPublic {
		return nil, domain.ErrDeckNotOwned
	}
	return d, nil
}

func (s *deckService) CreateDeck(ctx context.Context, userID uuid.UUID, req domain.CreateDeckRequest) (*domain.Deck, error) {
	if strings.TrimSpace(req.Name) == "" {
		return nil, domain.ErrDeckNameRequired
	}
	if req.Language == "" {
		return nil, domain.ErrLanguageRequired
	}

	d := &domain.Deck{
		ID:       uuid.New(),
		OwnerID:  userID,
		Language: req.Language,
		Name:     req.Name,
		IsPublic: req.IsPublic,
	}
	if err := s.deckRepo.Create(ctx, d); err != nil {
		return nil, err
	}

	// Outbox: durable Kafka event
	evt := &domain.DeckCreatedEvent{
		EventID:   uuid.New().String(),
		UserID:    userID,
		DeckID:    d.ID,
		Language:  d.Language,
		Name:      d.Name,
		CreatedAt: time.Now().UTC(),
	}
	if err := s.outbox.Enqueue(ctx, domain.TopicDeckCreated, evt); err != nil {
		s.log.Warn("outbox insert deck.created failed", zap.Error(err))
	}

	return d, nil
}

func (s *deckService) DeleteDeck(ctx context.Context, userID, deckID uuid.UUID) error {
	d, err := s.deckRepo.GetByID(ctx, deckID)
	if err != nil {
		return err
	}
	if d.OwnerID != userID {
		return domain.ErrDeckNotOwned
	}
	return s.deckRepo.Delete(ctx, deckID)
}

func (s *deckService) AddCard(ctx context.Context, userID, deckID uuid.UUID, req domain.AddCardRequest) (*domain.UserCard, error) {
	// Verify deck ownership
	d, err := s.deckRepo.GetByID(ctx, deckID)
	if err != nil {
		return nil, err
	}
	if d.OwnerID != userID {
		return nil, domain.ErrDeckNotOwned
	}

	wordID := req.WordID
	var word *domain.Word
	if wordID == uuid.Nil {
		word, err = s.resolveCardWord(ctx, d.Language, req)
		if err != nil {
			return nil, err
		}
		wordID = word.ID
	} else {
		word, err = s.wordRepo.GetByID(ctx, wordID)
		if err != nil {
			return nil, err
		}
	}

	now := time.Now().UTC()
	card := &domain.UserCard{
		ID:      uuid.New(),
		UserID:  userID,
		DeckID:  deckID,
		WordID:  wordID,
		AddedAt: now,
	}
	if err := s.cardRepo.AddCard(ctx, card); err != nil {
		return nil, err
	}

	// Outbox: durable Kafka event for srs-service to schedule
	evt := &domain.CardAddedEvent{
		EventID:   uuid.New().String(),
		UserID:    userID,
		DeckID:    deckID,
		CardID:    card.ID,
		WordID:    wordID,
		Language:  word.Language,
		Level:     word.Level,
		CreatedAt: now,
	}
	if err := s.outbox.Enqueue(ctx, domain.TopicCardAdded, evt); err != nil {
		s.log.Warn("outbox insert card.added failed", zap.Error(err))
	}

	card.Word = word
	return card, nil
}

func (s *deckService) resolveCardWord(ctx context.Context, language string, req domain.AddCardRequest) (*domain.Word, error) {
	lemma := strings.TrimSpace(req.Lemma)
	if lemma == "" {
		return nil, domain.ErrWordIDRequired
	}
	uiLang := strings.TrimSpace(req.UILanguage)
	if uiLang == "" {
		uiLang = "vi"
	}

	if word, err := s.wordRepo.Lookup(ctx, domain.LookupRequest{
		Language: language,
		Word:     lemma,
		UILang:   uiLang,
	}); err == nil {
		return word, nil
	} else if err != domain.ErrWordNotFound {
		return nil, err
	}

	meaning := strings.TrimSpace(req.Meaning)
	word := &domain.Word{
		ID:            uuid.New(),
		Language:      language,
		Lemma:         lemma,
		Reading:       strings.TrimSpace(req.Reading),
		POS:           strings.TrimSpace(req.POS),
		IPA:           strings.TrimSpace(req.IPA),
		FrequencyRank: 999999,
		Level:         "",
		Extra:         map[string]any{},
	}
	if meaning != "" {
		word.Meanings = []domain.WordMeaning{{
			UILanguage: uiLang,
			Meaning:    meaning,
			OrderIdx:   0,
		}}
	}
	if err := s.wordRepo.Create(ctx, word); err != nil {
		return nil, err
	}
	return word, nil
}

// ListCards returns all cards in a deck (with enriched word data).
func (s *deckService) ListCards(ctx context.Context, userID, deckID uuid.UUID) ([]*domain.UserCard, error) {
	// Verify ownership
	d, err := s.deckRepo.GetByID(ctx, deckID)
	if err != nil {
		return nil, err
	}
	if d.OwnerID != userID {
		return nil, domain.ErrDeckNotOwned
	}
	return s.cardRepo.ListByDeck(ctx, userID, deckID)
}

func (s *deckService) RemoveCard(ctx context.Context, userID, deckID uuid.UUID, cardID uuid.UUID) error {
	// Verify ownership via deck check
	d, err := s.deckRepo.GetByID(ctx, deckID)
	if err != nil {
		return err
	}
	if d.OwnerID != userID {
		return domain.ErrDeckNotOwned
	}
	if err := s.cardRepo.RemoveCard(ctx, userID, cardID); err != nil {
		return err
	}

	// Outbox: durable Kafka event
	evt := &domain.CardRemovedEvent{
		EventID:   uuid.New().String(),
		UserID:    userID,
		CardID:    cardID,
		CreatedAt: time.Now().UTC(),
	}
	if err := s.outbox.Enqueue(ctx, domain.TopicCardRemoved, evt); err != nil {
		s.log.Warn("outbox insert card.removed failed", zap.Error(err))
	}
	return nil
}

func (s *deckService) MarkKnown(ctx context.Context, userID, cardID uuid.UUID) error {
	card, err := s.cardRepo.GetCard(ctx, cardID)
	if err != nil {
		return err
	}
	if card.UserID != userID {
		return domain.ErrForbidden
	}
	if err := s.cardRepo.MarkKnown(ctx, userID, cardID); err != nil {
		return err
	}

	// Outbox: durable Kafka event
	evt := &domain.CardMarkedKnownEvent{
		EventID:   uuid.New().String(),
		UserID:    userID,
		CardID:    cardID,
		WordID:    card.WordID,
		CreatedAt: time.Now().UTC(),
	}
	if err := s.outbox.Enqueue(ctx, domain.TopicCardMarkedKnown, evt); err != nil {
		s.log.Warn("outbox insert card.marked_known failed", zap.Error(err))
	}
	return nil
}
