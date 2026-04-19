# ─── Build stage ──────────────────────────────────────────────────────────────
FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" \
    -o /progress-service ./cmd/server

# ─── Runtime stage ────────────────────────────────────────────────────────────
FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=builder /progress-service /progress-service
COPY --from=builder /app/migrations /migrations

EXPOSE 3008
USER nonroot:nonroot

ENTRYPOINT ["/progress-service"]
