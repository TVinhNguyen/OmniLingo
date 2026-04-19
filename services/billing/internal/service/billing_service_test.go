package service_test

import (
	"testing"
	"time"
)

// prorate calculates a prorated refund amount when downgrading.
func prorate(priceCents int, start, end, now time.Time) int {
	total := end.Sub(start)
	remaining := end.Sub(now)
	if total <= 0 || remaining <= 0 { return 0 }
	ratio := float64(remaining) / float64(total)
	return int(float64(priceCents) * ratio)
}

func TestProrate(t *testing.T) {
	start := time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC)
	end   := time.Date(2026, 2, 1, 0, 0, 0, 0, time.UTC)

	cases := []struct {
		name    string
		now     time.Time
		price   int
		wantMin int
		wantMax int
	}{
		{"full period unused", start, 1000, 999, 1000},
		{"half period used", start.Add(end.Sub(start) / 2), 1000, 490, 510},
		{"period expired", end.Add(time.Hour), 1000, 0, 0},
	}
	for _, c := range cases {
		got := prorate(c.price, start, end, c.now)
		if got < c.wantMin || got > c.wantMax {
			t.Errorf("%s: prorate()=%d, want [%d,%d]", c.name, got, c.wantMin, c.wantMax)
		}
	}
}

func TestTrialDays(t *testing.T) {
	const trialDays = 14
	start := time.Now().UTC()
	trialEnd := start.AddDate(0, 0, trialDays)
	diff := trialEnd.Sub(start)
	if diff.Hours() < float64(13*24) || diff.Hours() > float64(15*24) {
		t.Errorf("trial duration unexpected: %.1f hours", diff.Hours())
	}
}
