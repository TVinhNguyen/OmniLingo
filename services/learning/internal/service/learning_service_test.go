package service_test

import (
	"math"
	"testing"
)

func xpForLesson(score float64) int {
	base := 20.0
	bonus := math.Round(score * 0.3)
	return int(base + bonus)
}

func TestXPForLesson(t *testing.T) {
	cases := []struct {
		score float64
		minXP int
		maxXP int
	}{
		{0, 20, 20},    // base only
		{100, 50, 50},  // 20 + 30
		{50, 35, 35},   // 20 + 15
		{75, 42, 43},   // 20 + round(22.5)
	}
	for _, c := range cases {
		got := xpForLesson(c.score)
		if got < c.minXP || got > c.maxXP {
			t.Errorf("xpForLesson(%.0f) = %d, want [%d, %d]", c.score, got, c.minXP, c.maxXP)
		}
	}
}

func TestXPForLessonAlwaysPositive(t *testing.T) {
	for _, score := range []float64{-10, 0, 0.01, 50, 100} {
		if xpForLesson(score) < 0 {
			t.Errorf("xpForLesson(%.2f) should not be negative", score)
		}
	}
}
