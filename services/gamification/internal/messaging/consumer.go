package messaging

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/omnilingo/gamification-service/internal/domain"
	"github.com/omnilingo/gamification-service/internal/service"
	"github.com/segmentio/kafka-go"
	"go.uber.org/zap"
)

const (
	// gamification-publisher publishes these topics (consumers downstream should read them)
	TopicXPAwardedOut     = "gamification.xp.awarded"    // published by this service
	TopicStreakUpdatedOut = "gamification.streak.updated" // published by this service

	// upstream events this service consumes
	TopicLessonCompleted = "learning.lesson.completed"
)

// XPAwardedEvent is produced by progress-service.
type XPAwardedEvent struct {
	EventID  string `json:"event_id"`
	UserID   string `json:"user_id"`
	XP       int    `json:"xp"`
	Language string `json:"language"`
	Reason   string `json:"reason"`
}

// StreakEvent is produced by progress-service.
type StreakEvent struct {
	EventID        string `json:"event_id"`
	UserID         string `json:"user_id"`
	CurrentStreak  int    `json:"current_streak"`
	PreviousStreak int    `json:"previous_streak"`
}

// GamificationConsumer subscribes to progress events.
type GamificationConsumer struct {
	readers []*kafka.Reader
	svc     service.GamificationService
	log     *zap.Logger
}

func NewGamificationConsumer(brokers []string, groupID string, svc service.GamificationService, log *zap.Logger) *GamificationConsumer {
	topics := []string{TopicLessonCompleted}
	readers := make([]*kafka.Reader, len(topics))
	for i, t := range topics {
		readers[i] = kafka.NewReader(kafka.ReaderConfig{
			Brokers:     brokers,
			Topic:       t,
			GroupID:     groupID,
			MinBytes:    1,
			MaxBytes:    1 << 20,
			StartOffset: kafka.LastOffset,
		})
	}
	return &GamificationConsumer{readers: readers, svc: svc, log: log}
}

func (c *GamificationConsumer) Start(ctx context.Context) {
	for _, r := range c.readers {
		go c.loop(ctx, r)
	}
	c.log.Info("gamification kafka consumer started", zap.Int("topics", len(c.readers)))
}

func (c *GamificationConsumer) Stop() {
	for _, r := range c.readers {
		_ = r.Close()
	}
	c.log.Info("gamification kafka consumer stopped")
}

func (c *GamificationConsumer) loop(ctx context.Context, r *kafka.Reader) {
	for {
		msg, err := r.FetchMessage(ctx)
		if err != nil {
			if ctx.Err() != nil { return }
			c.log.Error("kafka fetch error", zap.String("topic", r.Config().Topic), zap.Error(err))
			continue
		}
		if err := c.dispatch(ctx, msg); err != nil {
			c.log.Warn("dispatch failed",
				zap.String("topic", msg.Topic),
				zap.Int64("offset", msg.Offset),
				zap.Error(err))
		}
		_ = r.CommitMessages(ctx, msg)
	}
}

func (c *GamificationConsumer) dispatch(ctx context.Context, msg kafka.Message) error {
	switch msg.Topic {
	case TopicLessonCompleted:
		var ev domain.LessonCompletedEvent
		if err := json.Unmarshal(msg.Value, &ev); err != nil {
			return fmt.Errorf("decode lesson.completed: %w", err)
		}
		return c.svc.HandleLessonCompleted(ctx, &ev)

	default:
		c.log.Warn("unknown topic", zap.String("topic", msg.Topic))
		return nil
	}
}
