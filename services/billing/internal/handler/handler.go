package handler

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/omnilingo/billing-service/internal/domain"
	"github.com/omnilingo/billing-service/internal/service"
	"go.uber.org/zap"
)

type BillingHandler struct {
	svc           service.BillingService
	log           *zap.Logger
	webhookSecret string
}

func New(svc service.BillingService, log *zap.Logger, webhookSecret string) *BillingHandler {
	return &BillingHandler{svc: svc, log: log, webhookSecret: webhookSecret}
}

func (h *BillingHandler) Register(r fiber.Router) {
	v1 := r.Group("/api/v1/billing")

	// Public: plan catalog
	v1.Get("/plans", h.ListPlans)
	v1.Get("/plans/:code", h.GetPlan)

	// Auth required
	v1.Get("/subscription", h.GetSubscription)
	v1.Post("/subscription", h.CreateSubscription)
	v1.Delete("/subscription/:id", h.CancelSubscription)
	v1.Get("/invoices", h.ListInvoices)
	v1.Get("/invoices/:id", h.GetInvoice)

	// Webhook — provider-authenticated (HMAC-SHA256 signature, NOT user JWT)
	v1.Post("/webhooks/payment-success", h.WebhookPaymentSuccess)
}

func (h *BillingHandler) ListPlans(c *fiber.Ctx) error {
	plans, err := h.svc.ListPlans(c.Context())
	if err != nil { return handleError(c, err) }
	return c.JSON(fiber.Map{"plans": plans})
}

func (h *BillingHandler) GetPlan(c *fiber.Ctx) error {
	plan, err := h.svc.GetPlan(c.Context(), c.Params("code"))
	if err != nil { return handleError(c, err) }
	return c.JSON(fiber.Map{"plan": plan})
}

func (h *BillingHandler) GetSubscription(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	sub, err := h.svc.GetSubscription(c.Context(), userID)
	if err != nil { return handleError(c, err) }
	return c.JSON(fiber.Map{"subscription": sub})
}

func (h *BillingHandler) CreateSubscription(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	var body struct {
		PlanCode      string `json:"plan_code"`
		Provider      string `json:"provider"`
		ProviderSubID string `json:"provider_sub_id"`
		TrialDays     int    `json:"trial_days"`
	}
	if err := c.BodyParser(&body); err != nil || body.PlanCode == "" {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "plan_code required"})
	}
	if body.Provider == "" { body.Provider = "stripe" }
	sub, err := h.svc.CreateSubscription(c.Context(), service.CreateSubRequest{
		UserID: userID, PlanCode: body.PlanCode, Provider: body.Provider,
		ProviderSubID: body.ProviderSubID, TrialDays: body.TrialDays,
	})
	if err != nil { return handleError(c, err) }
	return c.Status(201).JSON(fiber.Map{"subscription": sub})
}

func (h *BillingHandler) CancelSubscription(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	subID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "invalid subscription id"})
	}
	immediately := c.QueryBool("immediately", false)
	if err := h.svc.CancelSubscription(c.Context(), userID, subID, immediately); err != nil {
		return handleError(c, err)
	}
	return c.JSON(fiber.Map{"message": "subscription canceled"})
}

func (h *BillingHandler) ListInvoices(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	limit  := clamp(c.QueryInt("limit", 20), 1, 50)
	offset := max0(c.QueryInt("offset", 0))
	list, total, err := h.svc.ListInvoices(c.Context(), userID, limit, offset)
	if err != nil { return handleError(c, err) }
	if list == nil { list = []*domain.Invoice{} }
	return c.JSON(fiber.Map{
		"invoices": list,
		"meta":     fiber.Map{"total": total, "limit": limit, "offset": offset},
	})
}

func (h *BillingHandler) GetInvoice(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	id, err := uuid.Parse(c.Params("id"))
	if err != nil { return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "invalid invoice id"}) }
	inv, err := h.svc.GetInvoice(c.Context(), userID, id)
	if err != nil { return handleError(c, err) }
	return c.JSON(fiber.Map{"invoice": inv})
}

// WebhookPaymentSuccess handles inbound payment success callbacks from providers.
//
// Security: Verifies the X-Webhook-Signature header using HMAC-SHA256.
// The signature format is: "sha256=<hex(HMAC(secret, body))>"
// This matches the Stripe webhook signature scheme.
//
// If WebhookSecret is empty (dev mode), signature check is skipped with a warning.
func (h *BillingHandler) WebhookPaymentSuccess(c *fiber.Ctx) error {
	rawBody := c.Body()

	// ── Signature Verification ──────────────────────────────────────────────
	if h.webhookSecret != "" {
		sig := c.Get("X-Webhook-Signature")
		if sig == "" {
			h.log.Warn("webhook request missing X-Webhook-Signature")
			return c.Status(401).JSON(fiber.Map{
				"error":   "UNAUTHORIZED",
				"message": "missing webhook signature",
			})
		}
		if !verifyWebhookSig(rawBody, sig, h.webhookSecret) {
			h.log.Warn("webhook signature mismatch")
			return c.Status(401).JSON(fiber.Map{
				"error":   "UNAUTHORIZED",
				"message": "invalid webhook signature",
			})
		}
	} else {
		h.log.Warn("WEBHOOK_SECRET not configured — skipping signature verification (dev mode only)")
	}

	// ── Parse Body ──────────────────────────────────────────────────────────
	var body struct {
		Provider          string `json:"provider"`
		ProviderSubID     string `json:"provider_sub_id"`
		ProviderInvoiceID string `json:"provider_invoice_id"`
		AmountCents       int    `json:"amount_cents"`
		Currency          string `json:"currency"`
	}
	if err := c.BodyParser(&body); err != nil || body.ProviderSubID == "" {
		return c.Status(400).JSON(fiber.Map{"error": "BAD_REQUEST", "message": "provider_sub_id required"})
	}

	if err := h.svc.HandlePaymentSuccess(c.Context(), service.PaymentSuccessRequest{
		Provider:          body.Provider,
		ProviderSubID:     body.ProviderSubID,
		ProviderInvoiceID: body.ProviderInvoiceID,
		AmountCents:       body.AmountCents,
		Currency:          body.Currency,
	}); err != nil {
		if de, ok := err.(*domain.DomainError); ok && de.StatusCode == 409 {
			// Idempotent duplicate — return 200 to prevent provider retry loops
			return c.JSON(fiber.Map{"received": true, "duplicate": true})
		}
		h.log.Error("payment success handling failed", zap.Error(err))
		return handleError(c, err)
	}
	return c.JSON(fiber.Map{"received": true})
}

// verifyWebhookSig checks "sha256=<hex>" format HMAC-SHA256 signatures.
func verifyWebhookSig(body []byte, sig, secret string) bool {
	// Trim "sha256=" prefix if present
	hexSig := strings.TrimPrefix(sig, "sha256=")
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(body)
	expected := hex.EncodeToString(mac.Sum(nil))
	return hmac.Equal([]byte(hexSig), []byte(expected))
}

func handleError(c *fiber.Ctx, err error) error {
	if de, ok := err.(*domain.DomainError); ok {
		return c.Status(de.StatusCode).JSON(fiber.Map{"error": de.Code, "message": de.Message})
	}
	return c.Status(500).JSON(fiber.Map{"error": "INTERNAL_ERROR", "message": "internal server error"})
}

func clamp(v, lo, hi int) int {
	if v < lo { return lo }
	if v > hi { return hi }
	return v
}
func max0(v int) int {
	if v < 0 { return 0 }
	return v
}
