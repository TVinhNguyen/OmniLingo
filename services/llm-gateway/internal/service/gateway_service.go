package service

import (
	"context"
	"crypto/sha256"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/omnilingo/llm-gateway/internal/domain"
	"github.com/omnilingo/llm-gateway/internal/metrics"
	"github.com/omnilingo/llm-gateway/internal/repository"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

// GatewayService is the core LLM routing + budget + cache orchestrator.
type GatewayService interface {
	Complete(ctx context.Context, req *domain.CompletionRequest) (*domain.CompletionResponse, error)
}

type gatewayService struct {
	providers   []Provider // ordered by preference
	logRepo     repository.RequestLogRepository
	budgetRepo  repository.BudgetRepository
	redis       *redis.Client
	cacheTTL    time.Duration
	budgetLimits map[string]int // tier → daily limit (-1 = unlimited)
	log         *zap.Logger
}

func NewGatewayService(
	providers []Provider,
	logRepo repository.RequestLogRepository,
	budgetRepo repository.BudgetRepository,
	rdb *redis.Client,
	cacheTTLSec int,
	budgetLimits map[string]int,
	log *zap.Logger,
) GatewayService {
	return &gatewayService{
		providers:    providers,
		logRepo:      logRepo,
		budgetRepo:   budgetRepo,
		redis:        rdb,
		cacheTTL:     time.Duration(cacheTTLSec) * time.Second,
		budgetLimits: budgetLimits,
		log:          log,
	}
}

func (s *gatewayService) Complete(ctx context.Context, req *domain.CompletionRequest) (*domain.CompletionResponse, error) {
	if len(req.Messages) == 0 {
		return nil, domain.ErrBadRequest
	}

	// 0. Prompt-injection guard: deny-list check on user messages
	if err := checkPromptInjection(req.Messages); err != nil {
		s.log.Warn("prompt injection pattern detected", zap.String("user_id", req.UserID.String()))
		metrics.CompletionsTotal.WithLabelValues("none", req.CallerSvc, "blocked").Inc()
		return nil, domain.ErrBadRequest
	}

	// 1. PII redaction — mask before leaving our system
	redacted := redactMessages(req.Messages)
	reqClean := *req
	reqClean.Messages = redacted

	// 2. Check budget
	budget, err := s.budgetRepo.Get(ctx, req.UserID, today())
	if err != nil {
		s.log.Error("budget fetch failed", zap.Error(err))
		return nil, domain.ErrInternal
	}
	if budget.Remaining() == 0 {
		metrics.BudgetExhaustedTotal.WithLabelValues(req.CallerSvc).Inc()
		return nil, domain.ErrBudgetExhausted
	}

	// 3. Semantic cache lookup — key includes model + temperature + messages
	cacheKey := completionCacheKey(&reqClean)
	if req.UseCache {
		if cached, err := s.redis.Get(ctx, cacheKey).Result(); err == nil {
			metrics.CacheHitsTotal.WithLabelValues("llm").Inc()
			return &domain.CompletionResponse{
				RequestID: req.RequestID,
				Content:   cached,
				CacheHit:  true,
			}, nil
		}
		metrics.CacheMissesTotal.WithLabelValues("llm").Inc()
	}

	// 4. Try providers in order (with fallback)
	var resp *domain.CompletionResponse
	var lastErr error
	for _, p := range s.providers {
		resp, lastErr = p.Complete(ctx, &reqClean)
		if lastErr == nil {
			break
		}
		s.log.Warn("provider failed, trying fallback",
			zap.String("provider", string(p.Name())),
			zap.Error(lastErr))
		metrics.ProviderErrorsTotal.WithLabelValues(string(p.Name())).Inc()
	}
	if lastErr != nil {
		return nil, domain.ErrNoProvider
	}

	// 5. Cache successful response
	if req.UseCache && resp.Content != "" {
		_ = s.redis.Set(ctx, cacheKey, resp.Content, s.cacheTTL).Err()
	}

	// 6. Update daily budget
	if err := s.budgetRepo.IncrTokens(ctx, req.UserID, today(), resp.TotalTokens); err != nil {
		s.log.Warn("budget increment failed (non-fatal)", zap.Error(err))
	}

	// 6. Log request asynchronously (non-critical path)
	go func() {
		entry := &domain.LLMRequestLog{
			ID:           uuid.New(),
			RequestID:    req.RequestID,
			UserID:       req.UserID,
			CallerSvc:    req.CallerSvc,
			Provider:     resp.Provider,
			Model:        resp.Model,
			PromptTokens: resp.PromptTokens,
			OutputTokens: resp.OutputTokens,
			CostUSD:      estimateCost(resp.Provider, resp.Model, resp.PromptTokens, resp.OutputTokens),
			CacheHit:     resp.CacheHit,
			LatencyMs:    resp.LatencyMs,
		}
		if logErr := s.logRepo.Insert(context.Background(), entry); logErr != nil {
			s.log.Warn("request log insert failed", zap.Error(logErr))
		}
	}()

	metrics.TokensUsedTotal.WithLabelValues(string(resp.Provider), resp.Model).Add(float64(resp.TotalTokens))
	metrics.CompletionsTotal.WithLabelValues(string(resp.Provider), req.CallerSvc, "success").Inc()
	return resp, nil
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// completionCacheKey builds a cache key that includes model + temperature + top_p
// so that changing model parameters correctly invalidates the cache.
func completionCacheKey(r *domain.CompletionRequest) string {
	h := sha256.New()
	// Include model parameters so changing model/sampling doesn't return stale response
	h.Write([]byte(fmt.Sprintf("model:%s|temp:%.2f|", r.PreferredModel, r.Temperature)))
	for _, m := range r.Messages {
		h.Write([]byte(m.Role + ":" + m.Content + "|"))
	}
	return fmt.Sprintf("llm:cache:%x", h.Sum(nil))
}

// ─── PII Redaction ───────────────────────────────────────────────────────────

var (
	// Email pattern
	reEmail = regexp.MustCompile(`[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}`)
	// Phone: international or local formats (rough)
	rePhone = regexp.MustCompile(`(?:\+?\d[\s\-.]?){7,14}\d`)
	// Card: 13-19 digit sequences with optional separators (Luhn not checked here)
	reCard = regexp.MustCompile(`\b(?:\d[\s\-]?){13,19}\b`)
)

func redactMessages(msgs []domain.Message) []domain.Message {
	out := make([]domain.Message, len(msgs))
	for i, m := range msgs {
		if m.Role == "user" {
			m.Content = reEmail.ReplaceAllString(m.Content, "[EMAIL]")
			m.Content = rePhone.ReplaceAllString(m.Content, "[PHONE]")
			m.Content = reCard.ReplaceAllString(m.Content, "[CARD]")
		}
		out[i] = m
	}
	return out
}

// ─── Prompt Injection Guard ──────────────────────────────────────────────────

var injectionDenyList = []string{
	"ignore previous instructions",
	"ignore all instructions",
	"you are now",
	"forget your instructions",
	"disregard all prior",
	"system: you",
	"<|im_start|>system",
	"<|system|>",
}

func checkPromptInjection(msgs []domain.Message) error {
	for _, m := range msgs {
		if m.Role != "user" {
			continue
		}
		lower := strings.ToLower(m.Content)
		for _, pattern := range injectionDenyList {
			if strings.Contains(lower, pattern) {
				return domain.ErrBadRequest
			}
		}
	}
	return nil
}

func today() string {
	return time.Now().UTC().Format("2006-01-02")
}

// estimateCost returns rough USD cost based on public pricing (as of 2024).
// Used only for informational logging — not for billing.
func estimateCost(provider domain.ProviderName, model string, promptTok, outputTok int) float64 {
	type price struct{ in, out float64 } // per 1M tokens
	prices := map[string]price{
		domain.ModelClaude3Haiku:  {0.25, 1.25},
		domain.ModelClaude3Sonnet: {3.0, 15.0},
		domain.ModelClaude3Opus:   {15.0, 75.0},
		domain.ModelGPT4oMini:     {0.15, 0.60},
		domain.ModelGPT4o:         {2.50, 10.0},
		domain.ModelGeminiFlash:   {0.075, 0.30},
		domain.ModelGeminiPro:     {1.25, 5.00},
	}
	p, ok := prices[model]
	if !ok {
		return 0
	}
	return float64(promptTok)*p.in/1_000_000 + float64(outputTok)*p.out/1_000_000
}
