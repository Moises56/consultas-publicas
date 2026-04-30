import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// CSP: aliasa los dominios externos que el browser realmente toca.
// El backend NestJS NO va aquí — el browser solo habla con same-origin
// (`/api/consulta`, `/api/pdf`); la conexión al backend es server-side.
const cspDirectives = [
  `default-src 'self'`,
  // Next 16 inyecta scripts inline para hidratación; en dev también HMR.
  `script-src 'self' 'unsafe-inline' ${isProd ? "" : "'unsafe-eval'"} https://challenges.cloudflare.com`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com data:`,
  `img-src 'self' data: blob: https://amdc.hn https://*.amdc.hn`,
  `connect-src 'self' https://challenges.cloudflare.com${isProd ? "" : " ws: wss:"}`,
  `frame-src https://challenges.cloudflare.com`,
  `frame-ancestors 'none'`,
  `form-action 'self'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `manifest-src 'self'`,
  isProd ? `upgrade-insecure-requests` : "",
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspDirectives,
  },
  {
    key: "Strict-Transport-Security",
    // 2 años, subdominios y preload-ready (solo aplica vía HTTPS)
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "amdc.hn",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amdc.hn",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Aplica a todas las rutas
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
