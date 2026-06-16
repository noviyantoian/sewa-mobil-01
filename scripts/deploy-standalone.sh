#!/usr/bin/env bash
# Copy static assets ke dalam standalone output setelah next build
# Tanpa ini, gambar dan CSS tidak akan serve dengan benar
set -e

echo "[deploy] Copying static assets ke standalone..."

# Static JS/CSS Next.js
cp -r .next/static .next/standalone/.next/static

# Public folder (gambar, favicon, dll)
cp -r public .next/standalone/public

echo "[deploy] Done. Jalankan:"
echo "  NODE_ENV=production NODE_OPTIONS='--max-old-space-size=256' node .next/standalone/server.js"
echo "  atau: pm2 start ecosystem.config.js"
