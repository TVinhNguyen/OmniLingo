use std::env;

/// Application configuration loaded from environment variables.
#[derive(Debug, Clone)]
pub struct Config {
    pub env: String,
    pub port: u16,
    pub version: String,

    pub database_url: String,
    pub redis_url: String,

    pub kafka_brokers: String,
    pub kafka_enabled: bool,
    pub kafka_group_id: String,

    pub identity_service_url: String,
    pub allowed_origins: Vec<String>,

    pub log_level: String,
}

impl Config {
    /// Load configuration from environment, applying defaults.
    pub fn load() -> Self {
        Self {
            env: env_or("ENV", "development"),
            port: env_or("PORT", "3005").parse().unwrap_or(3005),
            version: env_or("VERSION", "dev"),

            database_url: env_or(
                "DATABASE_URL",
                "postgres://omnilingo:omnilingo_dev@localhost:5432/srs_db?sslmode=disable",
            ),
            redis_url: env_or("REDIS_URL", "redis://127.0.0.1:6379/"),

            kafka_brokers: env_or("KAFKA_BROKERS", "localhost:9094"),
            kafka_enabled: env_or("KAFKA_ENABLED", "false")
                .to_lowercase()
                .parse()
                .unwrap_or(false),
            kafka_group_id: env_or("KAFKA_GROUP_ID", "srs-service"),

            identity_service_url: env_or("IDENTITY_SERVICE_URL", "http://localhost:3001"),
            allowed_origins: env_or("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173")
                .split(',')
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty())
                .collect(),

            log_level: env_or("LOG_LEVEL", "info"),
        }
    }
}

fn env_or(key: &str, default: &str) -> String {
    env::var(key).unwrap_or_else(|_| default.to_string())
}
