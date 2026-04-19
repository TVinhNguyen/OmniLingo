use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Rating values per FSRS spec.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Rating {
    Again = 1,
    Hard = 2,
    Good = 3,
    Easy = 4,
}

impl Rating {
    pub fn as_i16(self) -> i16 {
        self as i16
    }
    #[allow(dead_code)]
pub fn from_i16(v: i16) -> Option<Self> {
        match v {
            1 => Some(Rating::Again),
            2 => Some(Rating::Hard),
            3 => Some(Rating::Good),
            4 => Some(Rating::Easy),
            _ => None,
        }
    }
}

/// Card state in the FSRS state machine.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum CardState {
    New,
    Learning,
    Review,
    Relearning,
}

impl CardState {
    pub fn as_str(&self) -> &'static str {
        match self {
            CardState::New => "new",
            CardState::Learning => "learning",
            CardState::Review => "review",
            CardState::Relearning => "relearning",
        }
    }
    pub fn from_str(s: &str) -> Self {
        match s {
            "learning" => CardState::Learning,
            "review" => CardState::Review,
            "relearning" => CardState::Relearning,
            _ => CardState::New,
        }
    }
}

/// Full SRS state for a single (user, item_kind, item_id) tuple.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct SrsState {
    pub user_id: Uuid,
    pub item_kind: String,
    pub item_id: String,
    pub stability: f64,
    pub difficulty: f64,
    pub reps: i32,
    pub lapses: i32,
    pub state: CardState,
    pub last_review_at: Option<DateTime<Utc>>,
    pub due_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// A due item returned to the client.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct DueItem {
    pub item_kind: String,
    pub item_id: String,
    pub due_at: DateTime<Utc>,
    pub state: CardState,
    pub reps: i32,
}

/// Request body for scheduling a single review.
#[derive(Debug, Deserialize)]
pub struct ScheduleRequest {
    pub item_kind: String,
    pub item_id: String,
    pub rating: Rating,
    /// When the review actually happened (defaults to now if absent)
    pub reviewed_at: Option<DateTime<Utc>>,
}

/// Request body for bulk-initialising new cards (e.g., post-import).
#[derive(Debug, Deserialize)]
pub struct BatchInitRequest {
    pub items: Vec<BatchInitItem>,
}

#[derive(Debug, Deserialize)]
pub struct BatchInitItem {
    pub item_kind: String,
    pub item_id: String,
}

/// Response after a schedule operation.
#[derive(Debug, Serialize)]
pub struct ScheduleResponse {
    pub item_kind: String,
    pub item_id: String,
    pub next_due_at: DateTime<Utc>,
    pub state: CardState,
    pub stability: f64,
    pub difficulty: f64,
    pub reps: i32,
    pub interval_days: f64,
}

/// User-level SRS statistics.
#[derive(Debug, Serialize)]
pub struct SrsStats {
    pub total: i64,
    pub new_count: i64,
    pub learning_count: i64,
    pub review_count: i64,
    pub due_today: i64,
    pub mature_count: i64,  // stability >= 21 days
}
