package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/omnilingo/payment-service/internal/domain"
	"github.com/omnilingo/payment-service/internal/metrics"
	"github.com/omnilingo/payment-service/internal/service"
	"go.uber.org/zap"
)

// WebhookHandler handles IPN/webhook callbacks from payment providers.
// NOTE: Webhook endpoints are NOT JWT-protected — they are secured by signature verification.
type WebhookHandler struct {
	svc service.PaymentService
	log *zap.Logger
}

func NewWebhookHandler(svc service.PaymentService, log *zap.Logger) *WebhookHandler {
	return &WebhookHandler{svc: svc, log: log}
}

// RegisterRoutes registers /webhooks/<provider> endpoints with raw body access.
func (h *WebhookHandler) RegisterRoutes(r fiber.Router) {
	wh := r.Group("/webhooks")
	wh.Post("/stripe", h.stripeWebhook)
	wh.Post("/vnpay", h.vnpayWebhook)
	wh.Post("/momo", h.momoWebhook)
	// Phase 2 stubs
	wh.Post("/apple-iap", h.notImplemented)
	wh.Post("/google-iap", h.notImplemented)
}

// stripeWebhook handles Stripe webhook events.
// Stripe sends the raw body + Stripe-Signature header.
func (h *WebhookHandler) stripeWebhook(c *fiber.Ctx) error {
	sig := c.Get("Stripe-Signature")
	if sig == "" {
		h.log.Warn("stripe webhook: missing Stripe-Signature header")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "BAD_REQUEST", "message": "missing Stripe-Signature header",
		})
	}
	return h.processWebhook(c, domain.ProviderStripe, sig)
}

// vnpayWebhook handles VNPay IPN callbacks.
// VNPay sends GET query params; we accept POST with query string body.
func (h *WebhookHandler) vnpayWebhook(c *fiber.Ctx) error {
	// VNPay signature is embedded in the query params (vnp_SecureHash)
	sig := c.Query("vnp_SecureHash")
	if sig == "" {
		// Also check body
		sig = string(c.Body()) // pass full body for ParseWebhook to extract sig itself
	}
	return h.processWebhook(c, domain.ProviderVNPay, sig)
}

// momoWebhook handles MoMo IPN callbacks.
// MoMo sends JSON POST body with an embedded "signature" field.
func (h *WebhookHandler) momoWebhook(c *fiber.Ctx) error {
	// MoMo signature is inside the JSON body — pass empty sig, adapter handles extraction
	return h.processWebhook(c, domain.ProviderMoMo, "")
}

func (h *WebhookHandler) processWebhook(c *fiber.Ctx, prov domain.ProviderType, sig string) error {
	body := c.Body()
	req := service.HandleWebhookRequest{
		Provider:  prov,
		RawBody:   body,
		Signature: sig,
	}

	if err := h.svc.HandleWebhook(c.Context(), req); err != nil {
		switch e := err.(type) {
		case *domain.DomainError:
			label := "error"
			if e.Code == "INVALID_SIGNATURE" {
				label = "invalid_sig"
			} else if e.Code == "DUPLICATE" {
				label = "duplicate"
			}
			metrics.WebhookTotal.WithLabelValues(string(prov), "", label).Inc()
			return c.Status(e.StatusCode).JSON(fiber.Map{
				"error": e.Code, "message": e.Message,
			})
		default:
			metrics.WebhookTotal.WithLabelValues(string(prov), "", "error").Inc()
			h.log.Error("webhook processing error",
				zap.String("provider", string(prov)),
				zap.Error(err))
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "INTERNAL_ERROR", "message": "webhook processing failed",
			})
		}
	}

	metrics.WebhookTotal.WithLabelValues(string(prov), "", "success").Inc()
	// Return 200 with a simple response — providers require 200 to stop retrying
	return c.JSON(fiber.Map{"received": true})
}

func (h *WebhookHandler) notImplemented(c *fiber.Ctx) error {
	return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{
		"error": "NOT_IMPLEMENTED", "message": "this payment provider is available in Phase 2",
	})
}
