package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/omnilingo/entitlement-service/internal/domain"
	"github.com/omnilingo/entitlement-service/internal/metrics"
	"github.com/omnilingo/entitlement-service/internal/repository"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

// ─── Service Interface ─────────────────────────────────────────────────────────

// EntitlementService is the core business logic interface.
type EntitlementService interface {
	// GetEntitlements returns all feature entitlements for the authenticated user.
	GetEntitlements(ctx context.Context, userID uuid.UUID) (*domain.EntitlementsResponse, error)

	// CheckFeature returns whether a user has access to a specific feature,
	// along with their quota for that feature.
	CheckFeature(ctx context.Context, userID uuid.UUID, featureCode string) (*domain.CheckResult, error)

	// UpsertEntitlement updates the stored plan for a user (called by Kafka consumer).
	UpsertEntitlement(ctx context.Context, e *domain.UserEntitlement) error
}

// ─── Implementation ────────────────────────────────────────────────────────────

type entitlementService struct {
	entRepo    repository.EntitlementRepository
	featureRepo repository.PlanFeatureRepository
	redis      *redis.Client
	cacheTTL   time.Duration
	log        *zap.Logger
}

func NewEntitlementService(
	entRepo repository.EntitlementRepository,
	featureRepo repository.PlanFeatureRepository,
	rdb *redis.Client,
	cacheTTLSec int,
	log *zap.Logger,
) EntitlementService {
	return &entitlementService{
		entRepo:     entRepo,
		featureRepo: featureRepo,
		redis:       rdb,
		cacheTTL:    time.Duration(cacheTTLSec) * time.Second,
		log:         log,
	}
}

// ─── GetEntitlements ───────────────────────────────────────────────────────────

func (s *entitlementService) GetEntitlements(ctx context.Context, userID uuid.UUID) (*domain.EntitlementsResponse, error) {
	ent, err := s.getEntitlement(ctx, userID)
	if err != nil {
		return nil, err
	}

	features, err := s.featureRepo.GetAll(ctx)
	if err != nil {
		s.log.Error("failed to load plan features", zap.Error(err))
		return nil, domain.ErrInternal
	}

	tier := ent.EffectiveTier()
	summaries := make([]domain.FeatureSummary, 0, len(features))
	for _, f := range features {
		quota, allowed := s.computeAccess(f, ent, tier)
		summaries = append(summaries, domain.FeatureSummary{
			Code:    f.FeatureCode,
			Allowed: allowed,
			Quota:   quota,
		})
	}

	return &domain.EntitlementsResponse{
		UserID:     userID,
		PlanTier:   tier,
		ValidUntil: ent.ValidUntil,
		Features:   summaries,
	}, nil
}

// ─── CheckFeature ──────────────────────────────────────────────────────────────

func (s *entitlementService) CheckFeature(ctx context.Context, userID uuid.UUID, featureCode string) (*domain.CheckResult, error) {
	if featureCode == "" {
		return nil, domain.ErrBadRequest
	}

	ent, err := s.getEntitlement(ctx, userID)
	if err != nil {
		return nil, err
	}

	feature, err := s.featureRepo.GetByCode(ctx, featureCode)
	if err != nil {
		return nil, domain.ErrNotFound
	}

	tier := ent.EffectiveTier()
	quota, allowed := s.computeAccess(feature, ent, tier)

	label := "denied"
	if allowed {
		label = "allowed"
	}
	metrics.EntitlementChecksTotal.WithLabelValues(string(tier), featureCode, label).Inc()

	return &domain.CheckResult{
		UserID:      userID,
		FeatureCode: featureCode,
		Allowed:     allowed,
		Quota:       quota,
		PlanTier:    tier,
	}, nil
}

// ─── UpsertEntitlement (called by Kafka consumer) ─────────────────────────────

func (s *entitlementService) UpsertEntitlement(ctx context.Context, e *domain.UserEntitlement) error {
	if err := s.entRepo.Upsert(ctx, e); err != nil {
		s.log.Error("failed to upsert entitlement",
			zap.String("user_id", e.UserID.String()),
			zap.String("tier", string(e.PlanTier)),
			zap.Error(err))
		return domain.ErrInternal
	}

	// Invalidate Redis cache so next request re-reads from DB within TTL
	cacheKey := entitlementCacheKey(e.UserID)
	if err := s.redis.Del(ctx, cacheKey).Err(); err != nil {
		// Non-fatal: cache will eventually expire within cacheTTL (5 min)
		s.log.Warn("failed to invalidate entitlement cache",
			zap.String("user_id", e.UserID.String()),
			zap.Error(err))
	}

	s.log.Info("entitlement upserted",
		zap.String("user_id", e.UserID.String()),
		zap.String("tier", string(e.PlanTier)))
	return nil
}

// ─── Internal Helpers ─────────────────────────────────────────────────────────

// getEntitlement fetches user entitlement from Redis cache first, then DB.
func (s *entitlementService) getEntitlement(ctx context.Context, userID uuid.UUID) (*domain.UserEntitlement, error) {
	cacheKey := entitlementCacheKey(userID)

	// L1: Redis
	cached, err := s.redis.Get(ctx, cacheKey).Bytes()
	if err == nil {
		var ent domain.UserEntitlement
		if jsonErr := json.Unmarshal(cached, &ent); jsonErr == nil {
			metrics.CacheHitsTotal.WithLabelValues("entitlement").Inc()
			return &ent, nil
		}
	}
	metrics.CacheMissesTotal.WithLabelValues("entitlement").Inc()

	// L2: Postgres
	ent, err := s.entRepo.Get(ctx, userID)
	if err != nil {
		s.log.Error("failed to fetch entitlement from DB",
			zap.String("user_id", userID.String()),
			zap.Error(err))
		return nil, domain.ErrInternal
	}

	// Populate cache (best-effort)
	if data, jsonErr := json.Marshal(ent); jsonErr == nil {
		if setErr := s.redis.Set(ctx, cacheKey, data, s.cacheTTL).Err(); setErr != nil {
			s.log.Warn("failed to cache entitlement", zap.String("user_id", userID.String()), zap.Error(setErr))
		}
	}

	return ent, nil
}

// computeAccess resolves access and quota for a feature given the user's entitlement.
// Override map in user_entitlements takes precedence over the plan-level rule.
func (s *entitlementService) computeAccess(
	f *domain.PlanFeature,
	ent *domain.UserEntitlement,
	tier domain.PlanTier,
) (quota int, allowed bool) {
	// Check per-user override first (admin can grant/revoke specific features)
	if override, hasOverride := ent.Overrides[f.FeatureCode]; hasOverride {
		if override {
			return -1, true // forced on
		}
		return 0, false // forced off
	}

	// Plan-level: check tier access
	quota = f.QuotaFor(tier)

	switch {
	case quota == 0:
		// Explicitly disabled for this tier
		return 0, false
	case quota == -1:
		// Unlimited
		return -1, true
	default:
		// Quota-based: allowed with the configured quota
		return quota, true
	}
}

func entitlementCacheKey(userID uuid.UUID) string {
	return fmt.Sprintf("entitlement:user:%s", userID.String())
}
