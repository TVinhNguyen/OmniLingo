# ─── Build stage ──────────────────────────────────────────────────────────────
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Download deps first (cached layer)
COPY go.mod go.sum ./
RUN go mod download

# Build binary
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w -X main.version=${VERSION:-dev}" \
    -o /payment-service ./cmd/server

# ─── Runtime stage ─────────────────────────────────────────────────────────────
FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=builder /payment-service /payment-service
COPY --from=builder /app/migrations /migrations

EXPOSE 3015
USER nonroot:nonroot

ENTRYPOINT ["/payment-service"]
