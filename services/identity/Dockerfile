# ─── Build stage ─────────────────────────────────────────────────────────────
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Cache Go module downloads separately from source
COPY go.mod go.sum ./
RUN go mod download

# Copy source and build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" \
    -o /app/identity-service ./cmd/server

# ─── Final stage (distroless) ─────────────────────────────────────────────────
FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=builder /app/identity-service /identity-service
COPY --from=builder /app/migrations /migrations

EXPOSE 3001
USER nonroot:nonroot

ENTRYPOINT ["/identity-service"]
