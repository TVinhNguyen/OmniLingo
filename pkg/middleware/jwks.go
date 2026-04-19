// Package jwks provides a thread-safe JWKS fetcher and RSA public key cache.
// It fetches the public key from an identity service's /.well-known/jwks.json endpoint,
// caches it for 1 hour, and refreshes in the background.
package middleware

import (
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
	"sync"
	"time"
)

// jwksKey represents one key in a JWKS response.
type jwksKey struct {
	Kid string `json:"kid"`
	Kty string `json:"kty"`
	Alg string `json:"alg"`
	Use string `json:"use"`
	N   string `json:"n"` // Base64URL-encoded modulus
	E   string `json:"e"` // Base64URL-encoded exponent
}

type jwksResponse struct {
	Keys []jwksKey `json:"keys"`
}

// JWKSCache fetches and caches RSA public keys from a JWKS endpoint.
type JWKSCache struct {
	mu        sync.RWMutex
	url       string
	keys      map[string]*rsa.PublicKey // kid → key
	fetchedAt time.Time
	ttl       time.Duration
	client    *http.Client
}

// NewJWKSCache creates a new JWKS cache. Performs an initial fetch with retries.
func NewJWKSCache(jwksURL string, ttl time.Duration) (*JWKSCache, error) {
	if ttl == 0 {
		ttl = time.Hour
	}
	c := &JWKSCache{
		url:    jwksURL,
		keys:   make(map[string]*rsa.PublicKey),
		ttl:    ttl,
		client: &http.Client{Timeout: 10 * time.Second},
	}
	// Initial fetch with retry
	var err error
	for i := 0; i < 3; i++ {
		if err = c.refresh(); err == nil {
			break
		}
		time.Sleep(time.Duration(1<<uint(i)) * time.Second)
	}
	if err != nil {
		return nil, fmt.Errorf("jwks: initial fetch failed after 3 attempts: %w", err)
	}
	// Background refresh
	go c.backgroundRefresh()
	return c, nil
}

// GetFirstKey returns the first RSA public key available (for single-key setups).
func (c *JWKSCache) GetFirstKey() (*rsa.PublicKey, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	for _, k := range c.keys {
		return k, nil
	}
	return nil, fmt.Errorf("jwks: no keys available")
}

// GetKey returns the RSA public key for a given kid.
func (c *JWKSCache) GetKey(kid string) (*rsa.PublicKey, error) {
	c.mu.RLock()
	k, ok := c.keys[kid]
	c.mu.RUnlock()
	if ok {
		return k, nil
	}
	// Try a forced refresh in case this is a newly rotated key
	if err := c.refresh(); err != nil {
		return nil, fmt.Errorf("jwks: key %q not found and refresh failed: %w", kid, err)
	}
	c.mu.RLock()
	k, ok = c.keys[kid]
	c.mu.RUnlock()
	if !ok {
		return nil, fmt.Errorf("jwks: key %q not found", kid)
	}
	return k, nil
}

func (c *JWKSCache) backgroundRefresh() {
	ticker := time.NewTicker(c.ttl)
	defer ticker.Stop()
	for range ticker.C {
		_ = c.refresh() // errors are non-fatal for background refresh
	}
}

func (c *JWKSCache) refresh() error {
	resp, err := c.client.Get(c.url)
	if err != nil {
		return fmt.Errorf("jwks: fetch %s: %w", c.url, err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("jwks: unexpected status %d from %s", resp.StatusCode, c.url)
	}

	var jwks jwksResponse
	if err := json.NewDecoder(resp.Body).Decode(&jwks); err != nil {
		return fmt.Errorf("jwks: decode: %w", err)
	}

	newKeys := make(map[string]*rsa.PublicKey, len(jwks.Keys))
	for _, key := range jwks.Keys {
		if key.Kty != "RSA" || key.Use != "sig" {
			continue
		}
		pub, err := parseRSAPublicKey(key.N, key.E)
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
		return fmt.Errorf("jwks: no valid RSA signing keys found in response")
	}

	c.mu.Lock()
	c.keys = newKeys
	c.fetchedAt = time.Now()
	c.mu.Unlock()
	return nil
}

// parseRSAPublicKey constructs an rsa.PublicKey from Base64URL-encoded
// modulus (n) and exponent (e) as found in a JWK.
func parseRSAPublicKey(nStr, eStr string) (*rsa.PublicKey, error) {
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
