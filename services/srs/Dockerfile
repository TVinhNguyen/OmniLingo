FROM rust:1.78-alpine AS builder
WORKDIR /app
RUN apk add --no-cache musl-dev openssl-dev pkgconfig libc-dev

COPY Cargo.toml Cargo.lock* ./
# Cache dependencies
RUN mkdir src && echo "fn main(){}" > src/main.rs && cargo build --release 2>/dev/null || true
RUN rm -rf src

COPY src ./src
COPY migrations ./migrations
RUN cargo build --release

FROM alpine:3.19
WORKDIR /app
RUN apk add --no-cache ca-certificates

RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup
COPY --from=builder --chown=appuser:appgroup /app/target/release/srs-service .
COPY --from=builder --chown=appuser:appgroup /app/migrations ./migrations

USER appuser
EXPOSE 3005
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:3005/healthz || exit 1

ENTRYPOINT ["./srs-service"]
