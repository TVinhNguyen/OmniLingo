use anyhow::Result;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use tracing::info;

/// Create a PostgreSQL connection pool and run all pending migrations.
pub async fn new_pool(database_url: &str) -> Result<PgPool> {
    let pool = PgPoolOptions::new()
        .max_connections(20)
        .acquire_timeout(std::time::Duration::from_secs(10))
        .connect(database_url)
        .await?;

    info!("PostgreSQL connected");
    run_migrations(&pool).await?;
    Ok(pool)
}

/// Run sqlx embedded migrations.
async fn run_migrations(pool: &PgPool) -> Result<()> {
    sqlx::migrate!("./migrations").run(pool).await?;
    info!("Migrations applied successfully");
    Ok(())
}
