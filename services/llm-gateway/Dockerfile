# ─── Build ────────────────────────────────────────────────────────────────────
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /llm-gateway ./cmd/server

# ─── Runtime ──────────────────────────────────────────────────────────────────
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=builder /llm-gateway /llm-gateway
COPY --from=builder /app/migrations /migrations
EXPOSE 3020
USER nonroot:nonroot

ENTRYPOINT ["/llm-gateway"]
