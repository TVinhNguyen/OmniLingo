package handler

import (
	"context"
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/omnilingo/omnilingo/services/identity/internal/domain"
	"github.com/omnilingo/omnilingo/services/identity/internal/middleware"
	"github.com/omnilingo/omnilingo/services/identity/internal/service"
)

// RegisterRoutes mounts all API routes onto the v1 router group.
func RegisterRoutes(v1 fiber.Router, svc service.AuthService, log *zap.Logger) {
	jwtMW := middleware.JWTAuth(svc.GetPublicKey())

	// ── Auth (public) ──────────────────────────────────────────────────────────
	auth := v1.Group("/auth")
	auth.Post("/register",      registerHandler(svc))
	auth.Post("/login",         loginHandler(svc))
	auth.Post("/refresh",       refreshHandler(svc))
	auth.Post("/logout",        logoutHandler(svc))
	auth.Post("/verify-email",  verifyEmailHandler(svc))

	// OAuth callback stubs (Phase 2 — requires OAuth flow implementation)
	auth.Post("/oauth/:provider/callback", oauthCallbackStub())

	// MFA stubs (Phase 2)
	auth.Post("/mfa/enroll",  mfaStub("MFA enrollment is planned for Phase 2"))
	auth.Post("/mfa/verify",  mfaStub("MFA verification is planned for Phase 2"))

	// Password reset
	auth.Post("/forgot-password",  forgotPasswordHandler(svc))
	auth.Post("/reset-password",   resetPasswordHandler(svc))

	// ── Users (protected) ──────────────────────────────────────────────────────
	users := v1.Group("/users", jwtMW)
	users.Get("/me",          getMeHandler(svc))
	users.Patch("/me",        patchMeHandler(svc))
	users.Delete("/me",       deleteMeHandler(svc))

	// Session management
	users.Get("/sessions",           listSessionsHandler(svc))
	users.Delete("/sessions/:id",    revokeSessionHandler(svc))
	users.Post("/me/change-password", changePasswordHandler(svc))

	// Internal (called by other services — in prod: restrict via service mesh)
	v1.Get("/users/:id", jwtMW, getUserByIDHandler(svc))
}

// ─── Auth Handlers ────────────────────────────────────────────────────────────

type registerReq struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	DisplayName string `json:"display_name"`
	UILanguage  string `json:"ui_language"`
}

func registerHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req registerReq
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
		}
		if req.Email == "" || req.Password == "" || req.DisplayName == "" {
			return fiber.NewError(fiber.StatusBadRequest, "email, password, and display_name are required")
		}
		if len(req.Password) < 10 {
			return fiber.NewError(fiber.StatusBadRequest, "password must be at least 10 characters")
		}

		user, err := svc.Register(c.Context(), service.RegisterRequest{
			Email:       req.Email,
			Password:    req.Password,
			DisplayName: req.DisplayName,
			UILanguage:  req.UILanguage,
			IP:          c.IP(),
			DeviceInfo:  c.Get("User-Agent"),
			RequestID:   c.Locals("request_id").(string),
		})
		if err != nil {
			return mapDomainError(err)
		}

		// Send verification email asynchronously — must use background context,
		// not c.Context() which is cancelled when the request handler returns.
		go func(uid uuid.UUID) {
			_ = svc.SendVerificationEmail(context.Background(), uid)
		}(user.ID)

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"user": user})
	}
}

type loginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	DeviceID string `json:"device_id"`
}

func loginHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req loginReq
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
		}

		tokens, err := svc.Login(c.Context(), service.LoginRequest{
			Email:      req.Email,
			Password:   req.Password,
			DeviceID:   req.DeviceID,
			DeviceInfo: c.Get("User-Agent"),
			IP:         c.IP(),
			RequestID:  c.Locals("request_id").(string),
		})
		if err != nil {
			return mapDomainError(err)
		}

		return c.JSON(tokens)
	}
}

type refreshReq struct {
	RefreshToken string `json:"refresh_token"`
}

func refreshHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req refreshReq
		if err := c.BodyParser(&req); err != nil || req.RefreshToken == "" {
			return fiber.NewError(fiber.StatusBadRequest, "refresh_token is required")
		}
		tokens, err := svc.RefreshToken(c.Context(), req.RefreshToken)
		if err != nil {
			return mapDomainError(err)
		}
		return c.JSON(tokens)
	}
}

func logoutHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req refreshReq
		_ = c.BodyParser(&req)
		_ = svc.Logout(c.Context(), req.RefreshToken)
		return c.SendStatus(fiber.StatusNoContent)
	}
}

type verifyEmailReq struct {
	Token string `json:"token"`
}

func verifyEmailHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Accept token from query param or body
		token := c.Query("token")
		if token == "" {
			var req verifyEmailReq
			if err := c.BodyParser(&req); err == nil {
				token = req.Token
			}
		}
		if token == "" {
			return fiber.NewError(fiber.StatusBadRequest, "token is required")
		}
		if err := svc.VerifyEmail(c.Context(), token); err != nil {
			return mapDomainError(err)
		}
		return c.JSON(fiber.Map{"message": "email verified successfully"})
	}
}

func oauthCallbackStub() fiber.Handler {
	return func(c *fiber.Ctx) error {
		provider := c.Params("provider")
		return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{
			"error":   "NOT_IMPLEMENTED",
			"message": "OAuth provider '" + provider + "' integration is planned for Phase 2",
		})
	}
}

func mfaStub(msg string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{
			"error":   "NOT_IMPLEMENTED",
			"message": msg,
		})
	}
}

// ─── User Handlers ────────────────────────────────────────────────────────────

func getMeHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := userIDFromCtx(c)
		if err != nil {
			return err
		}
		user, err := svc.GetMe(c.Context(), userID)
		if err != nil {
			return mapDomainError(err)
		}
		return c.JSON(user)
	}
}

func patchMeHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := userIDFromCtx(c)
		if err != nil {
			return err
		}
		var req domain.UpdateMeRequest
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
		}
		user, err := svc.UpdateMe(c.Context(), userID, req)
		if err != nil {
			return mapDomainError(err)
		}
		return c.JSON(user)
	}
}

type deleteReq struct {
	Password string `json:"password"`
	Reason   string `json:"reason"`
}

func deleteMeHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := userIDFromCtx(c)
		if err != nil {
			return err
		}
		var req deleteReq
		_ = c.BodyParser(&req)
		if req.Reason == "" {
			req.Reason = "user_requested"
		}
		var deleteErr error
		if req.Password != "" {
			deleteErr = svc.DeleteMeWithPassword(c.Context(), userID, req.Password, req.Reason)
		} else {
			deleteErr = svc.DeleteMe(c.Context(), userID, req.Reason)
		}
		if deleteErr != nil {
			return mapDomainError(deleteErr)
		}
		return c.SendStatus(fiber.StatusNoContent)
	}
}

func getUserByIDHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		idStr := c.Params("id")
		id, err := uuid.Parse(idStr)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid user id")
		}
		user, err := svc.GetMe(c.Context(), id)
		if err != nil {
			return mapDomainError(err)
		}
		return c.JSON(user)
	}
}

// ─── Session Handlers ─────────────────────────────────────────────────────────

func listSessionsHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := userIDFromCtx(c)
		if err != nil {
			return err
		}
		sessions, err := svc.ListSessions(c.Context(), userID)
		if err != nil {
			return mapDomainError(err)
		}
		return c.JSON(fiber.Map{"sessions": sessions})
	}
}

func revokeSessionHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := userIDFromCtx(c)
		if err != nil {
			return err
		}
		sessionID, err := uuid.Parse(c.Params("id"))
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid session id")
		}
		if err := svc.RevokeSession(c.Context(), userID, sessionID); err != nil {
			return mapDomainError(err)
		}
		return c.SendStatus(fiber.StatusNoContent)
	}
}

// ─── Error Mapping ────────────────────────────────────────────────────────────

// ErrorHandler is the global Fiber error handler with structured logging.
func ErrorHandler(log *zap.Logger) func(*fiber.Ctx, error) error {
	return func(c *fiber.Ctx, err error) error {
		// Domain errors — structured code + message
		var de *domain.DomainError
		if errors.As(err, &de) {
			status := domainErrorStatus(de)
			// Set Retry-After header for rate limited responses
			if de == domain.ErrRateLimited {
				c.Set("Retry-After", "60")
			}
			return c.Status(status).JSON(fiber.Map{
				"error":   de.Code,
				"message": de.Message,
			})
		}

		// Fiber errors (from fiber.NewError)
		code := fiber.StatusInternalServerError
		message := "internal server error"
		var fe *fiber.Error
		if errors.As(err, &fe) {
			code = fe.Code
			message = fe.Message
		}

		// Set Retry-After for rate limit responses
		if code == fiber.StatusTooManyRequests {
			c.Set("Retry-After", "60")
		}

		if code >= 500 {
			log.Error("unhandled error",
				zap.Error(err),
				zap.String("path", c.Path()),
				zap.String("method", c.Method()),
				zap.String("request_id", fmt.Sprint(c.Locals("request_id"))),
			)
		}

		return c.Status(code).JSON(fiber.Map{
			"error":   httpStatusCode(code),
			"message": message,
		})
	}
}

