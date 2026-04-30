#!/usr/bin/env bash
# ============================================================
# setup.sh — Primer deploy del frontend en el servidor
# ============================================================
# Uso (desde el server, dentro de ~/AmdcFactProyect):
#   git clone https://github.com/Moises56/consultas-publicas.git
#   cd consultas-publicas
#   ./setup.sh
#
# Hace:
#   1. Verifica que .env.production exista (si no, copia desde .example
#      y se detiene para que el usuario edite los valores)
#   2. npm ci
#   3. npm run build
#   4. pm2 start ecosystem.config.js
#   5. pm2 save
#
# Para actualizaciones posteriores, usar ./deploy.sh
# ============================================================

set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f .env.production ]; then
  if [ -f .env.production.example ]; then
    echo "▶ Copiando .env.production.example → .env.production"
    cp .env.production.example .env.production
    echo ""
    echo "✗ Editá .env.production con los valores reales y volvé a correr setup.sh"
    echo "  nano .env.production"
    exit 1
  else
    echo "✗ Falta .env.production.example — algo va mal con el repo."
    exit 1
  fi
fi

echo "▶ [1/4] npm ci"
npm ci

echo "▶ [2/4] npm run build"
npm run build

echo "▶ [3/4] pm2 start ecosystem.config.js"
pm2 start ecosystem.config.js

echo "▶ [4/4] pm2 save"
pm2 save

echo ""
echo "✓ Setup inicial completado: $(date '+%Y-%m-%d %H:%M:%S')"
echo "  Frontend escuchando en http://localhost:3006"
echo "  Reverse proxy: estadosdecuenta.amdc.hn → 192.168.200.82:3006"
echo "  Logs: pm2 logs consultas-publicas-3006"
echo ""
echo "Para actualizar en el futuro: ./deploy.sh"
