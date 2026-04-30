/**
 * PM2 ecosystem config — frontend Next.js (puerto 3006)
 *
 * Convención del servidor AMDC: <nombre>-<puerto>
 * El reverse proxy (proxyinverso) redirige estadosdecuenta.amdc.hn → 3006
 *
 * Uso:
 *   pm2 start ecosystem.config.js
 *   pm2 reload ecosystem.config.js --update-env   # tras cambios de .env.production
 *   pm2 logs consultas-publicas-3006
 *   pm2 save
 *
 * Las variables se leen de .env.production (NUNCA commitear ese archivo).
 */
const { readFileSync, existsSync, mkdirSync } = require("fs");
const { resolve } = require("path");

function loadEnvFile(filePath) {
  const env = {};
  const full = resolve(__dirname, filePath);
  if (!existsSync(full)) {
    console.warn(`[ecosystem] AVISO: ${filePath} no existe — se arrancará con env mínimo.`);
    return env;
  }
  try {
    const content = readFileSync(full, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  } catch (e) {
    console.error(`[ecosystem] Error leyendo ${filePath}:`, e.message);
  }
  return env;
}

const logsDir = resolve(__dirname, "logs");
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

const prodEnv = loadEnvFile(".env.production");

module.exports = {
  apps: [
    {
      name: "consultas-publicas-3006",
      script: "node_modules/.bin/next",
      args: "start -p 3006",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        ...prodEnv,
        NODE_ENV: "production",
        PORT: 3006,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      time: true,
      kill_timeout: 5000,
      listen_timeout: 8000,
    },
  ],
};