func mapDomainError(err error) error {
	var de *domain.DomainError
	if errors.As(err, &de) {
		return de // pass through — global ErrorHandler handles DomainError
	}
	return err
}

func domainErrorStatus(de *domain.DomainError) int {
	switch de {
	case domain.ErrUserNotFound:
		return fiber.StatusNotFound
	case domain.ErrEmailTaken:
		return fiber.StatusConflict
	case domain.ErrInvalidCredentials, domain.ErrTokenInvalid, domain.ErrSessionRevoked:
		return fiber.StatusUnauthorized
	case domain.ErrAccountSuspended, domain.ErrAccountLocked:
		return fiber.StatusForbidden
	case domain.ErrRateLimited:
		return fiber.StatusTooManyRequests
	case domain.ErrPasswordCompromised:
		return fiber.StatusUnprocessableEntity
	case domain.ErrMFARequired:
		return fiber.StatusPreconditionRequired
	case domain.ErrVerificationInvalid, domain.ErrVerificationUsed,
		domain.ErrResetTokenInvalid, domain.ErrResetTokenUsed:
		return fiber.StatusBadRequest
	default:
		return fiber.StatusInternalServerError
	}
}

func httpStatusCode(code int) string {
	switch code {
	case 400: return "BAD_REQUEST"
	case 401: return "UNAUTHORIZED"
	case 403: return "FORBIDDEN"
	case 404: return "NOT_FOUND"
	case 409: return "CONFLICT"
	case 422: return "UNPROCESSABLE_ENTITY"
	case 429: return "RATE_LIMITED"
	case 501: return "NOT_IMPLEMENTED"
	default:  return "INTERNAL_ERROR"
	}
}

func userIDFromCtx(c *fiber.Ctx) (uuid.UUID, error) {
	userIDStr, ok := c.Locals("user_id").(string)
	if !ok || userIDStr == "" {
		return uuid.UUID{}, fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}
	id, err := uuid.Parse(userIDStr)
	if err != nil {
		return uuid.UUID{}, fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}
	return id, nil
}

// ─── Password Reset Handlers ──────────────────────────────────────────────────

type forgotPwReq struct {
	Email string `json:"email"`
}

func forgotPasswordHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req forgotPwReq
		if err := c.BodyParser(&req); err != nil || req.Email == "" {
			return fiber.NewError(fiber.StatusBadRequest, "email is required")
		}
		// Always returns success (anti-enumeration)
		_ = svc.ForgotPassword(c.Context(), req.Email)
		return c.JSON(fiber.Map{"message": "If that email exists, a reset link has been sent."})
	}
}

type resetPwReq struct {
	Token       string `json:"token"`
	NewPassword string `json:"new_password"`
}

func resetPasswordHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req resetPwReq
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
		}
		if req.Token == "" {
			return fiber.NewError(fiber.StatusBadRequest, "token is required")
		}
		if len(req.NewPassword) < 10 {
			return fiber.NewError(fiber.StatusBadRequest, "password must be at least 10 characters")
		}
		if err := svc.ResetPassword(c.Context(), req.Token, req.NewPassword); err != nil {
			return mapDomainError(err)
		}
		return c.JSON(fiber.Map{"message": "Password updated successfully."})
	}
}

// ─── Change Password Handler ──────────────────────────────────────────────────

type changePwReq struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

func changePasswordHandler(svc service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := userIDFromCtx(c)
		if err != nil {
			return err
		}
		var req changePwReq
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
		}
		if req.OldPassword == "" || req.NewPassword == "" {
			return fiber.NewError(fiber.StatusBadRequest, "old_password and new_password are required")
		}
		if len(req.NewPassword) < 10 {
			return fiber.NewError(fiber.StatusBadRequest, "new password must be at least 10 characters")
		}
		if err := svc.ChangePassword(c.Context(), userID, req.OldPassword, req.NewPassword); err != nil {
			return mapDomainError(err)
		}
		return c.JSON(fiber.Map{"message": "Password changed successfully."})
	}
}
