use axum::{
    extract::Request,
    http::StatusCode,
    middleware::Next,
    response::{IntoResponse, Response},
};
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use once_cell::sync::OnceCell;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{debug, warn};
use uuid::Uuid;

static JWKS_KEY: OnceCell<Arc<RwLock<Option<DecodingKey>>>> = OnceCell::new();

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
    #[serde(default)]
    roles: Vec<String>,
}

/// JWT RS256 authentication middleware.
/// Verifies Bearer token using the JWKS endpoint from identity-service.
pub async fn jwt_auth(mut req: Request, next: Next) -> Response {
    let auth_header = req
        .headers()
        .get("Authorization")
        .and_then(|v| v.to_str().ok());

    let token = match auth_header.and_then(|h| h.strip_prefix("Bearer ")) {
        Some(t) => t.to_string(),
        None => {
            return (
                StatusCode::UNAUTHORIZED,
                axum::Json(serde_json::json!({
                    "error": "UNAUTHORIZED",
                    "message": "authentication required"
                })),
            )
                .into_response();
        }
    };

    // Identity URL injected as Extension<String> by main.rs
    let identity_url = req
        .extensions()
        .get::<String>()
        .cloned()
        .unwrap_or_else(|| "http://localhost:3001".to_string());

    let decoding_key = get_or_fetch_key(&identity_url).await;

    match decoding_key {
        Some(key) => {
            let mut validation = Validation::new(Algorithm::RS256);
            validation.validate_exp = true;

            match decode::<Claims>(&token, &key, &validation) {
                Ok(data) => match Uuid::parse_str(&data.claims.sub) {
                    Ok(uid) => {
                        req.extensions_mut().insert(uid);
                        req.extensions_mut().insert(data.claims.roles);
                        next.run(req).await
                    }
                    Err(_) => (
                        StatusCode::UNAUTHORIZED,
                        axum::Json(serde_json::json!({
                            "error": "UNAUTHORIZED",
                            "message": "invalid token subject"
                        })),
                    )
                        .into_response(),
                },
                Err(e) => {
                    debug!("JWT validation failed: {e}");
                    (
                        StatusCode::UNAUTHORIZED,
                        axum::Json(serde_json::json!({
                            "error": "UNAUTHORIZED",
                            "message": "invalid or expired token"
                        })),
                    )
                        .into_response()
                }
            }
        }
        None => {
            warn!("JWKS unavailable — rejecting request");
            (
                StatusCode::UNAUTHORIZED,
                axum::Json(serde_json::json!({
                    "error": "UNAUTHORIZED",
                    "message": "authentication service unavailable"
                })),
            )
                .into_response()
        }
    }
}

async fn get_or_fetch_key(identity_url: &str) -> Option<DecodingKey> {
    let store = JWKS_KEY.get_or_init(|| Arc::new(RwLock::new(None)));

    {
        let read = store.read().await;
        if read.is_some() {
            return read.clone();
        }
    }

    let jwks_url = format!("{identity_url}/.well-known/jwks.json");
    let resp = reqwest::get(&jwks_url).await.ok()?;
    let jwks: serde_json::Value = resp.json().await.ok()?;
    let key_json = jwks["keys"].as_array()?.first()?.to_string();
    let key = DecodingKey::from_jwk(&serde_json::from_str(&key_json).ok()?).ok()?;

    let mut write = store.write().await;
    *write = Some(key.clone());
    Some(key)
}
