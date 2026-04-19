// Package middleware provides shared Fiber middleware for OmniLingo services.
// All security middleware follows 09-security.md and coding-standards.md §5.
package middleware

import (
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// ─── JWT RS256 Auth ───────────────────────────────────────────────────────────

// JWTAuth returns a Fiber handler that:
//  1. Requires a Bearer token in Authorization header
//  2. Verifies token is RS256-signed using JWKS public keys
//  3. Validates standard claims (exp, nbf, iat, aud)
//  4. Sets "user_id" (string) and "roles" ([]string) in Locals
//
// jwksURL: should be "{IDENTITY_SERVICE_URL}/.well-known/jwks.json"
func JWTAuth(cache *JWKSCache) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error":   "UNAUTHORIZED",
				"message": "missing or invalid Authorization header",
			})
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		// Parse header to get kid for key selection
		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
			// Enforce RS256 only
			if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			// Select key by kid if available
			kid, _ := t.Header["kid"].(string)
			if kid != "" {
				return cache.GetKey(kid)
			}
			return cache.GetFirstKey()
		},
			jwt.WithValidMethods([]string{"RS256"}),
			jwt.WithAudience("omnilingo"),
			jwt.WithIssuedAt(),
			jwt.WithExpirationRequired(),
		)

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error":   "UNAUTHORIZED",
				"message": "invalid or expired token",
			})
		}

		sub, err := claims.GetSubject()
		if err != nil || sub == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error":   "UNAUTHORIZED",
				"message": "missing subject claim",
			})
		}

		// Parse user_id as UUID
		userID, err := uuid.Parse(sub)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error":   "UNAUTHORIZED",
				"message": "invalid user id in token",
			})
		}

		// Extract roles
		var roles []string
		if r, ok := claims["roles"]; ok {
			if roleSlice, ok := r.([]interface{}); ok {
				for _, role := range roleSlice {
					if s, ok := role.(string); ok {
						roles = append(roles, s)
					}
				}
			}
		}

		c.Locals("user_id", userID)
		c.Locals("user_id_str", sub)
		c.Locals("roles", roles)
		c.Locals("claims", claims)
		return c.Next()
	}
}

// HasRole returns a Fiber handler that checks the user has one of the given roles.
// Must be used AFTER JWTAuth.
func HasRole(roles ...string) fiber.Handler {
	roleSet := make(map[string]bool, len(roles))
	for _, r := range roles {
		roleSet[r] = true
	}
	return func(c *fiber.Ctx) error {
		userRoles, _ := c.Locals("roles").([]string)
		for _, r := range userRoles {
			if roleSet[r] {
				return c.Next()
			}
		}
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error":   "FORBIDDEN",
			"message": "insufficient permissions",
		})
	}
}

// ─── CORS ─────────────────────────────────────────────────────────────────────

// CORS implements whitelist-only CORS per 09-security.md §5.2.
// - Rejects requests with null or unrecognised Origin (no ACAO header set)
// - Always sets Vary: Origin to prevent cache poisoning behind CDN
// - Supports preflight (OPTIONS)
func CORS(allowedOrigins []string) fiber.Handler {
	allowed := make(map[string]bool, len(allowedOrigins))
	for _, o := range allowedOrigins {
		if o = strings.TrimSpace(o); o != "" {
			allowed[o] = true
		}
	}

	return func(c *fiber.Ctx) error {
		// Always set Vary: Origin → prevents cache poisoning
		c.Set("Vary", "Origin")

		origin := c.Get("Origin")
		// Reject null-origin and non-whitelisted origins (fail-closed)
		if origin != "" && allowed[origin] {
			c.Set("Access-Control-Allow-Origin", origin)
			c.Set("Access-Control-Allow-Credentials", "true")
			c.Set("Access-Control-Allow-Headers",
				"Content-Type, Authorization, X-Request-ID, X-Device-ID")
			c.Set("Access-Control-Allow-Methods",
				"GET, POST, PUT, PATCH, DELETE, OPTIONS")
			c.Set("Access-Control-Expose-Headers",
				"X-Request-ID, Retry-After")
			c.Set("Access-Control-Max-Age", "3600")
		}

		if c.Method() == fiber.MethodOptions {
			return c.SendStatus(fiber.StatusNoContent)
		}
		return c.Next()
	}
}

// ─── Request ID ───────────────────────────────────────────────────────────────

// RequestID injects or passes through a unique X-Request-ID header.
func RequestID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		rid := c.Get("X-Request-ID")
		if rid == "" {
			rid = uuid.New().String()
		}
		c.Set("X-Request-ID", rid)
		c.Locals("request_id", rid)
		return c.Next()
	}
}

// ─── Prometheus ───────────────────────────────────────────────────────────────

// MetricsFn is the signature expected by the Prometheus middleware.
// Each service passes its own counter/histogram Inc/Observe functions
// to avoid importing prometheus directly into this shared package.
type MetricsFn struct {
	IncRequests     func(method, route, status string)
	ObserveDuration func(method, route string, dur time.Duration)
}

// Prometheus returns a Fiber handler that calls the provided MetricsFn hooks.
func Prometheus(fns MetricsFn) fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()
		err := c.Next()
		status := fmt.Sprintf("%d", c.Response().StatusCode())
		route := c.Route().Path
		method := c.Method()
		if fns.IncRequests != nil {
			fns.IncRequests(method, route, status)
		}
		if fns.ObserveDuration != nil {
			fns.ObserveDuration(method, route, time.Since(start))
		}
		return err
	}
}
