#!/usr/bin/env bash
# ============================================================
# deploy.sh — One-command update del frontend en el servidor
# ============================================================
# Uso (desde el server, dentro de ~/AmdcFactProyect/consultas-publicas):
#   ./deploy.sh
#
# Hace:
#   1. git pull origin main
#   2. npm ci             (instala deps exactas según package-lock.json)
#   3. npm run build      (next build con .env.production)
#   4. pm2 reload ecosystem.config.js --update-env (zero-downtime)
#   5. pm2 save           (persistir para reboot)
#
# Para el primer deploy (clone inicial), usar setup.sh.
# ============================================================

set -euo pipefail

cd "$(dirname "$0")"

echo "▶ [1/5] git pull origin main"
git pull origin main

if [ ! -f .env.production ]; then
  echo "✗ Falta .env.production — copiá .env.production.example y editá los valores."
  exit 1
fi

echo "▶ [2/5] npm ci"
npm ci

echo "▶ [3/5] npm run build"
npm run build

echo "▶ [4/5] pm2 reload ecosystem.config.js --update-env"
if pm2 describe consultas-publicas-3006 >/dev/null 2>&1; then
  pm2 reload ecosystem.config.js --update-env
else
  pm2 start ecosystem.config.js
fi

echo "▶ [5/5] pm2 save"
pm2 save

echo ""
echo "✓ Deploy completado: $(date '+%Y-%m-%d %H:%M:%S')"
echo "  Logs: pm2 logs consultas-publicas-3006"
echo "  Status: pm2 status"
