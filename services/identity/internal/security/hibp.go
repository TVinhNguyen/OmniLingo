package security

import (
	"crypto/sha1" //nolint:gosec // HIBP API uses SHA-1 for k-anonymity model
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

// HIBPChecker checks passwords against the HaveIBeenPwned API
// using the k-anonymity model (only sends first 5 chars of SHA-1 hash).
type HIBPChecker struct {
	client *http.Client
}

// NewHIBPChecker creates a new checker with the specified timeout.
func NewHIBPChecker(timeout time.Duration) *HIBPChecker {
	return &HIBPChecker{
		client: &http.Client{Timeout: timeout},
	}
}

// IsPwned returns the number of times the password appeared in known breaches.
// Returns (0, nil) if the password is not found.
// Returns (n, nil) where n>0 if found.
// Returns (0, err) if the API call fails — callers should treat API failure as non-blocking.
func (h *HIBPChecker) IsPwned(password string) (int, error) {
	// Compute SHA-1 of the password
	sum := sha1.Sum([]byte(password)) //nolint:gosec
	hexHash := strings.ToUpper(hex.EncodeToString(sum[:]))

	prefix := hexHash[:5]
	suffix := hexHash[5:]

	url := fmt.Sprintf("https://api.pwnedpasswords.com/range/%s", prefix)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return 0, fmt.Errorf("hibp: build request: %w", err)
	}
	req.Header.Set("Add-Padding", "true") // privacy padding
	req.Header.Set("User-Agent", "omnilingo/identity-service")

	resp, err := h.client.Do(req)
	if err != nil {
		return 0, fmt.Errorf("hibp: api call: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("hibp: unexpected status %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, fmt.Errorf("hibp: read body: %w", err)
	}

	// Parse response lines: "HASHSUFFIX:COUNT\r\n"
	for _, line := range strings.Split(string(body), "\n") {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		parts := strings.SplitN(line, ":", 2)
		if len(parts) != 2 {
			continue
		}
		if strings.EqualFold(parts[0], suffix) {
			var count int
			fmt.Sscanf(parts[1], "%d", &count)
			return count, nil
		}
	}

	return 0, nil
}
