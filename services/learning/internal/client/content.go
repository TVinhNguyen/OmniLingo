package client

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"go.uber.org/zap"
)

// ContentClient interacts with the content-service API.
type ContentClient interface {
	GetUnitLessons(ctx context.Context, unitID string) ([]LessonDTO, error)
}

type contentClient struct {
	baseURL    string
	httpClient *http.Client
	log        *zap.Logger
}

// LessonDTO represents a lesson returned from content-service.
type LessonDTO struct {
	ID    string            `json:"id"`
	Title map[string]string `json:"title"`
	// We only need ID and Title for MVP
}

type lessonsResponse struct {
	Lessons []LessonDTO `json:"lessons"`
}

// NewContentClient creates a new ContentClient.
func NewContentClient(baseURL string, log *zap.Logger) ContentClient {
	return &contentClient{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
		log: log,
	}
}

func (c *contentClient) GetUnitLessons(ctx context.Context, unitID string) ([]LessonDTO, error) {
	url := fmt.Sprintf("%s/api/v1/content/lessons?unitId=%s", c.baseURL, unitID)
	
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("create request failed: %w", err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		c.log.Warn("content-service unavailable", zap.Error(err), zap.String("url", url))
		return nil, fmt.Errorf("do request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		c.log.Warn("content-service bad status", zap.Int("status", resp.StatusCode))
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var res lessonsResponse
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return nil, fmt.Errorf("decode response failed: %w", err)
	}

	return res.Lessons, nil
}
