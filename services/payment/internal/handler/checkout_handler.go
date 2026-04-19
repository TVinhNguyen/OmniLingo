package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/omnilingo/payment-service/internal/domain"
	"github.com/omnilingo/payment-service/internal/metrics"
	"github.com/omnilingo/payment-service/internal/middleware"
	"github.com/omnilingo/payment-service/internal/service"
	"go.uber.org/zap"
)

// CheckoutHandler handles payment checkout requests.
type CheckoutHandler struct {
	svc service.PaymentService
	log *zap.Logger
}

func NewCheckoutHandler(svc service.PaymentService, log *zap.Logger) *CheckoutHandler {
	return &CheckoutHandler{svc: svc, log: log}
}

// RegisterRoutes registers checkout and intent routes on the given fiber.Router.
func (h *CheckoutHandler) RegisterRoutes(r fiber.Router, auth *middleware.JWKSAuth) {
	protected := r.Group("/payments", auth.Handler())
	protected.Post("/checkout", h.CreateCheckout)
	protected.Get("/intents/:id", h.GetIntent)
}

// ─── Request / Response DTOs ──────────────────────────────────────────────────

type createCheckoutReq struct {
	PlanCode    string `json:"plan_code"  validate:"required"`
	PriceID     string `json:"price_id"`   // provider-specific price code (required for Stripe)
	Provider    string `json:"provider"   validate:"required,oneof=stripe vnpay momo"`
	AmountCents int    `json:"amount_cents" validate:"required,gt=0"`
	Currency    string `json:"currency"   validate:"required,len=3"`
	Interval    string `json:"interval"   validate:"required,oneof=month year"`
	ReturnURL   string `json:"return_url" validate:"required,url"`
	CancelURL   string `json:"cancel_url"`
}

// CreateCheckout godoc
// POST /api/v1/payments/checkout
// Creates a checkout session with the specified provider.
func (h *CheckoutHandler) CreateCheckout(c *fiber.Ctx) error {
	userID, ok := middleware.UserIDFromCtx(c)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "UNAUTHORIZED", "message": "authentication required",
		})
	}

	var req createCheckoutReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "BAD_REQUEST", "message": "invalid request body",
		})
	}
	if err := validateCheckout(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "BAD_REQUEST", "message": err.Error(),
		})
	}

	cancelURL := req.CancelURL
	if cancelURL == "" {
		cancelURL = req.ReturnURL
	}

	svcReq := service.CreateCheckoutRequest{
		UserID:      userID,
		PlanCode:    req.PlanCode,
		PriceID:     req.PriceID,
		Provider:    domain.ProviderType(req.Provider),
		AmountCents: req.AmountCents,
		Currency:    req.Currency,
		Interval:    req.Interval,
		ReturnURL:   req.ReturnURL,
		CancelURL:   cancelURL,
	}

	intent, err := h.svc.CreateCheckout(c.Context(), svcReq)
	if err != nil {
		return mapError(c, err)
	}

	metrics.CheckoutTotal.WithLabelValues(req.Provider, "success").Inc()
	h.log.Info("checkout session created",
		zap.String("provider", req.Provider),
		zap.String("plan_code", req.PlanCode),
		zap.String("intent_id", intent.ID.String()))

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"intent": intent,
	})
}

// GetIntent godoc
// GET /api/v1/payments/intents/:id
func (h *CheckoutHandler) GetIntent(c *fiber.Ctx) error {
	userID, ok := middleware.UserIDFromCtx(c)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "UNAUTHORIZED", "message": "authentication required",
		})
	}

	intentID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "BAD_REQUEST", "message": "invalid intent id",
		})
	}

	intent, err := h.svc.GetIntent(c.Context(), userID, intentID)
	if err != nil {
		return mapError(c, err)
	}

	return c.JSON(fiber.Map{"intent": intent})
}

// ─── Input validation ─────────────────────────────────────────────────────────

func validateCheckout(req *createCheckoutReq) error {
	if req.PlanCode == "" {
		return &domain.DomainError{Code: "BAD_REQUEST", Message: "plan_code is required"}
	}
	switch domain.ProviderType(req.Provider) {
	case domain.ProviderStripe, domain.ProviderVNPay, domain.ProviderMoMo:
	default:
		return &domain.DomainError{Code: "BAD_REQUEST", Message: "unsupported provider: " + req.Provider}
	}
	if req.AmountCents <= 0 {
		return &domain.DomainError{Code: "BAD_REQUEST", Message: "amount_cents must be positive"}
	}
	if len(req.Currency) != 3 {
		return &domain.DomainError{Code: "BAD_REQUEST", Message: "currency must be 3-letter ISO code"}
	}
	if req.Interval != "month" && req.Interval != "year" {
		return &domain.DomainError{Code: "BAD_REQUEST", Message: "interval must be 'month' or 'year'"}
	}
	if req.ReturnURL == "" {
		return &domain.DomainError{Code: "BAD_REQUEST", Message: "return_url is required"}
	}
	return nil
}
