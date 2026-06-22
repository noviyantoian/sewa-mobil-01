#!/usr/bin/env bash
#
# Provision one FolkaDrive client instance on a SHARED VPS, conflict-safe.
#
#   Usage:  scripts/new-client.sh <slug> <domain> [port]
#   Example: scripts/new-client.sh folkastudio folkadrive.folkastudio.com 39001
#
# Required env (secrets — never passed as args, never logged):
#   FOLKADRIVE_DB_PASSWORD   password of the shared `folkadrive` Postgres role
#   ADMIN_EMAIL              admin login email (also added to ADMIN_EMAILS)
#   ADMIN_PASSWORD           admin login password (min 8 chars)
# Optional env:
#   BETTER_AUTH_SECRET       generated if unset (openssl rand -base64 32)
#   TENANT_PLAN              starter|growth|business|enterprise (default business)
#   R2_ACCOUNT_ID R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_BUCKET R2_PUBLIC_BASE_URL
#   NEXT_PUBLIC_ASSET_BASE_URL NEXT_PUBLIC_SITE_URL
#   DB_SUPERUSER (default postgres)  DB_HOST (localhost)  DB_PORT (5432)
#   FOLKADRIVE_BASE_DIR (default /var/www/folkadrive)
#   CERTBOT_EMAIL            if set + certbot present, TLS is issued automatically
#
# Prereqs: run scripts/db/bootstrap-roles.sql once per cluster, and build the app
# (pnpm build && bash scripts/deploy-standalone.sh) before running this.
set -euo pipefail

SLUG="${1:-}"
DOMAIN="${2:-}"
PORT="${3:-}"
if [[ -z "$SLUG" || -z "$DOMAIN" ]]; then
  echo "usage: $0 <slug> <domain> [port]" >&2
  exit 1
fi
if ! [[ "$SLUG" =~ ^[a-z0-9-]+$ ]]; then
  echo "slug must be [a-z0-9-]" >&2
  exit 1
fi

