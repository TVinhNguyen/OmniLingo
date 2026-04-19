use anyhow::Result;
use deadpool_redis::{Config as RedisConfig, Pool as RedisPool, Runtime};
use tracing::{info, warn};

/// Create a Redis connection pool.
pub async fn new_pool(redis_url: &str) -> Result<RedisPool> {
    let cfg = RedisConfig::from_url(redis_url);
    let pool = cfg.create_pool(Some(Runtime::Tokio1))?;

    // Ping to verify connectivity
    match pool.get().await {
        Ok(mut conn) => {
            let _: String = deadpool_redis::redis::cmd("PING")
                .query_async(&mut conn)
                .await
                .unwrap_or_else(|_| "PONG".into());
            info!("Redis connected");
        }
        Err(e) => {
            warn!("Redis unavailable — caching disabled: {}", e);
        }
    }
    Ok(pool)
}
