use chrono::Utc;
use rdkafka::{
    consumer::{Consumer, StreamConsumer},
    ClientConfig, Message,
};
use serde::Deserialize;
use sqlx::PgPool;
use tracing::{error, info, warn};
use uuid::Uuid;

/// Event payload from vocabulary-service when a card is added.
#[derive(Debug, Deserialize)]
struct CardAddedEvent {
    user_id: Uuid,
    word_id: Uuid,
    language: Option<String>,
    level: Option<String>,
}

/// Start the Kafka consumer in a background task.
/// Subscribes to `vocabulary.card.added` and auto-creates SRS states.
pub async fn start_consumer(brokers: &str, group_id: &str, db: PgPool) {
    let consumer: StreamConsumer = ClientConfig::new()
        .set("group.id", group_id)
        .set("bootstrap.servers", brokers)
        .set("enable.auto.commit", "true")
        .set("auto.offset.reset", "earliest")
        .create()
        .expect("failed to create kafka consumer");

    consumer
        .subscribe(&["vocabulary.card.added"])
        .expect("failed to subscribe to vocabulary.card.added");

    info!("Kafka consumer started — listening on vocabulary.card.added");

    tokio::spawn(async move {
        loop {
            match consumer.recv().await {
                Err(e) => {
                    error!("Kafka receive error: {e}");
                    tokio::time::sleep(std::time::Duration::from_secs(1)).await;
                }
                Ok(msg) => {
                    let payload = msg.payload().unwrap_or_default();
                    match serde_json::from_slice::<CardAddedEvent>(payload) {
                        Ok(evt) => {
                            handle_card_added(&db, evt).await;
                        }
                        Err(e) => {
                            warn!("Failed to parse card.added event: {e}");
                        }
                    }
                }
            }
        }
    });
}

/// Create the initial SRS state for a newly added vocabulary card.
async fn handle_card_added(db: &PgPool, evt: CardAddedEvent) {
    let now = Utc::now();
    let item_id = evt.word_id.to_string();

    let result = sqlx::query(
        r#"INSERT INTO srs_states
           (user_id, item_kind, item_id, stability, difficulty, reps, lapses, state, due_at)
           VALUES ($1, 'vocab', $2, 0, 0, 0, 0, 'new', $3)
           ON CONFLICT (user_id, item_kind, item_id) DO NOTHING"#,
    )
    .bind(evt.user_id)
    .bind(&item_id)
    .bind(now)
    .execute(db)
    .await;

    match result {
        Ok(r) if r.rows_affected() > 0 => {
            info!(
                user_id = %evt.user_id,
                word_id = %evt.word_id,
                "SRS state initialised for new card"
            );
        }
        Ok(_) => {
            // Already exists — skip silently
        }
        Err(e) => {
            error!(
                user_id = %evt.user_id,
                word_id = %evt.word_id,
                "Failed to init SRS state: {e}"
            );
        }
    }
}
