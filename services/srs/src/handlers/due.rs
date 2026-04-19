use axum::{
    extract::{Extension, Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use chrono::Utc;
use serde::Deserialize;
use serde_json::{json, Value};
use sqlx::{PgPool, Row};
use uuid::Uuid;

use crate::domain::models::SrsStats;
use crate::handlers::schedule::AppState;

#[derive(Deserialize)]
pub struct DueQuery {
    pub limit: Option<i64>,
    pub kind: Option<String>,
}

/// GET /api/v1/srs/due
pub async fn get_due_handler(
    Extension(state): Extension<AppState>,
    Extension(user_id): Extension<Uuid>,
    Query(q): Query<DueQuery>,
) -> impl IntoResponse {
    let limit = q.limit.unwrap_or(50).min(200);
    let now = Utc::now();

    let query = if let Some(kind) = &q.kind {
        sqlx::query(
            "SELECT item_kind, item_id, due_at, state, reps
             FROM srs_states WHERE user_id=$1 AND item_kind=$2 AND due_at<=$3
             ORDER BY due_at ASC LIMIT $4",
        )
        .bind(user_id)
        .bind(kind)
        .bind(now)
        .bind(limit)
        .fetch_all(&state.db)
        .await
    } else {
        sqlx::query(
            "SELECT item_kind, item_id, due_at, state, reps
             FROM srs_states WHERE user_id=$1 AND due_at<=$2
             ORDER BY due_at ASC LIMIT $3",
        )
        .bind(user_id)
        .bind(now)
        .bind(limit)
        .fetch_all(&state.db)
        .await
    };

    match query {
        Ok(rows) => {
            let items: Vec<Value> = rows
                .iter()
                .map(|row| {
                    json!({
                        "item_kind": row.try_get::<String,_>("item_kind").unwrap_or_default(),
                        "item_id":   row.try_get::<String,_>("item_id").unwrap_or_default(),
                        "due_at":    row.try_get::<chrono::DateTime<Utc>,_>("due_at").ok(),
                        "state":     row.try_get::<String,_>("state").unwrap_or_default(),
                        "reps":      row.try_get::<i32,_>("reps").unwrap_or(0),
                    })
                })
                .collect();
            let count = items.len();
            (StatusCode::OK, Json(json!({"due": items, "count": count}))).into_response()
        }
        Err(e) => {
            tracing::error!("get_due error: {e}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error":"INTERNAL_ERROR","message":"database error"})),
            )
                .into_response()
        }
    }
}

/// GET /api/v1/srs/state/:item_kind/:item_id
pub async fn get_state_handler(
    Extension(state): Extension<AppState>,
    Extension(user_id): Extension<Uuid>,
    Path((item_kind, item_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let row = sqlx::query(
        "SELECT stability, difficulty, reps, lapses, state, last_review_at, due_at
         FROM srs_states WHERE user_id=$1 AND item_kind=$2 AND item_id=$3",
    )
    .bind(user_id)
    .bind(&item_kind)
    .bind(&item_id)
    .fetch_optional(&state.db)
    .await;

    match row {
        Ok(Some(r)) => (
            StatusCode::OK,
            Json(json!({
                "item_kind":      item_kind,
                "item_id":        item_id,
                "stability":      r.try_get::<f64,_>("stability").unwrap_or(0.0),
                "difficulty":     r.try_get::<f64,_>("difficulty").unwrap_or(0.0),
                "reps":           r.try_get::<i32,_>("reps").unwrap_or(0),
                "lapses":         r.try_get::<i32,_>("lapses").unwrap_or(0),
                "state":          r.try_get::<String,_>("state").unwrap_or_default(),
                "last_review_at": r.try_get::<Option<chrono::DateTime<Utc>>,_>("last_review_at").ok().flatten(),
                "due_at":         r.try_get::<chrono::DateTime<Utc>,_>("due_at").ok(),
            })),
        )
            .into_response(),
        Ok(None) => (
            StatusCode::NOT_FOUND,
            Json(json!({"error":"NOT_FOUND","message":"SRS state not found"})),
        )
            .into_response(),
        Err(e) => {
            tracing::error!("get_state error: {e}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error":"INTERNAL_ERROR","message":"database error"})),
            )
                .into_response()
        }
    }
}

/// POST /api/v1/srs/reset/:item_kind/:item_id
pub async fn reset_handler(
    Extension(state): Extension<AppState>,
    Extension(user_id): Extension<Uuid>,
    Path((item_kind, item_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let now = Utc::now();
    let res = sqlx::query(
        "UPDATE srs_states
         SET stability=0, difficulty=0, reps=0, lapses=0,
             state='new', last_review_at=NULL, due_at=$4, updated_at=now()
         WHERE user_id=$1 AND item_kind=$2 AND item_id=$3",
    )
    .bind(user_id)
    .bind(&item_kind)
    .bind(&item_id)
    .bind(now)
    .execute(&state.db)
    .await;

    match res {
        Ok(r) if r.rows_affected() > 0 => (
            StatusCode::OK,
            Json(json!({"message":"card reset","item_kind":item_kind,"item_id":item_id})),
        )
            .into_response(),
        Ok(_) => (
            StatusCode::NOT_FOUND,
            Json(json!({"error":"NOT_FOUND","message":"SRS state not found"})),
        )
            .into_response(),
        Err(e) => {
            tracing::error!("reset error: {e}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error":"INTERNAL_ERROR","message":"database error"})),
            )
                .into_response()
        }
    }
}

/// GET /api/v1/srs/stats
pub async fn stats_handler(
    Extension(state): Extension<AppState>,
    Extension(user_id): Extension<Uuid>,
) -> impl IntoResponse {
    let now = Utc::now();
    let row = sqlx::query(
        r#"SELECT
             COUNT(*)                                                  AS total,
             COUNT(*) FILTER (WHERE state='new')                       AS new_count,
             COUNT(*) FILTER (WHERE state IN ('learning','relearning')) AS learning_count,
             COUNT(*) FILTER (WHERE state='review')                    AS review_count,
             COUNT(*) FILTER (WHERE due_at <= $2)                      AS due_today,
             COUNT(*) FILTER (WHERE stability >= 21)                   AS mature_count
           FROM srs_states WHERE user_id=$1"#,
    )
    .bind(user_id)
    .bind(now)
    .fetch_one(&state.db)
    .await;

    match row {
        Ok(r) => {
            let stats = SrsStats {
                total: r.try_get::<i64, _>("total").unwrap_or(0),
                new_count: r.try_get::<i64, _>("new_count").unwrap_or(0),
                learning_count: r.try_get::<i64, _>("learning_count").unwrap_or(0),
                review_count: r.try_get::<i64, _>("review_count").unwrap_or(0),
                due_today: r.try_get::<i64, _>("due_today").unwrap_or(0),
                mature_count: r.try_get::<i64, _>("mature_count").unwrap_or(0),
            };
            (StatusCode::OK, Json(json!({"stats": stats}))).into_response()
        }
        Err(e) => {
            tracing::error!("stats error: {e}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"error":"INTERNAL_ERROR","message":"database error"})),
            )
                .into_response()
        }
    }
}
