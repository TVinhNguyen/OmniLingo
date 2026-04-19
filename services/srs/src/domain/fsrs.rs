// FSRS v5 algorithm implementation.
// Reference: https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm
// Default weights trained on open public review datasets.
#[allow(clippy::too_many_arguments, clippy::manual_clamp)]
/// The algorithm uses a set of 19 weight parameters (w[0]..w[18]).
/// Default weights below are the FSRS-5 recommended defaults trained on
/// open public review datasets. They can be personalised per-user in Phase 2.

use crate::domain::models::{CardState, Rating};
use chrono::{DateTime, Duration, Utc};

/// FSRS-5 default parameters (w[0]..w[18]).
/// Optimise per-user in a future analytics pipeline.
pub const DEFAULT_W: [f64; 19] = [
    0.4072, 1.1829, 3.1262, 15.4722,   // w[0..3] — initial stability per rating
    7.2102, 0.5316, 1.0651, 0.0589,    // w[4..7]
    1.5330, 0.1544, 1.0046, 1.9021,    // w[8..11]
    0.1105, 0.2900, 2.2700, 0.0600,    // w[12..15]
    2.9898, 0.5100, 2.2700,            // w[16..18]
];

/// Desired retention rate (probability of recall at scheduled interval).
const DESIRED_RETENTION: f64 = 0.9;

/// FSRS forgetting curve: R(t, S) = (1 + F * t/S)^C
/// where F = 19/81, C = -0.5
fn retrievability(elapsed_days: f64, stability: f64) -> f64 {
    if stability <= 0.0 {
        return 0.0;
    }
    let f = 19.0 / 81.0;
    let c = -0.5_f64;
    (1.0 + f * elapsed_days / stability).powf(c)
}

/// Calculate the next interval (in days) to achieve desired retention.
fn next_interval(stability: f64) -> f64 {
    let interval = (stability / (19.0 / 81.0) * (DESIRED_RETENTION.powf(-2.0) - 1.0)).max(1.0);
    interval.round()
}

/// Result of a single FSRS scheduling step.
#[derive(Debug)]
pub struct ScheduleResult {
    pub new_stability: f64,
    pub new_difficulty: f64,
    pub new_state: CardState,
    pub interval_days: f64,
    pub next_due_at: DateTime<Utc>,
}

/// The main FSRS scheduling function.
///
/// # Arguments
/// - `rating`: user response (Again/Hard/Good/Easy)
/// - `stability`: current stability S (0 = new card)
/// - `difficulty`: current difficulty D (0 = unset)
/// - `reps`: number of reviews so far
/// - `lapses`: number of times the card was forgotten (Again)
/// - `state`: current card state
/// - `elapsed_days`: days since last review (0 for new cards)
/// - `w`: weight parameters (use DEFAULT_W if None)
pub fn schedule(
    rating: Rating,
    stability: f64,
    difficulty: f64,
    reps: i32,
    lapses: i32,
    state: &CardState,
    elapsed_days: f64,
    w: Option<&[f64; 19]>,
) -> ScheduleResult {
    let w = w.unwrap_or(&DEFAULT_W);
    let r = rating.as_i16() as usize; // 1-indexed

    match state {
        CardState::New => schedule_new(rating, w),
        CardState::Learning | CardState::Relearning => {
            schedule_learning(rating, stability, difficulty, reps, w)
        }
        CardState::Review => {
            let recall = retrievability(elapsed_days, stability);
            schedule_review(rating, stability, difficulty, lapses, recall, w)
        }
        // fallback
        _ => schedule_new(rating, w),
    }
}

/// Schedule a new (never-reviewed) card.
fn schedule_new(rating: Rating, w: &[f64; 19]) -> ScheduleResult {
    let r = rating.as_i16() as usize - 1; // 0-indexed
    let new_stability = w[r].max(0.1);
    let new_difficulty = init_difficulty(rating, w);

    // For Again/Hard: short learning step (1 day); Good/Easy: full interval
    let (interval_days, new_state) = match rating {
        Rating::Again => (1.0, CardState::Learning),
        Rating::Hard => (1.0, CardState::Learning),
        Rating::Good => (next_interval(new_stability), CardState::Review),
        Rating::Easy => ((next_interval(new_stability) * w[15]).max(4.0), CardState::Review),
    };

    ScheduleResult {
        new_stability,
        new_difficulty,
        new_state,
        interval_days,
        next_due_at: Utc::now() + Duration::seconds((interval_days * 86400.0) as i64),
    }
}

/// Schedule a card in learning/relearning state.
fn schedule_learning(
    rating: Rating,
    stability: f64,
    difficulty: f64,
    reps: i32,
    w: &[f64; 19],
) -> ScheduleResult {
    let new_stability = match rating {
        Rating::Again => w[0].max(0.1),
        Rating::Hard | Rating::Good => stabilise_short(stability, difficulty, w),
        Rating::Easy => (stabilise_short(stability, difficulty, w) * w[15]).max(stability),
    };
    let new_difficulty = update_difficulty(difficulty, rating, w);

    let (interval_days, new_state) = match rating {
        Rating::Again => (1.0, CardState::Relearning),
        Rating::Hard => (1.0, CardState::Learning),
        Rating::Good => (next_interval(new_stability), CardState::Review),
        Rating::Easy => ((next_interval(new_stability) * w[15]).max(4.0), CardState::Review),
    };

    ScheduleResult {
        new_stability,
        new_difficulty,
        new_state,
        interval_days,
        next_due_at: Utc::now() + Duration::seconds((interval_days * 86400.0) as i64),
    }
}

