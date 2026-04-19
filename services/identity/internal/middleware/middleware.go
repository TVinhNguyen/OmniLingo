package middleware

import (
	"crypto/rsa"
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"

	"github.com/omnilingo/omnilingo/services/identity/internal/config"
	iam "github.com/omnilingo/omnilingo/services/identity/internal/metrics"
)

// RequestID injects a unique X-Request-ID header into every request.
func RequestID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		reqID := c.Get("X-Request-ID")
		if reqID == "" {
			reqID = uuid.New().String()
		}
		c.Set("X-Request-ID", reqID)
		c.Locals("request_id", reqID)
		return c.Next()
	}
}

// CORS adds Cross-Origin headers based on the allowed origins config.
// Implements whitelist-only CORS per 09-security.md §5.2.
func CORS(cfg *config.Config) fiber.Handler {
	allowed := make(map[string]bool)
	for _, o := range cfg.AllowedOrigins {
		allowed[strings.TrimSpace(o)] = true
	}

	return func(c *fiber.Ctx) error {
		origin := c.Get("Origin")

		// Always set Vary: Origin to prevent caching issues
		c.Set("Vary", "Origin")

		if allowed[origin] {
			c.Set("Access-Control-Allow-Origin", origin)
			c.Set("Access-Control-Allow-Credentials", "true")
			c.Set("Access-Control-Allow-Headers",
				"Content-Type, Authorization, X-Request-ID, X-Device-ID")
			c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
			c.Set("Access-Control-Expose-Headers", "X-Request-ID, Retry-After")
			c.Set("Access-Control-Max-Age", "3600") // 1h preflight cache
		}

		if c.Method() == fiber.MethodOptions {
			return c.SendStatus(fiber.StatusNoContent)
		}
		return c.Next()
	}
}

// JWTAuth validates the Bearer token (RS256) in the Authorization header.
// Sets "user_id", "claims", and "request_id" in Locals for downstream handlers.
func JWTAuth(publicKey *rsa.PublicKey) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return fiber.NewError(fiber.StatusUnauthorized, "missing or invalid Authorization header")
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := parseRS256JWT(tokenStr, publicKey)
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, "invalid token")
		}

		sub, err := claims.GetSubject()
		if err != nil || sub == "" {
			return fiber.NewError(fiber.StatusUnauthorized, "invalid token claims")
		}

		c.Locals("user_id", sub)
		c.Locals("claims", claims)
		return c.Next()
	}
}

// PrometheusMiddleware tracks HTTP request count and duration.
func PrometheusMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()
		err := c.Next()
		status := fmt.Sprintf("%d", c.Response().StatusCode())
		route := c.Route().Path
		method := c.Method()

		iam.HTTPRequestsTotal.WithLabelValues(method, route, status).Inc()
		iam.HTTPRequestDuration.WithLabelValues(method, route).Observe(time.Since(start).Seconds())
		return err
	}
}

// parseRS256JWT decodes and verifies a RS256-signed JWT.
func parseRS256JWT(tokenStr string, pubKey *rsa.PublicKey) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return pubKey, nil
	},
		jwt.WithValidMethods([]string{"RS256"}),
		jwt.WithAudience("omnilingo"),
		jwt.WithIssuedAt(),
	)
	if err != nil || !token.Valid {
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("invalid claims type")
	}
	return claims, nil
}
