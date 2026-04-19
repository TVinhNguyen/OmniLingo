package domain

import (
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
)

// ─── Plan Tiers ────────────────────────────────────────────────────────────────

// PlanTier represents a subscription tier ordered from lowest to highest.
type PlanTier string

const (
	TierFree       PlanTier = "free"
	TierPlus       PlanTier = "plus"
	TierPro        PlanTier = "pro"
	TierUltimate   PlanTier = "ultimate"
	TierFamily     PlanTier = "family"
	TierSchools    PlanTier = "schools"
	TierEnterprise PlanTier = "enterprise"
)

// tierRank maps PlanTier to a numeric rank for comparison.
// Higher rank = higher tier.
var tierRank = map[PlanTier]int{
	TierFree:       0,
	TierPlus:       1,
	TierPro:        2,
	TierUltimate:   3,
	TierFamily:     3, // Family ≈ Pro features for members
	TierSchools:    4,
	TierEnterprise: 5,
}

// AtLeast returns true if t is at least as high as other.
func (t PlanTier) AtLeast(other PlanTier) bool {
	return tierRank[t] >= tierRank[other]
}

// IsValid returns true for a recognized tier.
func (t PlanTier) IsValid() bool {
	_, ok := tierRank[t]
	return ok
}

// ─── Plan Feature ──────────────────────────────────────────────────────────────

// PlanFeature is the canonical feature → tier mapping from plan_features table.
type PlanFeature struct {
	ID          uuid.UUID        `json:"id"`
	FeatureCode string           `json:"feature_code"`
	Description string           `json:"description"`
	MinTier     PlanTier         `json:"min_tier"`
	QuotaMap    map[string]int   `json:"quota_map"` // tier → quota (-1 = unlimited, 0 = none)
	IsActive    bool             `json:"is_active"`
	CreatedAt   time.Time        `json:"created_at"`
	UpdatedAt   time.Time        `json:"updated_at"`
}

// QuotaFor returns the quota for a given tier. Returns 0 if not found.
// -1 means unlimited.
func (f *PlanFeature) QuotaFor(tier PlanTier) int {
	if q, ok := f.QuotaMap[string(tier)]; ok {
		return q
	}
	return 0
}

// ─── User Entitlement ──────────────────────────────────────────────────────────

// UserEntitlement is the canonical per-user plan record.
type UserEntitlement struct {
	UserID        uuid.UUID        `json:"user_id"`
	PlanTier      PlanTier         `json:"plan_tier"`
	ValidUntil    *time.Time       `json:"valid_until,omitempty"` // nil = free (never expires)
	FamilyOwnerID *uuid.UUID       `json:"family_owner_id,omitempty"`
	OrgID         *uuid.UUID       `json:"org_id,omitempty"`
	Overrides     map[string]bool  `json:"overrides"` // feature_code → forced on/off
	CreatedAt     time.Time        `json:"created_at"`
	UpdatedAt     time.Time        `json:"updated_at"`
}

// IsActive returns true if this entitlement is currently valid.
// Free tier never expires. Paid tier is valid while ValidUntil is in the future.
func (e *UserEntitlement) IsActive() bool {
	if e.PlanTier == TierFree {
		return true
	}
	if e.ValidUntil == nil {
		return false // paid tier without expiry date is invalid state
	}
	return time.Now().UTC().Before(*e.ValidUntil)
}

// EffectiveTier returns the active tier, falling back to free if subscription expired.
func (e *UserEntitlement) EffectiveTier() PlanTier {
	if e.IsActive() {
		return e.PlanTier
	}
	return TierFree
}

// ─── Check Result ──────────────────────────────────────────────────────────────

// CheckResult is returned by the entitlement check endpoint.
type CheckResult struct {
	UserID      uuid.UUID `json:"user_id"`
	FeatureCode string    `json:"feature_code"`
	Allowed     bool      `json:"allowed"`
	// Quota is the per-tier quota. -1 = unlimited, 0 = not allowed.
	Quota       int       `json:"quota"`
	PlanTier    PlanTier  `json:"plan_tier"`
}

// EntitlementsResponse is returned by GET /entitlements/me
type EntitlementsResponse struct {
	UserID      uuid.UUID          `json:"user_id"`
	PlanTier    PlanTier           `json:"plan_tier"`
	ValidUntil  *time.Time         `json:"valid_until,omitempty"`
	Features    []FeatureSummary   `json:"features"`
}

// FeatureSummary is one feature entry in the /me response.
type FeatureSummary struct {
	Code    string `json:"code"`
	Allowed bool   `json:"allowed"`
	Quota   int    `json:"quota"`
}

// ─── Domain Errors ─────────────────────────────────────────────────────────────

// DomainError is a typed error with an HTTP status code.
type DomainError struct {
	Code       string
	Message    string
	StatusCode int
}

func (e *DomainError) Error() string { return e.Message }

func Errorf(code, format string, args ...any) *DomainError {
	return &DomainError{Code: code, Message: fmt.Sprintf(format, args...), StatusCode: http.StatusBadRequest}
}

var (
	ErrNotFound     = &DomainError{Code: "NOT_FOUND", Message: "resource not found", StatusCode: http.StatusNotFound}
	ErrUnauthorized = &DomainError{Code: "UNAUTHORIZED", Message: "authentication required", StatusCode: http.StatusUnauthorized}
	ErrForbidden    = &DomainError{Code: "FORBIDDEN", Message: "access forbidden", StatusCode: http.StatusForbidden}
	ErrBadRequest   = &DomainError{Code: "BAD_REQUEST", Message: "bad request", StatusCode: http.StatusBadRequest}
	ErrInternal     = &DomainError{Code: "INTERNAL_ERROR", Message: "internal server error", StatusCode: http.StatusInternalServerError}
)
