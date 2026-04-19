#!/bin/bash
# Script để khởi động đồng loạt các dịch vụ OmniLingo cho mục đích dev local (MVP 1)

set -u

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Bắt đầu quá trình khởi chạy OmniLingo services..."
echo "--------------------------------------------------------"

# 1. Khởi chạy Docker containers nếu chưa chạy
echo "[1/4] Kiểm tra các containers hạ tầng cơ bản (Postgres, Redis, Kafka...)"
docker compose up -d

# Đợi db ready
echo "Đang đợi infrastructure sẵn sàng (5s)..."
sleep 5

# Set Global Env cho Go paths & Node paths
export PATH="$HOME/go/bin:/usr/local/go/bin:$PATH"
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"

# Function kill process at port
kill_port() {
  fuser -k $1/tcp 2>/dev/null
}

echo "[2/4] Dừng các service OmniLingo hiện có (nếu có)..."
kill_port 3001 # identity
kill_port 3002 # learning
kill_port 3004 # vocabulary
kill_port 3007 # progress
kill_port 3016 # entitlement
kill_port 4000 # web-bff
kill_port 3000 # frontend web
sleep 2

# Xóa output logs cũ
rm -f /tmp/omnilingo_*.log

echo "[3/4] Khởi chạy các Backend Microservices..."

export JWKS_URL="http://localhost:3001/.well-known/jwks.json"

# Identity Service
echo "  -> Starting identity-service (Port: 3001)"
(cd "$ROOT_DIR/services/identity" && nohup go run ./cmd/server/main.go > /tmp/omnilingo_identity.log 2>&1) &
sleep 3 # Cần identity chạy trước để sinh JWT keys

# Learning Service
echo "  -> Starting learning-service (Port: 3002)"
(cd "$ROOT_DIR/services/learning" && nohup go run ./cmd/server/main.go > /tmp/omnilingo_learning.log 2>&1) &

# Vocabulary Service
echo "  -> Starting vocabulary-service (Port: 3004)"
(cd "$ROOT_DIR/services/vocabulary" && DATABASE_URL="postgres://omnilingo:omnilingo_dev@localhost:5432/vocabulary_db?sslmode=disable" nohup go run ./cmd/server/main.go > /tmp/omnilingo_vocabulary.log 2>&1) &

# Progress Service
echo "  -> Starting progress-service (Port: 3007)"
(cd "$ROOT_DIR/services/progress" && PORT=3007 nohup go run ./cmd/server/main.go > /tmp/omnilingo_progress.log 2>&1) &

# Entitlement Service
echo "  -> Starting entitlement-service (Port: 3016)"
(cd "$ROOT_DIR/services/entitlement" && nohup go run ./cmd/server/main.go > /tmp/omnilingo_entitlement.log 2>&1) &

echo "Đang đợi backend sẵn sàng (4s)..."
sleep 4

echo "[4/4] Khởi chạy BFF và Frontend Web..."

# Web BFF
echo "  -> Starting web-bff (Port: 4000)"
(cd "$ROOT_DIR/services/web-bff" && nohup npm run dev > /tmp/omnilingo_bff.log 2>&1) &

# Frontend NextJS Web (Optional: Thường chạy npm run dev riêng trên terminal để xem hot-reload)
echo "  -> Starting NextJS frontend (Port: 3000)"
(cd "$ROOT_DIR/apps/web" && nohup npm run dev > /tmp/omnilingo_web.log 2>&1) &

echo "--------------------------------------------------------"
echo "✅ HOÀN THÀNH!"
echo ""
echo "Các service đã sẵn sàng:"
echo "- Frontend:      http://localhost:3000"
echo "- GraphQL BFF:   http://localhost:4000/graphql"
echo "- Identity:      http://localhost:3001/healthz"
echo "- Logs:"
echo "  tail -f /tmp/omnilingo_web.log"
echo "  tail -f /tmp/omnilingo_bff.log"
echo "  tail -f /tmp/omnilingo_identity.log"
