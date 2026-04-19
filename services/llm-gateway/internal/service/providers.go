package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/omnilingo/llm-gateway/internal/domain"
	"go.uber.org/zap"
)

// Provider is the interface every LLM adapter must implement.
type Provider interface {
	Name() domain.ProviderName
	Complete(ctx context.Context, req *domain.CompletionRequest) (*domain.CompletionResponse, error)
}

// ─── Anthropic Adapter ────────────────────────────────────────────────────────

type anthropicAdapter struct {
	apiKey string
	client *http.Client
	log    *zap.Logger
}

func NewAnthropicAdapter(apiKey string, log *zap.Logger) Provider {
	return &anthropicAdapter{
		apiKey: apiKey,
		client: &http.Client{Timeout: 90 * time.Second},
		log:    log,
	}
}

func (a *anthropicAdapter) Name() domain.ProviderName { return domain.ProviderAnthropic }

func (a *anthropicAdapter) Complete(ctx context.Context, req *domain.CompletionRequest) (*domain.CompletionResponse, error) {
	model := req.PreferredModel
	if model == "" {
		model = domain.ModelClaude3Haiku
	}

	// Build Anthropic API payload
	type anthropicMsg struct {
		Role    string `json:"role"`
		Content string `json:"content"`
	}
	type anthropicReq struct {
		Model     string         `json:"model"`
		MaxTokens int            `json:"max_tokens"`
		Messages  []anthropicMsg `json:"messages"`
		System    string         `json:"system,omitempty"`
	}

	var systemMsg string
	msgs := make([]anthropicMsg, 0, len(req.Messages))
	for _, m := range req.Messages {
		if m.Role == "system" {
			systemMsg = m.Content
			continue
		}
		msgs = append(msgs, anthropicMsg{Role: m.Role, Content: m.Content})
	}

	maxTokens := req.MaxTokens
	if maxTokens <= 0 {
		maxTokens = 1024
	}

	body, _ := json.Marshal(anthropicReq{
		Model:     model,
		MaxTokens: maxTokens,
		Messages:  msgs,
		System:    systemMsg,
	})

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost,
		"https://api.anthropic.com/v1/messages", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("x-api-key", a.apiKey)
	httpReq.Header.Set("anthropic-version", "2023-06-01")

	start := time.Now()
	resp, err := a.client.Do(httpReq)
	latency := time.Since(start).Milliseconds()
	if err != nil {
		return nil, fmt.Errorf("anthropic: http call: %w", err)
	}
	defer resp.Body.Close()

	respBytes, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("anthropic: status %d: %s", resp.StatusCode, string(respBytes))
	}

	var parsed struct {
		Content []struct {
			Type string `json:"type"`
			Text string `json:"text"`
		} `json:"content"`
		Usage struct {
			InputTokens  int `json:"input_tokens"`
			OutputTokens int `json:"output_tokens"`
		} `json:"usage"`
	}
	if err := json.Unmarshal(respBytes, &parsed); err != nil {
		return nil, fmt.Errorf("anthropic: parse response: %w", err)
	}

	text := ""
	if len(parsed.Content) > 0 {
		text = parsed.Content[0].Text
	}

	return &domain.CompletionResponse{
		RequestID:    req.RequestID,
		Provider:     domain.ProviderAnthropic,
		Model:        model,
		Content:      text,
		PromptTokens: parsed.Usage.InputTokens,
		OutputTokens: parsed.Usage.OutputTokens,
		TotalTokens:  parsed.Usage.InputTokens + parsed.Usage.OutputTokens,
		LatencyMs:    latency,
	}, nil
}

// ─── OpenAI Adapter ───────────────────────────────────────────────────────────

type openaiAdapter struct {
	apiKey string
	client *http.Client
	log    *zap.Logger
}

func NewOpenAIAdapter(apiKey string, log *zap.Logger) Provider {
	return &openaiAdapter{
		apiKey: apiKey,
		client: &http.Client{Timeout: 90 * time.Second},
		log:    log,
	}
}

func (a *openaiAdapter) Name() domain.ProviderName { return domain.ProviderOpenAI }

func (a *openaiAdapter) Complete(ctx context.Context, req *domain.CompletionRequest) (*domain.CompletionResponse, error) {
	model := req.PreferredModel
	if model == "" {
		model = domain.ModelGPT4oMini
	}

	type oaiMsg struct {
		Role    string `json:"role"`
		Content string `json:"content"`
	}
	type oaiReq struct {
		Model     string   `json:"model"`
		Messages  []oaiMsg `json:"messages"`
		MaxTokens int      `json:"max_tokens,omitempty"`
	}

	msgs := make([]oaiMsg, 0, len(req.Messages))
	for _, m := range req.Messages {
		msgs = append(msgs, oaiMsg{Role: m.Role, Content: m.Content})
	}

	maxTokens := req.MaxTokens
	if maxTokens <= 0 {
		maxTokens = 1024
	}

	body, _ := json.Marshal(oaiReq{Model: model, Messages: msgs, MaxTokens: maxTokens})

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost,
		"https://api.openai.com/v1/chat/completions", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+a.apiKey)

	start := time.Now()
	resp, err := a.client.Do(httpReq)
	latency := time.Since(start).Milliseconds()
	if err != nil {
		return nil, fmt.Errorf("openai: http call: %w", err)
	}
	defer resp.Body.Close()

	respBytes, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("openai: status %d: %s", resp.StatusCode, string(respBytes))
	}

	var parsed struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
		Usage struct {
			PromptTokens     int `json:"prompt_tokens"`
			CompletionTokens int `json:"completion_tokens"`
			TotalTokens      int `json:"total_tokens"`
		} `json:"usage"`
	}
	if err := json.Unmarshal(respBytes, &parsed); err != nil {
		return nil, fmt.Errorf("openai: parse response: %w", err)
	}

	content := ""
	if len(parsed.Choices) > 0 {
		content = parsed.Choices[0].Message.Content
	}

	return &domain.CompletionResponse{
		RequestID:    req.RequestID,
		Provider:     domain.ProviderOpenAI,
		Model:        model,
		Content:      content,
		PromptTokens: parsed.Usage.PromptTokens,
		OutputTokens: parsed.Usage.CompletionTokens,
		TotalTokens:  parsed.Usage.TotalTokens,
		LatencyMs:    latency,
	}, nil
}
