package middleware

// jwks.go — local JWKS cache used by this service's middleware.
// This is a self-contained copy so learning-service has no external pkg dependency.

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

func (c *jwksCache) GetFirstKey() (*rsa.PublicKey, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	for _, k := range c.keys {
		return k, nil
	}
	return nil, fmt.Errorf("jwks: no keys available")
}

func (c *jwksCache) GetKey(kid string) (*rsa.PublicKey, error) {
	c.mu.RLock()
	k, ok := c.keys[kid]
	c.mu.RUnlock()
	if ok {
		return k, nil
	}
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

func (c *jwksCache) backgroundRefresh() {
	t := time.NewTicker(c.ttl)
	defer t.Stop()
	for range t.C {
		_ = c.refresh()
	}
}

func (c *jwksCache) refresh() error {
	resp, err := c.client.Get(c.url)
	if err != nil {
		return fmt.Errorf("jwks: fetch: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("jwks: status %d", resp.StatusCode)
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
