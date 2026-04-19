package middleware

import (
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/omnilingo/payment-service/internal/metrics"
)

// ─── JWKS Cache ────────────────────────────────────────────────────────────────

type jwksKey struct {
	Kid string `json:"kid"`
	Kty string `json:"kty"`
	Use string `json:"use"`
	N   string `json:"n"`
	E   string `json:"e"`
}

type jwksResponse struct {
	Keys []jwksKey `json:"keys"`
}

type jwksCache struct {
	mu        sync.RWMutex
	url       string
	keys      map[string]*rsa.PublicKey
	fetchedAt time.Time
	ttl       time.Duration
	client    *http.Client
}

func newJWKSCache(url string, ttl time.Duration) (*jwksCache, error) {
	c := &jwksCache{
		url:    url,
		keys:   make(map[string]*rsa.PublicKey),
		ttl:    ttl,
		client: &http.Client{Timeout: 10 * time.Second},
	}
	var err error
	for i := 0; i < 3; i++ {
		if err = c.refresh(); err == nil {
			break
		}
		time.Sleep(time.Duration(1<<uint(i)) * time.Second)
	}
	if err != nil {
		return nil, fmt.Errorf("jwks: initial fetch failed: %w", err)
	}
	go c.backgroundRefresh()
	return c, nil
}

func (c *jwksCache) GetKey(kid string) (*rsa.PublicKey, error) {
	c.mu.RLock()
	k, ok := c.keys[kid]
	c.mu.RUnlock()
	if ok {
		return k, nil
	}
	if err := c.refresh(); err != nil {
		return nil, fmt.Errorf("jwks: key %q not found, refresh failed: %w", kid, err)
	}
	c.mu.RLock()
	k, ok = c.keys[kid]
	c.mu.RUnlock()
	if !ok {
		return nil, fmt.Errorf("jwks: key %q not found", kid)
	}
	return k, nil
}

func (c *jwksCache) GetFirstKey() (*rsa.PublicKey, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	for _, k := range c.keys {
		return k, nil
	}
	return nil, fmt.Errorf("jwks: no keys available")
}

func (c *jwksCache) backgroundRefresh() {
	t := time.NewTicker(c.ttl)
	defer t.Stop()
	for range t.C {
		_ = c.refresh()
	}
}

func (c *jwksCache) refresh() error {
	resp, err := c.client.Get(c.url) //nolint:noctx
	if err != nil {
		return fmt.Errorf("jwks: fetch: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("jwks: unexpected status %d", resp.StatusCode)
	}
	var body jwksResponse
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return fmt.Errorf("jwks: decode: %w", err)
	}
	newKeys := make(map[string]*rsa.PublicKey, len(body.Keys))
	for _, key := range body.Keys {
		if key.Kty != "RSA" || key.Use != "sig" {
			continue
		}
		pub, err := rsaPublicKeyFromJWK(key.N, key.E)
		if err != nil {
			return fmt.Errorf("jwks: parse key kid=%s: %w", key.Kid, err)
		}
		kid := key.Kid
		if kid == "" {
			kid = "__default__"
		}
		newKeys[kid] = pub
	}
	if len(newKeys) == 0 {
		return fmt.Errorf("jwks: no valid RSA sig keys found")
	}
	c.mu.Lock()
	c.keys = newKeys
	c.fetchedAt = time.Now()
	c.mu.Unlock()
	return nil
}

func rsaPublicKeyFromJWK(nStr, eStr string) (*rsa.PublicKey, error) {
	nBytes, err := base64.RawURLEncoding.DecodeString(nStr)
	if err != nil {
		return nil, fmt.Errorf("decode n: %w", err)
	}
	eBytes, err := base64.RawURLEncoding.DecodeString(eStr)
	if err != nil {
		return nil, fmt.Errorf("decode e: %w", err)
	}
	n := new(big.Int).SetBytes(nBytes)
	e := new(big.Int).SetBytes(eBytes)
	if !e.IsInt64() {
		return nil, fmt.Errorf("exponent too large")
	}
	return &rsa.PublicKey{N: n, E: int(e.Int64())}, nil
}

// ─── JWKSAuth ─────────────────────────────────────────────────────────────────

// JWKSAuth holds the JWKS cache for RS256 JWT verification.
type JWKSAuth struct {
	cache *jwksCache
}

// NewJWKSAuth creates a JWKSAuth that fetches RS256 public keys from the identity service.
func NewJWKSAuth(identityURL string) (*JWKSAuth, error) {
	c, err := newJWKSCache(identityURL+"/.well-known/jwks.json", time.Hour)
	if err != nil {
		return nil, fmt.Errorf("jwks auth init: %w", err)
	}
	return &JWKSAuth{cache: c}, nil
}

// Handler returns a Fiber middleware that validates RS256 JWT Bearer tokens.
// Sets user_id (uuid.UUID) and roles ([]string) in Locals.
func (a *JWKSAuth) Handler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		auth := c.Get("Authorization")
		if !strings.HasPrefix(auth, "Bearer ") {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "UNAUTHORIZED", "message": "authentication required",
			})
		}
		tokenStr := strings.TrimPrefix(auth, "Bearer ")

		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
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
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "TOKEN_INVALID", "message": "invalid or expired token",
			})
		}

		sub, err := claims.GetSubject()
		if err != nil || sub == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "TOKEN_INVALID", "message": "missing subject claim",
			})
		}
		userID, err := uuid.Parse(sub)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "TOKEN_INVALID", "message": "invalid user id in token",
			})
		}

		c.Locals("user_id", userID)
		c.Locals("user_id_str", sub)
		return c.Next()
	}
}

// UserIDFromCtx extracts the authenticated user UUID from Fiber context.
func UserIDFromCtx(c *fiber.Ctx) (uuid.UUID, bool) {
	uid, ok := c.Locals("user_id").(uuid.UUID)
	return uid, ok
}

// ─── RequestID ────────────────────────────────────────────────────────────────

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

// ─── CORS (whitelist-only, fail-close) ────────────────────────────────────────

// CORS implements whitelist-only CORS. Rejects (skips headers) if origin not in list.
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
			c.Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			c.Set("Access-Control-Expose-Headers", "X-Request-ID")
			c.Set("Access-Control-Max-Age", "3600")
		}
		if c.Method() == fiber.MethodOptions {
			return c.SendStatus(fiber.StatusNoContent)
		}
		return c.Next()
	}
}

// ─── Prometheus ────────────────────────────────────────────────────────────────

// Prometheus records HTTP request count and duration per route.
func Prometheus() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()
		err := c.Next()
		dur := time.Since(start).Seconds()
		status := fmt.Sprintf("%d", c.Response().StatusCode())
		route := c.Route().Path
		metrics.HTTPRequestsTotal.WithLabelValues(c.Method(), route, status).Inc()
		metrics.HTTPRequestDuration.WithLabelValues(c.Method(), route).Observe(dur)
		return err
	}
}
