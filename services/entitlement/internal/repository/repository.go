package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/omnilingo/entitlement-service/internal/domain"
	"github.com/pressly/goose/v3"
)

// NewPostgres creates and validates a pgxpool connection.
func NewPostgres(ctx context.Context, dsn string) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		return nil, err
	}
	if err := pool.Ping(ctx); err != nil {
		return nil, err
	}
	return pool, nil
}

// RunMigrations runs goose up against entitlement_db.
func RunMigrations(dsn, dir string) error {
	goose.SetDialect("postgres")
	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return err
	}
	db := stdlib.OpenDB(*cfg.ConnConfig)
	defer db.Close()
	return goose.Up(db, dir)
}

// ─── PlanFeature Repository ────────────────────────────────────────────────────

// PlanFeatureRepository is the read-only interface for plan_features table.
type PlanFeatureRepository interface {
	GetAll(ctx context.Context) ([]*domain.PlanFeature, error)
	GetByCode(ctx context.Context, code string) (*domain.PlanFeature, error)
}

type featureRepo struct{ db *pgxpool.Pool }

func NewPlanFeatureRepository(db *pgxpool.Pool) PlanFeatureRepository {
	return &featureRepo{db: db}
}

func (r *featureRepo) GetAll(ctx context.Context) ([]*domain.PlanFeature, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, feature_code, COALESCE(description,''), min_tier, quota_map, is_active, created_at, updated_at
		FROM plan_features WHERE is_active = true
		ORDER BY feature_code`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var features []*domain.PlanFeature
	for rows.Next() {
		f, err := scanFeature(rows)
		if err != nil {
			return nil, err
		}
		features = append(features, f)
	}
	return features, rows.Err()
}

func (r *featureRepo) GetByCode(ctx context.Context, code string) (*domain.PlanFeature, error) {
	row := r.db.QueryRow(ctx, `
		SELECT id, feature_code, COALESCE(description,''), min_tier, quota_map, is_active, created_at, updated_at
		FROM plan_features WHERE feature_code = $1 AND is_active = true`, code)
	f, err := scanFeature(row)
	if err != nil {
		return nil, domain.ErrNotFound
	}
	return f, nil
}

// scanFeature scans either a pgx.Row or pgx.Rows into a PlanFeature.
type scannable interface{ Scan(dest ...any) error }

func scanFeature(row scannable) (*domain.PlanFeature, error) {
	f := &domain.PlanFeature{}
	var minTier string
	var quotaRaw map[string]any
	if err := row.Scan(
		&f.ID, &f.FeatureCode, &f.Description, &minTier,
		&quotaRaw, &f.IsActive, &f.CreatedAt, &f.UpdatedAt,
	); err != nil {
		return nil, err
	}
	f.MinTier = domain.PlanTier(minTier)
	// Convert map[string]any → map[string]int
	f.QuotaMap = make(map[string]int, len(quotaRaw))
	for k, v := range quotaRaw {
		switch n := v.(type) {
		case int64:
			f.QuotaMap[k] = int(n)
		case float64:
			f.QuotaMap[k] = int(n)
		}
	}
	return f, nil
}

// ─── UserEntitlement Repository ────────────────────────────────────────────────

// EntitlementRepository manages the user_entitlements table.
type EntitlementRepository interface {
	Get(ctx context.Context, userID uuid.UUID) (*domain.UserEntitlement, error)
	Upsert(ctx context.Context, e *domain.UserEntitlement) error
}

type entitlementRepo struct{ db *pgxpool.Pool }

func NewEntitlementRepository(db *pgxpool.Pool) EntitlementRepository {
	return &entitlementRepo{db: db}
}

func (r *entitlementRepo) Get(ctx context.Context, userID uuid.UUID) (*domain.UserEntitlement, error) {
	row := r.db.QueryRow(ctx, `
		SELECT user_id, plan_tier, valid_until, family_owner_id, org_id, overrides, created_at, updated_at
		FROM user_entitlements WHERE user_id = $1`, userID)

	e := &domain.UserEntitlement{}
	var tier string
	var overrides map[string]any
	if err := row.Scan(
		&e.UserID, &tier, &e.ValidUntil,
		&e.FamilyOwnerID, &e.OrgID,
		&overrides, &e.CreatedAt, &e.UpdatedAt,
	); err != nil {
		if err == pgx.ErrNoRows {
			// Return default free entitlement for unknown users — fail-open for access
			return defaultFreeEntitlement(userID), nil
		}
		return nil, err
	}
	e.PlanTier = domain.PlanTier(tier)
	// Convert overrides map[string]any → map[string]bool
	e.Overrides = make(map[string]bool, len(overrides))
	for k, v := range overrides {
		if b, ok := v.(bool); ok {
			e.Overrides[k] = b
		}
	}
	return e, nil
}

func (r *entitlementRepo) Upsert(ctx context.Context, e *domain.UserEntitlement) error {
	now := time.Now().UTC()
	if e.CreatedAt.IsZero() {
		e.CreatedAt = now
	}
	e.UpdatedAt = now

	_, err := r.db.Exec(ctx, `
		INSERT INTO user_entitlements (user_id, plan_tier, valid_until, family_owner_id, org_id, overrides, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		ON CONFLICT (user_id) DO UPDATE SET
			plan_tier       = EXCLUDED.plan_tier,
			valid_until     = EXCLUDED.valid_until,
			family_owner_id = EXCLUDED.family_owner_id,
			org_id          = EXCLUDED.org_id,
			overrides       = EXCLUDED.overrides,
			updated_at      = EXCLUDED.updated_at`,
		e.UserID, string(e.PlanTier), e.ValidUntil,
		e.FamilyOwnerID, e.OrgID,
		e.Overrides, e.CreatedAt, e.UpdatedAt,
	)
	return err
}

// defaultFreeEntitlement returns a transient free entitlement for users not yet in DB.
// This enables fail-open: new users always have free access without a separate create step.
func defaultFreeEntitlement(userID uuid.UUID) *domain.UserEntitlement {
	now := time.Now().UTC()
	return &domain.UserEntitlement{
		UserID:    userID,
		PlanTier:  domain.TierFree,
		Overrides: map[string]bool{},
		CreatedAt: now,
		UpdatedAt: now,
	}
}
