#!/usr/bin/env bash
#
# One-command VPS deploy for the Kasplex site + faucet backend.
#
#   sudo ./deploy/deploy.sh
#
# Idempotent: re-run any time to pull new config, rebuild the frontend, and
# restart the backend. See deploy/README.md for details.
#
set -euo pipefail

# ---------------------------------------------------------------------------
# 0. Locate repo, load config
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
FRONTEND_DIR="${REPO_DIR}/website2-main"
BACKEND_DIR="${REPO_DIR}/faucet-server"
CONFIG="${SCRIPT_DIR}/deploy.config"

log()  { printf '\033[36m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[33m[!]\033[0m %s\n' "$*"; }
die()  { printf '\033[31m[x]\033[0m %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Run as root (sudo)."
[ -f "${CONFIG}" ] || die "Missing ${CONFIG}. Copy deploy.config.example to deploy.config and fill it in."
# shellcheck disable=SC1090
source "${CONFIG}"

: "${RPC_URL:?set RPC_URL in deploy.config}"
: "${FAUCET_PRIVATE_KEY:?set FAUCET_PRIVATE_KEY in deploy.config}"
DOMAIN="${DOMAIN:-}"
FAUCET_PORT="${FAUCET_PORT:-8790}"
SERVICE_USER="${SERVICE_USER:-root}"
STATE_DIR="/var/lib/kasplex-faucet"
BACKEND_ENV="/etc/kasplex-faucet.env"
SERVICE="/etc/systemd/system/kasplex-faucet.service"
CADDYFILE="/etc/caddy/Caddyfile"

# ---------------------------------------------------------------------------
# 1. System dependencies: Node 22 LTS + Caddy
# ---------------------------------------------------------------------------
install_node() {
  local major=0
  if command -v node >/dev/null 2>&1; then
    major="$(node -p 'process.versions.node.split(".")[0]')"
  fi
  if [ "${major}" -ge 20 ]; then
    log "Node $(node -v) already installed."
    # Vite 7 needs 20.19+; if on a 20.x older than .19, upgrade to 22.
    if [ "${major}" -eq 20 ]; then
      local minor; minor="$(node -p 'process.versions.node.split(".")[1]')"
      [ "${minor}" -ge 19 ] && return 0
      warn "Node 20.${minor} is below Vite's 20.19 requirement; installing Node 22."
    else
      return 0
    fi
  fi
  log "Installing Node 22 LTS (NodeSource)..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
}

install_caddy() {
  if command -v caddy >/dev/null 2>&1; then
    log "Caddy already installed ($(caddy version | head -1))."
    return 0
  fi
  log "Installing Caddy (official repo)..."
  apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
    | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
    | tee /etc/apt/sources.list.d/caddy-stable.list >/dev/null
  apt-get update
  apt-get install -y caddy
}

log "Updating apt and installing base tools..."
apt-get update -y
apt-get install -y curl gnupg ca-certificates
install_node
install_caddy

# ---------------------------------------------------------------------------
# 2. Backend: deps, state dir, env file, systemd service
# ---------------------------------------------------------------------------
log "Installing backend dependencies..."
( cd "${BACKEND_DIR}" && npm install --no-audit --no-fund )

log "Preparing persistent state dir ${STATE_DIR}..."
mkdir -p "${STATE_DIR}"
if [ "${SERVICE_USER}" != "root" ]; then
  id "${SERVICE_USER}" >/dev/null 2>&1 || useradd --system --no-create-home --shell /usr/sbin/nologin "${SERVICE_USER}"
  chown -R "${SERVICE_USER}:${SERVICE_USER}" "${STATE_DIR}"
fi

log "Writing backend env file ${BACKEND_ENV} (mode 600)..."
umask 077
cat > "${BACKEND_ENV}" <<EOF
RPC_URL=${RPC_URL}
FAUCET_PRIVATE_KEY=${FAUCET_PRIVATE_KEY}
CHAIN_ID=${CHAIN_ID:-}
PORT=${FAUCET_PORT}
DRIP_KAS=${DRIP_KAS:-50}
COOLDOWN_HOURS=${COOLDOWN_HOURS:-24}
BALANCE_CAP_KAS=${BALANCE_CAP_KAS:-2}
HOURLY_BUDGET=${HOURLY_BUDGET:-100}
STATE_FILE=${STATE_DIR}/faucet-state.json
ALLOW_ORIGIN=*
EOF
umask 022

log "Writing systemd unit ${SERVICE}..."
TSX_BIN="${BACKEND_DIR}/node_modules/.bin/tsx"
[ -x "${TSX_BIN}" ] || die "tsx not found at ${TSX_BIN} (backend npm install failed?)"
cat > "${SERVICE}" <<EOF
[Unit]
Description=Kasplex L2 testnet faucet backend
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=${SERVICE_USER}
WorkingDirectory=${BACKEND_DIR}
EnvironmentFile=${BACKEND_ENV}
ExecStart=${TSX_BIN} src/server.ts
Restart=always
RestartSec=3
# hardening (loosen if it interferes with your setup)
NoNewPrivileges=true
ProtectSystem=full
ReadWritePaths=${STATE_DIR}

[Install]
WantedBy=multi-user.target
EOF

log "Enabling + restarting backend service..."
systemctl daemon-reload
systemctl enable kasplex-faucet >/dev/null 2>&1 || true
systemctl restart kasplex-faucet

# ---------------------------------------------------------------------------
# 3. Frontend: build
# ---------------------------------------------------------------------------
log "Installing frontend dependencies + building..."
( cd "${FRONTEND_DIR}" && npm install --legacy-peer-deps --no-audit --no-fund && npm run build )
DIST_DIR="${FRONTEND_DIR}/dist"
[ -f "${DIST_DIR}/index.html" ] || die "Build produced no ${DIST_DIR}/index.html"

# ---------------------------------------------------------------------------
# 4. Caddy: static site + SPA fallback + /faucet-api reverse proxy
# ---------------------------------------------------------------------------
SITE_ADDR="${DOMAIN}"
if [ -z "${DOMAIN}" ]; then
  SITE_ADDR=":80"
  warn "No DOMAIN set — serving plain HTTP on :80 (no TLS)."
fi

log "Writing ${CADDYFILE}..."
cat > "${CADDYFILE}" <<EOF
${SITE_ADDR} {
	encode gzip zstd

	# Faucet backend — /faucet-api/* -> local service (prefix stripped)
	handle_path /faucet-api/* {
		reverse_proxy 127.0.0.1:${FAUCET_PORT}
	}

	# Static SPA — BrowserRouter needs unknown paths to fall back to index.html
	handle {
		root * ${DIST_DIR}
		try_files {path} /index.html
		file_server
	}
}
EOF

log "Reloading Caddy..."
systemctl enable caddy >/dev/null 2>&1 || true
caddy validate --config "${CADDYFILE}" >/dev/null
systemctl restart caddy

# ---------------------------------------------------------------------------
# 5. Summary + health check
# ---------------------------------------------------------------------------
sleep 2
log "Backend health:"
curl -fsS "http://127.0.0.1:${FAUCET_PORT}/health" || warn "backend /health not responding yet — check: journalctl -u kasplex-faucet -e"
echo
log "Done."
echo "  Frontend : ${DOMAIN:+https://${DOMAIN}}${DOMAIN:-http://<server-ip>}"
echo "  Faucet API via site : ${DOMAIN:+https://${DOMAIN}}${DOMAIN:-http://<server-ip>}/faucet-api/health"
echo "  Backend logs : journalctl -u kasplex-faucet -f"
echo "  Caddy logs   : journalctl -u caddy -f"
echo "  Fund the faucet address shown in /health, then it can drip."
