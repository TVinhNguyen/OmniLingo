use prometheus::{
    register_counter_vec, register_histogram_vec, register_int_counter,
    CounterVec, HistogramVec, IntCounter,
};
use once_cell::sync::Lazy;

pub static HTTP_REQUESTS_TOTAL: Lazy<CounterVec> = Lazy::new(|| {
    register_counter_vec!(
        "srs_http_requests_total",
        "Total HTTP requests to srs-service",
        &["method", "route", "status_code"]
    )
    .unwrap()
});

pub static HTTP_REQUEST_DURATION: Lazy<HistogramVec> = Lazy::new(|| {
    register_histogram_vec!(
        "srs_http_request_duration_seconds",
        "HTTP request duration for srs-service",
        &["method", "route"]
    )
    .unwrap()
});

pub static REVIEWS_TOTAL: Lazy<CounterVec> = Lazy::new(|| {
    register_counter_vec!(
        "srs_reviews_total",
        "Total SRS reviews submitted by rating",
        &["rating"]
    )
    .unwrap()
});

pub static BATCH_INIT_TOTAL: Lazy<IntCounter> = Lazy::new(|| {
    register_int_counter!(
        "srs_batch_init_total",
        "Total batch init operations"
    )
    .unwrap()
});

pub static KAFKA_EVENTS_PROCESSED: Lazy<IntCounter> = Lazy::new(|| {
    register_int_counter!(
        "srs_kafka_events_processed_total",
        "Total Kafka events processed (vocabulary.card.added)"
    )
    .unwrap()
});

/// Encode all registered metrics as text/plain for Prometheus scraping.
pub fn render() -> String {
    use prometheus::Encoder;
    let encoder = prometheus::TextEncoder::new();
    let mut buffer = Vec::new();
    encoder
        .encode(&prometheus::gather(), &mut buffer)
        .unwrap_or_default();
    String::from_utf8(buffer).unwrap_or_default()
}
