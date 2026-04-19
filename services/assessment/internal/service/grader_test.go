package service_test

import (
	"context"
	"testing"

	"github.com/omnilingo/assessment-service/internal/domain"
	"github.com/omnilingo/assessment-service/internal/service"
)

func TestGradeMultipleChoice(t *testing.T) {
	tests := []struct {
		name    string
		answer  any
		correct any
		want    bool
		score   float64
	}{
		{"correct index match", 0, 0, true, 1.0},
		{"wrong index", 1, 0, false, 0.0},
		{"string match", "A", "A", true, 1.0},
		{"case string mismatch", "a", "A", false, 0.0}, // exact match for MC
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := service.Grade(domain.ExerciseMultipleChoice, tt.answer, tt.correct, 1.0)
			if result.Correct != tt.want {
				t.Errorf("Correct: got %v, want %v", result.Correct, tt.want)
			}
			if result.Score != tt.score {
				t.Errorf("Score: got %v, want %v", result.Score, tt.score)
			}
		})
	}
}

func TestGradeGapFill(t *testing.T) {
	tests := []struct {
		name      string
		answer    any
		correct   any
		wantScore float64
		wantOK    bool
	}{
		{
			"all correct",
			map[string]any{"s1": "apple", "s2": "orange"},
			map[string]any{"s1": "apple", "s2": "orange"},
			1.0, true,
		},
		{
			"partial correct",
			map[string]any{"s1": "apple", "s2": "wrong"},
			map[string]any{"s1": "apple", "s2": "orange"},
			0.5, false,
		},
		{
			"case insensitive",
			map[string]any{"s1": "APPLE"},
			map[string]any{"s1": "apple"},
			1.0, true,
		},
		{
			"none correct",
			map[string]any{"s1": "bad"},
			map[string]any{"s1": "apple"},
			0.0, false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := service.Grade(domain.ExerciseGapFill, tt.answer, tt.correct, 1.0)
			if result.Score != tt.wantScore {
				t.Errorf("Score: got %.2f, want %.2f", result.Score, tt.wantScore)
			}
			if result.Correct != tt.wantOK {
				t.Errorf("Correct: got %v, want %v", result.Correct, tt.wantOK)
			}
		})
	}
}

func TestGradeDictation(t *testing.T) {
	tests := []struct {
		name      string
		answer    string
		reference string
		minScore  float64
	}{
		{"exact match", "hello world", "hello world", 1.0},
		{"punctuation stripped", "hello, world!", "hello world", 1.0},
		{"partial match", "hello", "hello world", 0.4},
		{"empty answer", "", "hello world", 0.0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := service.Grade(domain.ExerciseDictation, tt.answer, tt.reference, 1.0)
			if result.Score < tt.minScore-0.01 {
				t.Errorf("Score: got %.3f, want >= %.3f (%s)", result.Score, tt.minScore, tt.name)
			}
		})
	}
}

func TestGradeSpeakingPending(t *testing.T) {
	result := service.Grade(domain.ExerciseSpeaking, "my answer", nil, 1.0)
	if result.Explanation != "pending AI grading" {
		t.Errorf("expected pending AI grading, got: %s", result.Explanation)
	}
}

func BenchmarkGradeMultipleChoice(b *testing.B) {
	for i := 0; i < b.N; i++ {
		service.Grade(domain.ExerciseMultipleChoice, 2, 2, 1.0)
	}
}

func BenchmarkGradeDictation(b *testing.B) {
	for i := 0; i < b.N; i++ {
		service.Grade(domain.ExerciseDictation,
			"the quick brown fox jumps over the lazy dog",
			"the quick brown fox jumps over the lazy dog", 1.0)
	}
}

// Compilation check for service interface
var _ context.Context = context.Background()
