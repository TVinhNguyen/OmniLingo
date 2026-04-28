package outbox_test

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/omnilingo/pkg/outbox"
)

// ─── FakePublisher tests ──────────────────────────────────────────────────────

func TestFakePublisher_Publish(t *testing.T) {
	pub := outbox.NewFakePublisher()
	ctx := context.Background()

	msgs := []outbox.Message{
		{Key: []byte("k1"), Payload: []byte(`{"id":1}`)},
		{Key: []byte("k2"), Payload: []byte(`{"id":2}`)},
	}
	if err := pub.Publish(ctx, "test.topic", msgs); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got := len(pub.Published["test.topic"]); got != 2 {
		t.Errorf("want 2 messages, got %d", got)
	}
}

func TestFakePublisher_Reset(t *testing.T) {
	pub := outbox.NewFakePublisher()
	_ = pub.Publish(context.Background(), "a", []outbox.Message{{Key: []byte("k"), Payload: []byte(`{}`)}})
	pub.Reset()
	if len(pub.Published) != 0 {
		t.Error("want empty after reset")
	}
}

func TestFakePublisher_Error(t *testing.T) {
	pub := outbox.NewFakePublisher()
	pub.Err = &outboxTestError{"kafka down"}
	err := pub.Publish(context.Background(), "t", nil)
	if err == nil {
		t.Error("expected error")
	}
}

// ─── Worker + FakePublisher integration (no DB required) ─────────────────────
// Full integration test with a real DB requires testcontainers-go and is kept
// in a separate *_integration_test.go file (build tag: integration).

type outboxTestError struct{ msg string }

func (e *outboxTestError) Error() string { return e.msg }

// ─── Enqueue payload marshalling unit test ───────────────────────────────────

type sampleEvent struct {
	UserID string `json:"user_id"`
	Action string `json:"action"`
}

func TestEnqueuePayloadRoundtrip(t *testing.T) {
	// Verify that json.Marshal → json.Unmarshal roundtrip is stable.
	// Repository.Enqueue relies on this for all callers.
	evt := sampleEvent{UserID: "u-123", Action: "registered"}
	data, err := json.Marshal(evt)
	if err != nil {
		t.Fatalf("marshal: %v", err)
	}
	var got sampleEvent
	if err := json.Unmarshal(data, &got); err != nil {
		t.Fatalf("unmarshal: %v", err)
	}
	if got != evt {
		t.Errorf("roundtrip mismatch: want %+v, got %+v", evt, got)
	}
}

// ─── Worker option tests ──────────────────────────────────────────────────────

func TestWorkerOptions(t *testing.T) {
	// Verify option application doesn't panic.
	// (We can't call Run without a real DB, but constructor must not panic.)
	_ = outbox.NewWorker(
		nil, // repo — nil is fine for constructor test
		outbox.NewFakePublisher(),
		nil, // log — nil intentionally to catch nil-guard failures
		outbox.WithPollInterval(100*time.Millisecond),
		outbox.WithBatchSize(10),
	)
}
