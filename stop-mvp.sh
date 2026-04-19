#!/bin/bash
# Script để dừng toàn bộ các dịch vụ OmniLingo (cả microservices và hạ tầng Docker)

echo "🛑 Đang dừng các dịch vụ OmniLingo..."
echo "--------------------------------------------------------"

# Function kill process at port
kill_port() {
  local port=$1
  local pid=$(fuser $port/tcp 2>/dev/null | awk '{print $1}')
  if [ -n "$pid" ]; then
    echo "  -> Đang dừng tiến trình ở port $port (PID: $pid)..."
    kill -9 $pid 2>/dev/null
  else
    echo "  -> Không có tiến trình nào đang chạy ở port $port"
  fi
}

echo "[1/2] Dừng các Microservices và Frontend..."
kill_port 3000 # frontend web
kill_port 4000 # web-bff
kill_port 3016 # entitlement
kill_port 3007 # progress
kill_port 3004 # vocabulary
kill_port 3002 # learning
kill_port 3001 # identity

# Xóa các file log
echo "  -> Dọn dẹp các file logs tạm..."
rm -f /tmp/omnilingo_*.log

echo ""
echo "[2/2] Dừng hạ tầng Docker..."
docker compose stop

echo "--------------------------------------------------------"
echo "✅ TẤT CẢ DỊCH VỤ ĐÃ ĐƯỢC DỪNG AN TOÀN!"
