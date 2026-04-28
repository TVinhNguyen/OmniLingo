package outbox

import (
	"context"
	"fmt"
	"sync"
	"time"

	kafka "github.com/segmentio/kafka-go"
	"go.uber.org/zap"
)

// Publisher is the interface the Worker uses to send events to the message bus.
// Implementations: KafkaPublisher (production), FakePublisher (tests).
type Publisher interface {
	// Publish sends a batch of messages sharing the same topic.
	// Implementations must be safe for concurrent calls.
	Publish(ctx context.Context, topic string, msgs []Message) error
	// Close releases underlying resources (connections, writers).
	Close() error
}

// Message is a single outbox message to be published.
type Message struct {
	Key     []byte
	Payload []byte
}

// ─── KafkaPublisher ──────────────────────────────────────────────────────────

// KafkaPublisher implements Publisher using segmentio/kafka-go.
// Writers are cached per-topic to reuse TCP connections and avoid
// leader-discovery RTT on every flush (BUG-4 fix).
// Safe for concurrent use — sync.Map guards the writer cache.
type KafkaPublisher struct {
	brokers []string
	log     *zap.Logger
	writers sync.Map // topic (string) → *kafka.Writer
}

// NewKafkaPublisher creates a KafkaPublisher that connects to the given brokers.
func NewKafkaPublisher(brokers []string, log *zap.Logger) *KafkaPublisher {
	return &KafkaPublisher{brokers: brokers, log: log}
}

// writer returns (or lazily creates) the cached kafka.Writer for topic.
func (p *KafkaPublisher) writer(topic string) *kafka.Writer {
	if v, ok := p.writers.Load(topic); ok {
		return v.(*kafka.Writer)
	}
	w := kafka.NewWriter(kafka.WriterConfig{
		Brokers:      p.brokers,
		Topic:        topic,
		Balancer:     &kafka.LeastBytes{},
		BatchTimeout: 10 * time.Millisecond,
	})
	// LoadOrStore: if concurrent goroutine created one first, use theirs and close ours.
	if actual, loaded := p.writers.LoadOrStore(topic, w); loaded {
		_ = w.Close()
		return actual.(*kafka.Writer)
	}
	return w
}

// Publish sends all msgs to topic using a cached writer.
func (p *KafkaPublisher) Publish(ctx context.Context, topic string, msgs []Message) error {
	if len(msgs) == 0 {
		return nil
	}
	w := p.writer(topic)
	kmsgs := make([]kafka.Message, len(msgs))
	for i, m := range msgs {
		kmsgs[i] = kafka.Message{Key: m.Key, Value: m.Payload}
	}
	return w.WriteMessages(ctx, kmsgs...)
}

// Close closes all cached writers and releases their TCP connections.
func (p *KafkaPublisher) Close() error {
	var firstErr error
	p.writers.Range(func(key, val any) bool {
		if err := val.(*kafka.Writer).Close(); err != nil {
			p.log.Warn("kafka writer close error", zap.String("topic", key.(string)), zap.Error(err))
			if firstErr == nil {
				firstErr = err
			}
		}
		p.writers.Delete(key)
		return true
	})
	return firstErr
}


// ─── FakePublisher (test helper, exported for service tests) ─────────────────

// FakePublisher records all published messages in memory.
// Not safe for concurrent use from multiple goroutines — use in single-threaded tests only.
type FakePublisher struct {
	Published map[string][]Message // topic → messages
	Err       error                // if non-nil, Publish returns this error
}

// NewFakePublisher creates an empty FakePublisher.
func NewFakePublisher() *FakePublisher {
	return &FakePublisher{Published: make(map[string][]Message)}
}

func (f *FakePublisher) Publish(_ context.Context, topic string, msgs []Message) error {
	if f.Err != nil {
		return fmt.Errorf("fake publisher: %w", f.Err)
	}
	f.Published[topic] = append(f.Published[topic], msgs...)
	return nil
}

func (f *FakePublisher) Close() error { return nil }

// Reset clears all recorded messages. Useful between sub-tests.
func (f *FakePublisher) Reset() { f.Published = make(map[string][]Message) }