/// Schedule a card in review state (standard SRS update).
fn schedule_review(
    rating: Rating,
    stability: f64,
    difficulty: f64,
    lapses: i32,
    recall: f64,
    w: &[f64; 19],
) -> ScheduleResult {
    let new_difficulty = update_difficulty(difficulty, rating, w);

    let (new_stability, new_state) = match rating {
        Rating::Again => {
            // Forgotten — relearning
            let s = forget_stability(difficulty, stability, recall, w);
            (s, CardState::Relearning)
        }
        _ => {
            // Recalled — stability increase
            let s = recall_stability(difficulty, stability, recall, rating, w);
            (s, CardState::Review)
        }
    };

    let (interval_days, final_state) = match new_state {
        CardState::Relearning => (1.0, CardState::Relearning),
        _ => match rating {
            Rating::Easy => ((next_interval(new_stability) * w[15]).max(next_interval(new_stability) + 1.0), CardState::Review),
            _ => (next_interval(new_stability), CardState::Review),
        },
    };

    ScheduleResult {
        new_stability,
        new_difficulty,
        new_state: final_state,
        interval_days,
        next_due_at: Utc::now() + Duration::seconds((interval_days * 86400.0) as i64),
    }
}

// ─── FSRS formula helpers ─────────────────────────────────────────────────────

fn init_difficulty(rating: Rating, w: &[f64; 19]) -> f64 {
    let r = rating.as_i16() as f64;
    clamp_difficulty(w[4] - (r - 3.0) * w[5])
}

fn update_difficulty(d: f64, rating: Rating, w: &[f64; 19]) -> f64 {
    let r = rating.as_i16() as f64;
    let mean_reversion = 0.1 * (w[4] - d);
    clamp_difficulty(d - w[6] * (r - 3.0) + mean_reversion)
}

fn clamp_difficulty(d: f64) -> f64 {
    d.max(1.0).min(10.0)
}

fn stabilise_short(stability: f64, difficulty: f64, w: &[f64; 19]) -> f64 {
    // Short-term stabilisation for learning steps
    (stability * (w[17] * (11.0 - difficulty) * stability.powf(-w[18]))).max(0.1)
}

fn recall_stability(d: f64, s: f64, r: f64, rating: Rating, w: &[f64; 19]) -> f64 {
    let hard_penalty = if rating == Rating::Hard { w[15] } else { 1.0 };
    let easy_bonus = if rating == Rating::Easy { w[16] } else { 1.0 };
    (s * (w[8].exp()
        * (11.0 - d)
        * s.powf(-w[9])
        * ((1.0 - r).mul_add(w[10], w[10].exp()) - 1.0)
        * hard_penalty
        * easy_bonus)
        + s)
        .max(0.1)
}

fn forget_stability(d: f64, s: f64, r: f64, w: &[f64; 19]) -> f64 {
    (w[11]
        * d.powf(-w[12])
        * ((s + 1.0).powf(w[13]) - 1.0)
        * (w[14] * (1.0 - r)).exp())
    .max(0.1)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new_card_good_rating_goes_to_review() {
        let result = schedule(Rating::Good, 0.0, 0.0, 0, 0, &CardState::New, 0.0, None);
        assert_eq!(result.new_state, CardState::Review);
        assert!(result.interval_days >= 1.0);
        assert!(result.new_stability > 0.0);
        assert!(result.new_difficulty >= 1.0 && result.new_difficulty <= 10.0);
    }

    #[test]
    fn test_new_card_again_stays_learning() {
        let result = schedule(Rating::Again, 0.0, 0.0, 0, 0, &CardState::New, 0.0, None);
        assert_eq!(result.new_state, CardState::Learning);
        assert_eq!(result.interval_days, 1.0);
    }

    #[test]
    fn test_easy_rating_longer_interval() {
        let easy = schedule(Rating::Easy, 0.0, 0.0, 0, 0, &CardState::New, 0.0, None);
        let good = schedule(Rating::Good, 0.0, 0.0, 0, 0, &CardState::New, 0.0, None);
        assert!(easy.interval_days >= good.interval_days);
    }

    #[test]
    fn test_review_again_becomes_relearning() {
        let result = schedule(Rating::Again, 10.0, 5.0, 5, 0, &CardState::Review, 10.0, None);
        assert_eq!(result.new_state, CardState::Relearning);
    }

    #[test]
    fn test_stability_increases_after_good() {
        let result = schedule(Rating::Good, 10.0, 5.0, 5, 0, &CardState::Review, 10.0, None);
        assert!(result.new_stability > 10.0);
    }

    #[test]
    fn test_difficulty_clamped_1_to_10() {
        for rating in [Rating::Again, Rating::Hard, Rating::Good, Rating::Easy] {
            let r = schedule(rating, 0.0, 0.0, 0, 0, &CardState::New, 0.0, None);
            assert!(r.new_difficulty >= 1.0 && r.new_difficulty <= 10.0);
        }
    }
}
