use axum::{
    extract::{Extension, Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use chrono::Utc;
use serde::Deserialize;
use serde_json::json;
use sqlx::PgPool;
use uuid::Uuid;

use crate::domain::{
    fsrs::schedule,
    models::{BatchInitRequest, CardState, Rating, ScheduleRequest, ScheduleResponse},
};
use crate::metrics;

/// Shared handler state injected via Axum Extension.
#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
}

// ─── POST /api/v1/srs/schedule ────────────────────────────────────────────────

pub async fn schedule_handler(
    Extension(state): Extension<AppState>,
    Extension(user_id): Extension<Uuid>,
    Json(req): Json<ScheduleRequest>,
) -> impl IntoResponse {
    if req.item_kind.is_empty() || req.item_id.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error":"BAD_REQUEST","message":"item_kind and item_id required"})),
        )
            .into_response();
    }

    let reviewed_at = req.reviewed_at.unwrap_or_else(Utc::now);

    // Load existing state (or defaults for new card)
    let (stability, difficulty, reps, lapses, card_state, last_review_at) =
        match load_state(&state.db, user_id, &req.item_kind, &req.item_id).await {
            Some(row) => row,
            None => (0.0f64, 0.0f64, 0i32, 0i32, CardState::New, None),
        };

    let elapsed_days = last_review_at
        .map(|lr: chrono::DateTime<Utc>| (reviewed_at - lr).num_seconds() as f64 / 86400.0)
        .unwrap_or(0.0)
        .max(0.0);

    // FSRS scheduling
    let result = schedule(
        req.rating,
        stability,
        difficulty,
        reps,
        lapses,
        &card_state,
        elapsed_days,
        None,
    );

    let new_lapses = if req.rating == Rating::Again { lapses + 1 } else { lapses };
    let new_reps = reps + 1;

    // Upsert srs_states
    let upsert = sqlx::query(
        r#"INSERT INTO srs_states
               (user_id, item_kind, item_id, stability, difficulty, reps, lapses,
                state, last_review_at, due_at, updated_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now())
           ON CONFLICT (user_id, item_kind, item_id) DO UPDATE SET
               stability=$4, difficulty=$5, reps=$6, lapses=$7,
               state=$8, last_review_at=$9, due_at=$10, updated_at=now()"#,
    )
    .bind(user_id)
    .bind(&req.item_kind)
    .bind(&req.item_id)
    .bind(result.new_stability)
    .bind(result.new_difficulty)
    .bind(new_reps)
    .bind(new_lapses)
    .bind(result.new_state.as_str())
    .bind(reviewed_at)
    .bind(result.next_due_at)
    .execute(&state.db)
    .await;

    if let Err(e) = upsert {
        tracing::error!("schedule upsert error: {e}");
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error":"INTERNAL_ERROR","message":"failed to save schedule"})),
        )
            .into_response();
    }

    // Insert review history
    let _ = sqlx::query(
        r#"INSERT INTO srs_reviews
           (user_id, item_kind, item_id, rating, state_before, elapsed_days, scheduled_days, reviewed_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)"#,
    )
    .bind(user_id)
    .bind(&req.item_kind)
    .bind(&req.item_id)
    .bind(req.rating.as_i16())
    .bind(card_state.as_str())
    .bind(elapsed_days)
    .bind(result.interval_days)
    .bind(reviewed_at)
    .execute(&state.db)
    .await;

    metrics::REVIEWS_TOTAL
        .with_label_values(&[&req.rating.as_i16().to_string()])
        .inc();

    let resp = ScheduleResponse {
        item_kind: req.item_kind.clone(),
        item_id: req.item_id.clone(),
        next_due_at: result.next_due_at,
        state: result.new_state,
        stability: result.new_stability,
        difficulty: result.new_difficulty,
        reps: new_reps,
        interval_days: result.interval_days,
    };
    (StatusCode::OK, Json(json!({"schedule": resp}))).into_response()
}

// ─── POST /api/v1/srs/schedule/batch ─────────────────────────────────────────

pub async fn batch_init_handler(
    Extension(state): Extension<AppState>,
    Extension(user_id): Extension<Uuid>,
    Json(req): Json<BatchInitRequest>,
) -> impl IntoResponse {
    if req.items.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error":"BAD_REQUEST","message":"items array is empty"})),
        )
            .into_response();
    }

    let now = Utc::now();
    let mut created = 0u32;
    let mut skipped = 0u32;

    for item in &req.items {
        match sqlx::query(
            r#"INSERT INTO srs_states
               (user_id, item_kind, item_id, stability, difficulty, reps, lapses, state, due_at)
               VALUES ($1,$2,$3,0,0,0,0,'new',$4)
               ON CONFLICT (user_id, item_kind, item_id) DO NOTHING"#,
        )
        .bind(user_id)
        .bind(&item.item_kind)
        .bind(&item.item_id)
        .bind(now)
        .execute(&state.db)
        .await
        {
            Ok(r) if r.rows_affected() > 0 => created += 1,
            Ok(_) => skipped += 1,
            Err(e) => {
                tracing::warn!("batch init skip {}/{}: {e}", item.item_kind, item.item_id);
                skipped += 1;
            }
        }
    }

    metrics::BATCH_INIT_TOTAL.inc();
    (StatusCode::CREATED, Json(json!({"created": created, "skipped": skipped}))).into_response()
}

// ─── Helper: row type ─────────────────────────────────────────────────────────

type StateRow = (f64, f64, i32, i32, CardState, Option<chrono::DateTime<Utc>>);

async fn load_state(db: &PgPool, user_id: Uuid, item_kind: &str, item_id: &str) -> Option<StateRow> {
    let row = sqlx::query(
        "SELECT stability, difficulty, reps, lapses, state, last_review_at
         FROM srs_states WHERE user_id=$1 AND item_kind=$2 AND item_id=$3",
    )
    .bind(user_id)
    .bind(item_kind)
    .bind(item_id)
    .fetch_optional(db)
    .await
    .ok()??;

    use sqlx::Row;
    let state_str: String = row.try_get("state").ok()?;
    Some((
        row.try_get("stability").ok()?,
        row.try_get("difficulty").ok()?,
        row.try_get("reps").ok()?,
        row.try_get("lapses").ok()?,
        CardState::from_str(&state_str),
        row.try_get("last_review_at").ok()?,
    ))
}
