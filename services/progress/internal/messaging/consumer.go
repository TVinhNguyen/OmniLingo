package messaging

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/omnilingo/progress-service/internal/domain"
	"github.com/omnilingo/progress-service/internal/service"
	"github.com/segmentio/kafka-go"
	"go.uber.org/zap"
)

// Topics that progress-service subscribes to.
const (
	TopicLessonCompleted      = "learning.lesson.completed"
	TopicSRSReviewCompleted   = "srs.review.completed"
	TopicAssessmentGraded     = "assessment.submission.graded"
)

// SRSReviewCompletedEvent matches the event produced by srs-service.
type SRSReviewCompletedEvent struct {
	EventID    string  `json:"event_id"`
	UserID     string  `json:"user_id"`
	ItemKind   string  `json:"item_kind"`   // vocab|grammar
	Language   string  `json:"language"`
	Rating     int     `json:"rating"`      // 1-4
	Retrievability float64 `json:"retrievability"`
}

// ProgressConsumer reads Kafka events and applies skill score updates.
type ProgressConsumer struct {
	readers []*kafka.Reader
	svc     service.ProgressService
	log     *zap.Logger
}

// NewProgressConsumer creates a consumer subscribed to all progress-relevant topics.
func NewProgressConsumer(brokers []string, groupID string, svc service.ProgressService, log *zap.Logger) *ProgressConsumer {
	topics := []string{TopicLessonCompleted, TopicSRSReviewCompleted, TopicAssessmentGraded}
	readers := make([]*kafka.Reader, len(topics))
	for i, topic := range topics {
		readers[i] = kafka.NewReader(kafka.ReaderConfig{
			Brokers:     brokers,
			Topic:       topic,
			GroupID:     groupID,
			MinBytes:    1,
			MaxBytes:    1 << 20, // 1 MB
			StartOffset: kafka.LastOffset,
		})
	}
	return &ProgressConsumer{readers: readers, svc: svc, log: log}
}

// Start launches a goroutine per topic and blocks until ctx is cancelled.
func (c *ProgressConsumer) Start(ctx context.Context) {
	for _, r := range c.readers {
		go c.loop(ctx, r)
	}
	c.log.Info("progress kafka consumer started", zap.Int("topics", len(c.readers)))
}

// Stop closes all readers gracefully.
func (c *ProgressConsumer) Stop() {
	for _, r := range c.readers {
		_ = r.Close()
	}
	c.log.Info("progress kafka consumer stopped")
}

func (c *ProgressConsumer) loop(ctx context.Context, r *kafka.Reader) {
	for {
		msg, err := r.FetchMessage(ctx)
		if err != nil {
			if ctx.Err() != nil {
				return // context cancelled — clean shutdown
			}
			c.log.Error("kafka fetch error", zap.String("topic", r.Config().Topic), zap.Error(err))
			continue
		}
		if err := c.dispatch(ctx, msg); err != nil {
			c.log.Warn("event dispatch failed",
				zap.String("topic", msg.Topic),
				zap.Int64("offset", msg.Offset),
				zap.Error(err))
		}
		_ = r.CommitMessages(ctx, msg)
	}
}

func (c *ProgressConsumer) dispatch(ctx context.Context, msg kafka.Message) error {
	switch msg.Topic {
	case TopicLessonCompleted:
		var ev domain.LessonCompletedEvent
		if err := json.Unmarshal(msg.Value, &ev); err != nil {
			return fmt.Errorf("decode %s: %w", msg.Topic, err)
		}
		return c.svc.HandleLessonCompleted(ctx, &ev)

	case TopicAssessmentGraded:
		var ev domain.ExerciseGradedEvent
		if err := json.Unmarshal(msg.Value, &ev); err != nil {
			return fmt.Errorf("decode %s: %w", msg.Topic, err)
		}
		return c.svc.HandleExerciseGraded(ctx, &ev)

	case TopicSRSReviewCompleted:
		var ev SRSReviewCompletedEvent
		if err := json.Unmarshal(msg.Value, &ev); err != nil {
			return fmt.Errorf("decode %s: %w", msg.Topic, err)
		}
		// Map retrievability → score: high retrievability = good skill retention
		skillTag := ev.ItemKind // "vocab" or "grammar"
		score := ev.Retrievability * 100.0
		return c.svc.HandleExerciseGraded(ctx, &domain.ExerciseGradedEvent{
			EventID:      ev.EventID,
			UserID:       ev.UserID,
			ExerciseType: "srs_review",
			Score:        score,
			MaxScore:     100.0,
			SkillTag:     skillTag,
			Language:     ev.Language,
		})

	default:
		c.log.Warn("unknown topic", zap.String("topic", msg.Topic))
		return nil
	}
}
