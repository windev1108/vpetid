#!/bin/bash

# ══════════════════════════════════════════════════════════════════════
# VPetId API — VPS Deploy Script
# Chạy trên VPS: bash deploy.sh
# ══════════════════════════════════════════════════════════════════════

set -euo pipefail

# ── Application config ──────────────────────────────────────────────
APP_DIR="/opt/vpetid-api"
COMPOSE_FILE="docker-compose.prod.yml"
COMPOSE_PROJECT_NAME="vpetid-api"

# ── Màu sắc output ──────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info() {
  echo -e "${GREEN}[vpetid-deploy]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[warn]${NC} $1"
}

error() {
  echo -e "${RED}[error]${NC} $1"
  exit 1
}

# ── Kiểm tra prerequisites ──────────────────────────────────────────

command -v docker >/dev/null 2>&1 \
  || error "Docker chưa được cài đặt"

docker compose version >/dev/null 2>&1 \
  || error "Docker Compose chưa được cài đặt"

# ── Kiểm tra application directory ─────────────────────────────────

[ -d "$APP_DIR" ] \
  || error "Không tìm thấy thư mục $APP_DIR"

cd "$APP_DIR"

# ── Kiểm tra docker-compose ─────────────────────────────────────────

[ -f "$COMPOSE_FILE" ] \
  || error "Thiếu file $APP_DIR/$COMPOSE_FILE"

# ── Kiểm tra environment ────────────────────────────────────────────

[ -f "$APP_DIR/.env.production" ] \
  || error "Thiếu file $APP_DIR/.env.production"

# Load environment variables
set -a
source "$APP_DIR/.env.production"
set +a

# ── Kiểm tra PostgreSQL password ────────────────────────────────────

if [ "${POSTGRES_PASSWORD:-}" = "" ]; then
  error "POSTGRES_PASSWORD chưa được cấu hình trong .env.production"
fi

if [ "${POSTGRES_PASSWORD:-}" = "CHANGE_ME_STRONG_PASSWORD_HERE" ]; then
  error "Hãy đổi POSTGRES_PASSWORD trong .env.production trước khi deploy!"
fi

# ── Kiểm tra project name ───────────────────────────────────────────

export COMPOSE_PROJECT_NAME="$COMPOSE_PROJECT_NAME"

info "════════════════════════════════════════════════════"
info "Bắt đầu deploy VPetId API"
info "App directory : $APP_DIR"
info "Compose file   : $COMPOSE_FILE"
info "Project name   : $COMPOSE_PROJECT_NAME"
info "════════════════════════════════════════════════════"

# ── Pull code mới nhất ──────────────────────────────────────────────

if [ -d "$APP_DIR/.git" ]; then
  info "Pull code mới..."

  git pull origin main
else
  info "Không phải git repo, bỏ qua bước pull"
fi

# ── Validate Docker Compose ─────────────────────────────────────────

info "Kiểm tra Docker Compose configuration..."

docker compose \
  -p "$COMPOSE_PROJECT_NAME" \
  -f "$COMPOSE_FILE" \
  config >/dev/null

info "Docker Compose configuration hợp lệ"

# ── Build image mới ─────────────────────────────────────────────────

info "Building VPetId API Docker image..."

docker compose \
  -p "$COMPOSE_PROJECT_NAME" \
  -f "$COMPOSE_FILE" \
  build --no-cache api

# ── Start infrastructure ────────────────────────────────────────────

info "Khởi động PostgreSQL + Redis..."

docker compose \
  -p "$COMPOSE_PROJECT_NAME" \
  -f "$COMPOSE_FILE" \
  up -d postgres redis

# ── Chờ PostgreSQL ready ────────────────────────────────────────────

info "Chờ PostgreSQL sẵn sàng..."

if timeout 60 bash -c "
  until docker compose \
    -p '$COMPOSE_PROJECT_NAME' \
    -f '$COMPOSE_FILE' \
    exec -T postgres pg_isready -U \"\${POSTGRES_USER:-vpetid}\"; do
      sleep 2
  done
"; then
  error "PostgreSQL không sẵn sàng sau 60 giây"
fi

info "PostgreSQL đã sẵn sàng"

# ── Start API ────────────────────────────────────────────────────────

info "Khởi động VPetId API..."

docker compose \
  -p "$COMPOSE_PROJECT_NAME" \
  -f "$COMPOSE_FILE" \
  up -d --no-deps api

# ── Start Nginx ─────────────────────────────────────────────────────

if docker compose \
  -p "$COMPOSE_PROJECT_NAME" \
  -f "$COMPOSE_FILE" \
  config --services | grep -qx "nginx"; then

  info "Khởi động Nginx..."

  docker compose \
    -p "$COMPOSE_PROJECT_NAME" \
    -f "$COMPOSE_FILE" \
    up -d nginx
else
  info "Không có service nginx, bỏ qua"
fi

# ── Cleanup old images ──────────────────────────────────────────────

info "Dọn image Docker không sử dụng..."

docker image prune -f

# ── Health check ────────────────────────────────────────────────────

info "Chờ VPetId API health check..."

sleep 10

API_STATUS=$(
  docker compose \
    -p "$COMPOSE_PROJECT_NAME" \
    -f "$COMPOSE_FILE" \
    ps api
)

if echo "$API_STATUS" | grep -q "healthy\|Up"; then

  info "════════════════════════════════════════════════════"
  info "✅ VPetId API deploy thành công!"
  info "════════════════════════════════════════════════════"

  docker compose \
    -p "$COMPOSE_PROJECT_NAME" \
    -f "$COMPOSE_FILE" \
    ps

else

  warn "API chưa healthy."

  warn "Container status:"
  docker compose \
    -p "$COMPOSE_PROJECT_NAME" \
    -f "$COMPOSE_FILE" \
    ps

  warn "API logs:"
  docker compose \
    -p "$COMPOSE_PROJECT_NAME" \
    -f "$COMPOSE_FILE" \
    logs --tail=100 api

  exit 1
fi