: "${FOLKADRIVE_DB_PASSWORD:?set FOLKADRIVE_DB_PASSWORD}"
: "${ADMIN_EMAIL:?set ADMIN_EMAIL}"
: "${ADMIN_PASSWORD:?set ADMIN_PASSWORD}"
if (( ${#ADMIN_PASSWORD} < 8 )); then echo "ADMIN_PASSWORD must be >= 8 chars" >&2; exit 1; fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

DB_SUPER="${DB_SUPERUSER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
BASE_DIR="${FOLKADRIVE_BASE_DIR:-/var/www/folkadrive}"
TENANT_PLAN="${TENANT_PLAN:-business}"
BETTER_AUTH_SECRET="${BETTER_AUTH_SECRET:-$(openssl rand -base64 32)}"

DB_NAME="folkadrive_${SLUG//-/_}"
APP_NAME="folkadrive-${SLUG}"
DIR="${BASE_DIR}/${SLUG}"
VHOST="/etc/nginx/sites-available/${APP_NAME}.conf"

psql_super() { sudo -u "$DB_SUPER" psql -h "$DB_HOST" -p "$DB_PORT" -v ON_ERROR_STOP=1 "$@"; }

port_busy() { ss -ltnH 2>/dev/null | awk '{print $4}' | grep -qE "[:.]$1\$"; }

# ── conflict checks (shared VPS) ─────────────────────────────────────────────
if [[ -z "$PORT" ]]; then
  for p in $(seq 39001 39099); do
    if ! port_busy "$p"; then PORT="$p"; break; fi
  done
  [[ -n "$PORT" ]] || { echo "no free port in 39001-39099" >&2; exit 1; }
fi
port_busy "$PORT" && { echo "port $PORT already in use" >&2; exit 1; }
pm2 describe "$APP_NAME" >/dev/null 2>&1 && { echo "pm2 app $APP_NAME already exists" >&2; exit 1; }
[[ -e "$VHOST" ]] && { echo "nginx vhost $VHOST already exists" >&2; exit 1; }
if psql_super -tAc "select 1 from pg_database where datname='$DB_NAME'" | grep -q 1; then
  echo "database $DB_NAME already exists" >&2; exit 1
fi

echo "==> client=$SLUG domain=$DOMAIN port=$PORT db=$DB_NAME app=$APP_NAME"

# ── database ─────────────────────────────────────────────────────────────────
psql_super -c "CREATE DATABASE \"$DB_NAME\" OWNER folkadrive;"
# Shared-cluster safety: assert the RLS roles' attributes (idempotent).
psql_super -c "ALTER ROLE app_user NOBYPASSRLS;" || true
psql_super -c "ALTER ROLE folkadrive BYPASSRLS;" || true

DBURL="postgres://folkadrive:${FOLKADRIVE_DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo "==> migrate"
( cd "$REPO_DIR" && DATABASE_URL="$DBURL" node scripts/migrate.mjs )

echo "==> seed plans + tenant"
PGPASSWORD="$FOLKADRIVE_DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U folkadrive -d "$DB_NAME" -v ON_ERROR_STOP=1 <<SQL
insert into plans (id, name, max_cars, max_users) values
  ('starter','Starter',5,1),
  ('growth','Growth',20,3),
  ('business','Business',100,10),
  ('enterprise','Enterprise',100000,null)
on conflict (id) do nothing;
insert into tenants (slug, name, plan_id)
  values ('${SLUG}', '${SLUG}', '${TENANT_PLAN}')
  on conflict (slug) do nothing;
SQL

echo "==> create admin"
( cd "$REPO_DIR" && DATABASE_URL="$DBURL" ADMIN_EMAIL="$ADMIN_EMAIL" ADMIN_PASSWORD="$ADMIN_PASSWORD" \
    node scripts/create-admin.mjs )

# ── deploy files ─────────────────────────────────────────────────────────────
echo "==> copy standalone build + write .env"
if [[ ! -f "$REPO_DIR/.next/standalone/server.js" ]]; then
  echo "missing $REPO_DIR/.next/standalone/server.js — run: pnpm build && bash scripts/deploy-standalone.sh" >&2
  exit 1
fi
mkdir -p "$DIR/logs" "$DIR/.next"
cp -r "$REPO_DIR/.next/standalone/." "$DIR/.next/standalone/"

umask 077
cat > "$DIR/.env" <<ENV
DATABASE_URL=$DBURL
TENANT_SLUG=$SLUG
BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
BETTER_AUTH_URL=https://$DOMAIN
ADMIN_EMAILS=$ADMIN_EMAIL
R2_ACCOUNT_ID=${R2_ACCOUNT_ID:-}
R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID:-}
R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY:-}
R2_BUCKET=${R2_BUCKET:-}
R2_PUBLIC_BASE_URL=${R2_PUBLIC_BASE_URL:-}
NEXT_PUBLIC_ASSET_BASE_URL=${NEXT_PUBLIC_ASSET_BASE_URL:-}
NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-https://$DOMAIN}
ENV
chmod 600 "$DIR/.env"

# Per-client PM2 config (self-contained — does not touch the shared ecosystem).
cat > "$DIR/pm2.config.cjs" <<PM2
module.exports = { apps: [{
  name: "$APP_NAME",
  cwd: "$DIR/.next/standalone",
  script: "server.js",
  node_args: "--env-file-if-exists=$DIR/.env --max-old-space-size=256",
  exec_mode: "fork", instances: 1,
  env: { NODE_ENV: "production", PORT: "$PORT", HOSTNAME: "127.0.0.1" },
  autorestart: true, max_memory_restart: "320M", max_restarts: 10, restart_delay: 3000,
  out_file: "$DIR/logs/out.log", error_file: "$DIR/logs/error.log",
  merge_logs: true, log_date_format: "YYYY-MM-DD HH:mm:ss",
}]};
PM2

echo "==> pm2 start"
pm2 start "$DIR/pm2.config.cjs"
pm2 save

# ── nginx vhost (exact server_name — never a catch-all) ──────────────────────
echo "==> nginx vhost"
sudo cp "$REPO_DIR/nginx/folkadrive.conf.template" "$VHOST"
sudo sed -i "s/{{DOMAIN}}/$DOMAIN/g; s/{{PORT}}/$PORT/g" "$VHOST"
sudo ln -sf "$VHOST" "/etc/nginx/sites-enabled/${APP_NAME}.conf"
sudo nginx -t
sudo systemctl reload nginx

# ── TLS ──────────────────────────────────────────────────────────────────────
if command -v certbot >/dev/null 2>&1 && [[ -n "${CERTBOT_EMAIL:-}" ]]; then
  echo "==> certbot (TLS)"
  sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$CERTBOT_EMAIL" --redirect
else
  echo "==> TLS: run manually -> sudo certbot --nginx -d $DOMAIN"
fi

echo ""
echo "DONE: https://$DOMAIN"
echo "  app=$APP_NAME  port=$PORT  db=$DB_NAME  dir=$DIR"
echo "  Point DNS A record for $DOMAIN at this VPS, then verify the cert issued."
