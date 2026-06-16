#!/usr/bin/env bash
# Copy static assets ke dalam standalone output setelah next build
# Tanpa ini, gambar dan CSS tidak akan serve dengan benar
set -e

STANDALONE=".next/standalone"

# Deteksi path standalone yang aktual (flat vs nested tergantung outputFileTracingRoot)
if [ -f "$STANDALONE/server.js" ]; then
  SERVER_DIR="$STANDALONE"
elif [ -f "$STANDALONE/$(pwd | sed 's|^/||')/server.js" ]; then
  SERVER_DIR="$STANDALONE/$(pwd | sed 's|^/||')"
else
  echo "[deploy] ERROR: server.js tidak ditemukan di standalone output"
  echo "  Cek: find .next/standalone -name server.js"
  exit 1
fi

echo "[deploy] server.js ditemukan di: $SERVER_DIR"
echo "[deploy] Copying static assets..."

mkdir -p "$SERVER_DIR/.next"
cp -r .next/static "$SERVER_DIR/.next/static"
cp -r public "$SERVER_DIR/public"

echo "[deploy] Done."
echo "  Jalankan: NODE_ENV=production NODE_OPTIONS='--max-old-space-size=256' PORT=3005 node $SERVER_DIR/server.js"
echo "  atau: pm2 reload ecosystem.config.cjs --only folkadrive --update-env"
