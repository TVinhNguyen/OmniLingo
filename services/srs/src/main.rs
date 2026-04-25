use axum::{
    extract::{DefaultBodyLimit, Extension},
    http::{HeaderName, HeaderValue, Method, StatusCode},
    middleware,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use axum_prometheus::PrometheusMetricLayer;
use serde_json::json;
use sqlx::PgPool;
use std::time::Duration;
use tokio::net::TcpListener;
use tower_http::{
    cors::CorsLayer,
    request_id::{MakeRequestUuid, SetRequestIdLayer},
    trace::TraceLayer,
};
use tracing::{error, info};
use tracing_subscriber::EnvFilter;

mod auth_middleware;
mod config;
mod domain;
mod handlers;
mod kafka;
mod metrics;
mod repository;

use config::Config;
use handlers::{
    due::{get_due_handler, get_state_handler, reset_handler, stats_handler},
    schedule::{batch_init_handler, schedule_handler, AppState},
};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    let cfg = Config::load();

    // ─── Logging ─────────────────────────────────────────────────────────────
    let filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new(&cfg.log_level));
    if cfg.env == "production" {
        tracing_subscriber::fmt()
            .json()
            .with_env_filter(filter)
            .init();
    } else {
        tracing_subscriber::fmt().with_env_filter(filter).init();
    }

    info!("starting srs-service v{}", cfg.version);

    // ─── Infrastructure ───────────────────────────────────────────────────────
    let db = repository::db::new_pool(&cfg.database_url).await?;
    let _redis = repository::cache::new_pool(&cfg.redis_url).await.ok();

    // ─── Kafka consumer & Outbox relay ────────────────────────────────────────
    if cfg.kafka_enabled {
        kafka::consumer::start_consumer(&cfg.kafka_brokers, &cfg.kafka_group_id, db.clone()).await;
        kafka::outbox::start_relay(&cfg.kafka_brokers, db.clone()).await;
    } else {
        info!("Kafka disabled — skipping consumer and outbox relay");
    }

    // ─── State & CORS ─────────────────────────────────────────────────────────
    let state = AppState { db: db.clone() };
    let identity_url = cfg.identity_service_url.clone();
    let cors = match build_cors(&cfg.allowed_origins) {
        Ok(layer) => layer,
        Err(e) => {
            error!("{}", e);
            std::process::exit(1);
        }
    };

    // ─── Prometheus metrics layer ─────────────────────────────────────────────
    let (prometheus_layer, metric_handle) = PrometheusMetricLayer::pair();

    // ─── Protected routes ─────────────────────────────────────────────────────
    let protected = Router::new()
        .route("/schedule", post(schedule_handler))
        .route("/schedule/batch", post(batch_init_handler))
        .route("/due", get(get_due_handler))
        .route("/state/:item_kind/:item_id", get(get_state_handler))
        .route("/reset/:item_kind/:item_id", post(reset_handler))
        .route("/stats", get(stats_handler))
        .layer(middleware::from_fn(auth_middleware::auth::jwt_auth))
        .layer(Extension(identity_url));

    // ─── App router ───────────────────────────────────────────────────────────
    let db_clone = db.clone();
    let app = Router::new()
        .route("/healthz", get(healthz_handler))
        .route(
            "/readyz",
            get(move || readyz(db_clone.clone())),
        )
        .route("/metrics", get(move || metrics_handler(metric_handle.clone())))
        .nest("/api/v1/srs", protected)
        .layer(prometheus_layer)
        .layer(Extension(state))
        .layer(cors)
        .layer(DefaultBodyLimit::max(65_536)) // 64 KB body limit
        .layer(SetRequestIdLayer::x_request_id(MakeRequestUuid))
        .layer(TraceLayer::new_for_http());

    let addr = format!("0.0.0.0:{}", cfg.port);
    let listener = TcpListener::bind(&addr).await?;
    info!("srs-service listening on {addr}");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    Ok(())
}

// ─── Infrastructure handlers ──────────────────────────────────────────────────

async fn healthz_handler() -> impl IntoResponse {
    Json(json!({
        "ok": true,
        "service": "srs-service",
        "version": env!("CARGO_PKG_VERSION")
    }))
}

async fn readyz(db: PgPool) -> impl IntoResponse {
    let pg_ok = db.acquire().await.is_ok();
    let status = if pg_ok {
        StatusCode::OK
    } else {
        StatusCode::SERVICE_UNAVAILABLE
    };
    (
        status,
        Json(json!({
            "ready": pg_ok,
            "checks": { "postgres": if pg_ok { "ok" } else { "error" } }
        })),
    )
}

async fn metrics_handler(
    metric_handle: axum_prometheus::metrics_exporter_prometheus::PrometheusHandle,
) -> impl IntoResponse {
    (
        [(axum::http::header::CONTENT_TYPE, "text/plain; version=0.0.4")],
        metric_handle.render(),
    )
}

// ─── CORS ─────────────────────────────────────────────────────────────────────

/// Build CORS layer from allowed origins.
/// Returns Err if origins list is empty (fail-close in production).
fn build_cors(origins: &[String]) -> Result<CorsLayer, String> {
    let allowed: Vec<HeaderValue> = origins
        .iter()
        .filter(|o| !o.trim().is_empty())
        .filter_map(|o| o.parse().ok())
        .collect();

    if allowed.is_empty() {
        return Err(
            "CORS_ORIGINS empty — refusing to start with AllowOrigin::Any in production. \
             Set ALLOWED_ORIGINS env var.".to_string()
        );
    }

    Ok(CorsLayer::new()
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::DELETE,
            Method::PATCH,
            Method::PUT,
        ])
        .allow_headers([
            HeaderName::from_static("authorization"),
            HeaderName::from_static("content-type"),
            HeaderName::from_static("x-request-id"),
        ])
        .allow_origin(allowed)
        .max_age(Duration::from_secs(3600)))
}

// ─── Graceful shutdown ────────────────────────────────────────────────────────

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };
    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };
    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
    info!("shutting down srs-service");
}
