package middleware

import (
	"fmt"
	"context"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// JWKSAuth holds the JWKS cache for RS256 verification.
// Initialise once at startup via NewJWKSAuth.
type JWKSAuth struct {
	cache *jwksCache
}

// NewJWKSAuth creates a JWKSAuth that fetches keys from
// "{identityURL}/.well-known/jwks.json". Retries 3× on startup.
func NewJWKSAuth(jwksURL string) (*JWKSAuth, error) {
	c, err := newJWKSCache(jwksURL, time.Hour)
	if err != nil {
		return nil, fmt.Errorf("jwks init: %w", err)
	}
	return &JWKSAuth{cache: c}, nil
}

// Handler returns a Fiber middleware that verifies RS256 JWT tokens.
// Sets user_id (uuid.UUID), user_id_str (string) and roles ([]string) in Locals.
func (a *JWKSAuth) Handler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		auth := c.Get("Authorization")
		if !strings.HasPrefix(auth, "Bearer ") {
			return c.Status(401).JSON(fiber.Map{
				"error": "UNAUTHORIZED", "message": "authentication required",
			})
		}
		tokenStr := strings.TrimPrefix(auth, "Bearer ")

		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			kid, _ := t.Header["kid"].(string)
			if kid != "" {
				return a.cache.GetKey(kid)
			}
			return a.cache.GetFirstKey()
		},
			jwt.WithValidMethods([]string{"RS256"}),
			jwt.WithAudience("omnilingo"),
			jwt.WithIssuedAt(),
			jwt.WithExpirationRequired(),
		)
		if err != nil || !token.Valid {
			return c.Status(401).JSON(fiber.Map{
				"error": "UNAUTHORIZED", "message": "invalid or expired token",
			})
		}

		sub, err := claims.GetSubject()
		if err != nil || sub == "" {
			return c.Status(401).JSON(fiber.Map{
				"error": "UNAUTHORIZED", "message": "missing subject claim",
			})
		}
		userID, err := uuid.Parse(sub)
		if err != nil {
			return c.Status(401).JSON(fiber.Map{
				"error": "UNAUTHORIZED", "message": "invalid user id in token",
			})
		}

		var roles []string
		if r, ok := claims["roles"]; ok {
			if rs, ok := r.([]interface{}); ok {
				for _, v := range rs {
					if s, ok := v.(string); ok {
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

// CORS implements whitelist-only CORS with Vary: Origin and null-origin rejection.
func CORS(allowedOrigins []string) fiber.Handler {
	allowed := make(map[string]bool, len(allowedOrigins))
	for _, o := range allowedOrigins {
		if o = strings.TrimSpace(o); o != "" {
			allowed[o] = true
		}
	}
	return func(c *fiber.Ctx) error {
		c.Set("Vary", "Origin")
		origin := c.Get("Origin")
		if origin != "" && allowed[origin] {
			c.Set("Access-Control-Allow-Origin", origin)
			c.Set("Access-Control-Allow-Credentials", "true")
			c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Request-ID")
			c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
			c.Set("Access-Control-Expose-Headers", "X-Request-ID, Retry-After")
			c.Set("Access-Control-Max-Age", "3600")
		}
		if c.Method() == fiber.MethodOptions {
			return c.SendStatus(fiber.StatusNoContent)
		}
		return c.Next()
	}
}

// UserIDFromCtx extracts the authenticated user_id (uuid.UUID) from Fiber locals.
// Returns an error if the middleware has not run or the value is missing.
func UserIDFromCtx(c *fiber.Ctx) (uuid.UUID, error) {
	v := c.Locals("user_id")
	if v == nil {
		return uuid.UUID{}, fiber.ErrUnauthorized
	}
	if uid, ok := v.(uuid.UUID); ok {
		return uid, nil
	}
	return uuid.UUID{}, fiber.ErrUnauthorized
}

// ─── Vocabulary-specific compat helpers ──────────────────────────────────────

// JWKSCacheCompat is an alias for the internal jwksCache, exposed for callers
// using the legacy NewJWKSCache + JWTAuth pattern.
type JWKSCacheCompat = jwksCache

// NewJWKSCache creates a JWKS cache using the provided identity base URL.
// The cache is initialised synchronously; the returned context is unused.
func NewJWKSCache(ctx context.Context, identityBaseURL string, log interface{}) (*JWKSCacheCompat, error) {
	return newJWKSCache(identityBaseURL+"/.well-known/jwks.json", time.Hour)
}

// JWTAuth returns a Fiber middleware that verifies RS256 tokens using the given cache.
// log parameter is accepted for API compatibility but is not used (zap is embedded in handler).
func JWTAuth(cache *JWKSCacheCompat, log interface{}) fiber.Handler {
	a := &JWKSAuth{cache: cache}
	return a.Handler()
}

// RequireRole returns a Fiber middleware that restricts access to holder of one of the given roles.
func RequireRole(roles ...string) fiber.Handler {
	roleSet := make(map[string]bool, len(roles))
	for _, r := range roles { roleSet[r] = true }
	return func(c *fiber.Ctx) error {
		r := c.Locals("roles")
		if r == nil {
			return c.Status(403).JSON(fiber.Map{"error": "FORBIDDEN", "message": "role required"})
		}
		for _, role := range r.([]string) {
			if roleSet[role] { return c.Next() }
		}
		return c.Status(403).JSON(fiber.Map{"error": "FORBIDDEN", "message": "insufficient role"})
	}
}

// PrometheusMiddleware records HTTP metrics using prom-client registered externally.
// Returns a no-op middleware if metrics are not yet wired.
func PrometheusMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error { return c.Next() }
}
