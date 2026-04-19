package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/omnilingo/entitlement-service/internal/domain"
	"github.com/omnilingo/entitlement-service/internal/middleware"
	"github.com/omnilingo/entitlement-service/internal/service"
	"go.uber.org/zap"
)

// EntitlementHandler handles GET /entitlements/me and GET /entitlements/check
type EntitlementHandler struct {
	svc service.EntitlementService
	log *zap.Logger
}

func NewEntitlementHandler(svc service.EntitlementService, log *zap.Logger) *EntitlementHandler {
	return &EntitlementHandler{svc: svc, log: log}
}

// RegisterRoutes attaches routes to the given router (all require JWT auth).
func (h *EntitlementHandler) RegisterRoutes(r fiber.Router, auth *middleware.JWKSAuth) {
	g := r.Group("/entitlements", auth.Handler())
	g.Get("/me", h.GetMyEntitlements)
	g.Get("/check", h.CheckFeature)
	g.Get("/check/:feature", h.CheckFeature) // convenience path param alias
}

// GetMyEntitlements godoc
// GET /api/v1/entitlements/me
// Returns all features with allowed/quota for the authenticated user.
func (h *EntitlementHandler) GetMyEntitlements(c *fiber.Ctx) error {
	userID, ok := middleware.UserIDFromCtx(c)
	if !ok {
		return unauthorized(c)
	}

	resp, err := h.svc.GetEntitlements(c.Context(), userID)
	if err != nil {
		return mapError(c, err)
	}

	return c.JSON(resp)
}

// CheckFeature godoc
// GET /api/v1/entitlements/check?feature=<code>
// GET /api/v1/entitlements/check/<code>
// Returns whether the authenticated user has access to the feature.
func (h *EntitlementHandler) CheckFeature(c *fiber.Ctx) error {
	userID, ok := middleware.UserIDFromCtx(c)
	if !ok {
		return unauthorized(c)
	}

	// Support both ?feature=... and /:feature path param
	featureCode := c.Query("feature")
	if featureCode == "" {
		featureCode = c.Params("feature")
	}
	if featureCode == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "BAD_REQUEST", "message": "feature query param is required",
		})
	}

	result, err := h.svc.CheckFeature(c.Context(), userID, featureCode)
	if err != nil {
		return mapError(c, err)
	}

	return c.JSON(result)
}

// ─── Admin endpoint (internal, for testing / support) ─────────────────────────

// AdminHandler handles internal admin operations.
// In production, expose only through internal network (not public-facing).
type AdminHandler struct {
	svc service.EntitlementService
	log *zap.Logger
}

func NewAdminHandler(svc service.EntitlementService, log *zap.Logger) *AdminHandler {
	return &AdminHandler{svc: svc, log: log}
}

func (h *AdminHandler) RegisterRoutes(r fiber.Router) {
	// Internal-only endpoint: override user entitlement (for support team).
	// In production, secure with internal API key or network-level restriction.
	r.Post("/internal/entitlements/:user_id/upsert", h.UpsertEntitlement)
}

type upsertRequest struct {
	PlanTier   string  `json:"plan_tier"`
	ValidUntil *string `json:"valid_until"` // RFC3339 or null
}

func (h *AdminHandler) UpsertEntitlement(c *fiber.Ctx) error {
	userID, err := uuid.Parse(c.Params("user_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "BAD_REQUEST", "message": "invalid user_id",
		})
	}

	var req upsertRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "BAD_REQUEST", "message": "invalid request body",
		})
	}

	tier := domain.PlanTier(req.PlanTier)
	if !tier.IsValid() {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "BAD_REQUEST", "message": "unknown plan_tier: " + req.PlanTier,
		})
	}

	ent := &domain.UserEntitlement{
		UserID:    userID,
		PlanTier:  tier,
		Overrides: map[string]bool{},
	}

	if err := h.svc.UpsertEntitlement(c.Context(), ent); err != nil {
		return mapError(c, err)
	}

	h.log.Info("admin upserted entitlement",
		zap.String("user_id", userID.String()),
		zap.String("tier", req.PlanTier))

	return c.JSON(fiber.Map{"ok": true})
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

func mapError(c *fiber.Ctx, err error) error {
	if de, ok := err.(*domain.DomainError); ok {
		return c.Status(de.StatusCode).JSON(fiber.Map{
			"error": de.Code, "message": de.Message,
		})
	}
	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		"error": "INTERNAL_ERROR", "message": "internal server error",
	})
}

func unauthorized(c *fiber.Ctx) error {
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"error": "UNAUTHORIZED", "message": "authentication required",
	})
}
