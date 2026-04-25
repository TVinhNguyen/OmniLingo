use rdkafka::{
    producer::{FutureProducer, FutureRecord},
    ClientConfig,
};
use serde_json::Value;
use sqlx::{PgPool, Postgres, Transaction};
use std::time::Duration;
use tracing::{error, info, warn};
use uuid::Uuid;

#[derive(Debug)]
pub struct OutboxEvent {
    pub id: i64,
    pub topic: String,
    pub key: String,
    pub payload: Value,
}

/// Enqueue an event into outbox_events as part of an active database transaction.
pub async fn enqueue_event(
    tx: &mut Transaction<'_, Postgres>,
    topic: &str,
    payload: &Value,
) -> Result<(), sqlx::Error> {
    let key = Uuid::new_v4().to_string();
    sqlx::query(
        "INSERT INTO outbox_events (topic, key, payload) VALUES ($1, $2, $3)"
    )
    .bind(topic)
    .bind(&key)
    .bind(payload)
    .execute(&mut **tx)
    .await?;

    Ok(())
}

async fn fetch_pending(tx: &mut Transaction<'_, Postgres>, limit: i64) -> Result<Vec<OutboxEvent>, sqlx::Error> {
    use sqlx::Row;
    let rows = sqlx::query(
        r#"
        SELECT id, topic, key, payload
        FROM outbox_events
        WHERE sent_at IS NULL AND attempts < 5
        ORDER BY created_at
        LIMIT $1
        FOR UPDATE SKIP LOCKED
        "#,
    )
    .bind(limit)
    .fetch_all(&mut **tx)
    .await?;

    let events = rows
        .into_iter()
        .filter_map(|r| {
            Some(OutboxEvent {
                id: r.try_get("id").ok()?,
                topic: r.try_get("topic").ok()?,
                key: r.try_get::<Option<String>, _>("key").ok()?.unwrap_or_default(),
                payload: r.try_get("payload").ok()?,
            })
        })
        .collect();
    Ok(events)
}

async fn mark_sent(tx: &mut Transaction<'_, Postgres>, id: i64) -> Result<(), sqlx::Error> {
    sqlx::query("UPDATE outbox_events SET sent_at=now(), attempts=attempts+1 WHERE id=$1")
        .bind(id)
        .execute(&mut **tx)
        .await?;
    Ok(())
}

async fn mark_failed(tx: &mut Transaction<'_, Postgres>, id: i64, err: &str) -> Result<(), sqlx::Error> {
    sqlx::query("UPDATE outbox_events SET attempts=attempts+1, last_error=$1 WHERE id=$2")
        .bind(err)
        .bind(id)
        .execute(&mut **tx)
        .await?;
    Ok(())
}

/// Start the background outbox relay worker
pub async fn start_relay(brokers: &str, db: PgPool) {
    let producer: FutureProducer = ClientConfig::new()
        .set("bootstrap.servers", brokers)
        .set("message.timeout.ms", "5000")
        .create()
        .expect("failed to create kafka producer");

    info!("Kafka outbox relay started");

    tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(5));
        loop {
            interval.tick().await;

            let mut tx = match db.begin().await {
                Ok(tx) => tx,
                Err(e) => {
                    error!("outbox tx begin error: {}", e);
                    continue;
                }
            };

            match fetch_pending(&mut tx, 50).await {
                Ok(events) if !events.is_empty() => {
                    for event in events {
                        let payload_bytes = event.payload.to_string();
                        let record = FutureRecord::to(&event.topic)
                            .payload(&payload_bytes)
                            .key(&event.key);

                        match producer.send(record, Duration::from_secs(0)).await {
                            Ok(_) => {
                                let _ = mark_sent(&mut tx, event.id).await;
                            }
                            Err((e, _)) => {
                                warn!("failed to publish event {}: {}", event.id, e);
                                let _ = mark_failed(&mut tx, event.id, &e.to_string()).await;
                            }
                        }
                    }

                    if let Err(e) = tx.commit().await {
                        error!("outbox tx commit error: {}", e);
                    }
                }
                Err(e) => {
                    error!("fetch outbox error: {}", e);
                }
                _ => {} // no events, tx dropped = auto-rollback
            }
        }
    });
}
