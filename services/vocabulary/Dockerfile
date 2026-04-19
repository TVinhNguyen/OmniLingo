FROM golang:1.22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache gcc musl-dev sqlite-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=1 GOOS=linux go build -ldflags="-s -w" -o vocabulary-service ./cmd/server

FROM alpine:3.19
WORKDIR /app
RUN apk add --no-cache ca-certificates sqlite-libs

RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup
COPY --from=builder --chown=appuser:appgroup /app/vocabulary-service .

USER appuser
EXPOSE 3004
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget -qO- http://localhost:3004/healthz || exit 1

ENTRYPOINT ["./vocabulary-service"]
