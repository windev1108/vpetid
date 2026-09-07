#!/bin/bash

# ══════════════════════════════════════════════════════════════════════
# VPetId API — VPS Deploy Script
# Chạy:
#   cd /opt/vpetid-api/apps/api
#   bash deploy.sh
#
# Hoặc:
#   bash /opt/vpetid-api/apps/api/deploy.sh
# ══════════════════════════════════════════════════════════════════════

set -euo pipefail

# ── Application config ──────────────────────────────────────────────

APP_DIR="/opt/vpetid-api"
API_DIR="$APP_DIR/apps/api"

COMPOSE_FILE="$API_DIR/docker-compose.prod.yml"
ENV_FILE="$API_DIR/.env.production"
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

[ -d "$API_DIR" ] \
  || error "Không tìm thấy thư mục $API_DIR"

cd "$APP_DIR"

# ── Kiểm tra docker-compose ─────────────────────────────────────────

[ -f "$COMPOSE_FILE" ] \
  || error "Thiếu file $COMPOSE_FILE"

# ── Kiểm tra environment ────────────────────────────────────────────

[ -f "$ENV_FILE" ] \
  || error "Thiếu file $ENV_FILE"

# Load environment variables
set -a
source "$ENV_FILE"
set +a

# ── Kiểm tra PostgreSQL password ────────────────────────────────────

if [ "${POSTGRES_PASSWORD:-}" = "" ]; then
  error "POSTGRES_PASSWORD chưa được cấu hình trong $ENV_FILE"
fi

if [ "${POSTGRES_PASSWORD:-}" = "CHANGE_ME_STRONG_PASSWORD_HERE" ]; then
  error "Hãy đổi POSTGRES_PASSWORD trong $ENV_FILE trước khi deploy!"
fi

# ── Compose project ─────────────────────────────────────────────────

export COMPOSE_PROJECT_NAME="$COMPOSE_PROJECT_NAME"

info "════════════════════════════════════════════════════"
info "Bắt đầu deploy VPetId API"
info "App directory : $APP_DIR"
info "API directory : $API_DIR"
info "Compose file  : $COMPOSE_FILE"
info "Project name  : $COMPOSE_PROJECT_NAME"
info "════════════════════════════════════════════════════"

# ── Pull code mới nhất ──────────────────────────────────────────────

if [ -d "$APP_DIR/.git" ]; then
  info "Pull code mới..."

  git -C "$APP_DIR" pull origin main
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
    exec -T postgres pg_isready \
      -U \"\${POSTGRES_USER:-vpetid}\" \
      -d \"\${POSTGRES_DB:-vpetid}\" >/dev/null 2>&1; do
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

# ── Cleanup old images ──────────────────────────────────────────────

info "Dọn image Docker không sử dụng..."

docker image prune -f

# ── Health check ────────────────────────────────────────────────────

info "Chờ VPetId API khởi động..."

sleep 10

API_STATUS=$(
  docker compose \
    -p "$COMPOSE_PROJECT_NAME" \
    -f "$COMPOSE_FILE" \
    ps api
)

if echo "$API_STATUS" | grep -q "Up\|healthy"; then

  info "════════════════════════════════════════════════════"
  info "✅ VPetId API deploy thành công!"
  info "════════════════════════════════════════════════════"

  docker compose \
    -p "$COMPOSE_PROJECT_NAME" \
    -f "$COMPOSE_FILE" \
    ps

  info "Health check:"

  if curl -fsS http://127.0.0.1:5001/health; then
    echo
    info "✅ API health check OK"
  else
    echo
    warn "API container đang chạy nhưng /health chưa phản hồi."
    warn "Kiểm tra logs bằng:"
    warn "docker logs --tail=100 vpetid-api"
  fi

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
