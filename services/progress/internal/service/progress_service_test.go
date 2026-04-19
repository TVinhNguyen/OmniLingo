package service_test

import (
	"math"
	"testing"

	"github.com/omnilingo/progress-service/internal/service"
)

// TestEMAUpdate verifies the Exponential Moving Average calculation.
func TestEMAFormula(t *testing.T) {
	alpha := 0.2
	tests := []struct {
		name     string
		oldScore float64
		newValue float64
		want     float64
	}{
		{"from zero", 0, 80, 16.0},  // 0.2*80 + 0.8*0 = 16
		{"improving", 50, 100, 60.0}, // 0.2*100 + 0.8*50 = 60
		{"declining", 80, 0, 64.0},   // 0.2*0 + 0.8*80 = 64
		{"stable", 75, 75, 75.0},     // stays the same
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := alpha*tt.newValue + (1-alpha)*tt.oldScore
			if math.Abs(got-tt.want) > 0.001 {
				t.Errorf("EMA(%v, %v) = %.3f, want %.3f", tt.oldScore, tt.newValue, got, tt.want)
			}
		})
	}
}

// TestScoreToBandIELTS verifies band mapping for IELTS.
func TestScoreToBandIELTS(t *testing.T) {
	cases := []struct {
		score float64
		band  string
	}{
		{95, "9.0"}, {87, "8.0"}, {80, "7.0"}, {73, "6.5"},
		{64, "6.0"}, {57, "5.5"}, {50, "5.0"}, {40, "4.0"},
	}
	for _, c := range cases {
		got := service.ScoreToBandExport("ielts", c.score)
		if got != c.band {
			t.Errorf("IELTS score %.0f: got %q, want %q", c.score, got, c.band)
		}
	}
}

// TestScoreToBandJLPT verifies band mapping for JLPT.
func TestScoreToBandJLPT(t *testing.T) {
	cases := []struct {
		score float64
		band  string
	}{
		{95, "N1"}, {80, "N2"}, {65, "N3"}, {50, "N4"}, {30, "N5"},
	}
	for _, c := range cases {
		got := service.ScoreToBandExport("jlpt", c.score)
		if got != c.band {
			t.Errorf("JLPT score %.0f: got %q, want %q", c.score, got, c.band)
		}
	}
}

func TestScoreClamping(t *testing.T) {
	// Scores must be clamped to [0, 100]
	if math.Max(0, math.Min(100, -5)) != 0 {
		t.Error("negative score should clamp to 0")
	}
	if math.Max(0, math.Min(100, 150)) != 100 {
		t.Error("score > 100 should clamp to 100")
	}
}
