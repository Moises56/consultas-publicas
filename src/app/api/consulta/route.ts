import { NextResponse, type NextRequest } from "next/server";
import { proxyPayloadSchema } from "@/lib/schemas";
import type { ApiErrorResponse } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// BACKEND_API_URL es server-only (no se filtra al bundle del browser).
// Fallback a NEXT_PUBLIC_API_BASE_URL para compatibilidad con dev.
const API_BASE_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:3009";

function jsonError(
  status: number,
  code: ApiErrorResponse["code"],
  message: string,
) {
  const payload: ApiErrorResponse = { ok: false, status, code, message };
  return NextResponse.json(payload, { status });
}

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "";
  return req.headers.get("x-real-ip") ?? "";
}

/**
 * Exige same-origin en POSTs hacia el proxy: si el browser envía Origin y
 * el hostname no coincide con el del request, devolvemos 403. El browser pone
 * Origin automáticamente en POSTs cross-site, así que esto bloquea CSRF.
 *
 * Comparamos solo HOSTNAME (no protocolo ni puerto) para tolerar el chain
 * típico Cloudflare → WAF → nginx → Next.js, donde el protocolo cambia entre
 * hops (HTTPS público vs HTTP interno) y los puertos también difieren.
 * Para CSRF, hostname matching es suficiente: el browser jamás permitiría a
 * un script de evil.com forjar Origin: estadosdecuenta.amdc.hn.
 */
function enforceSameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return null;
  try {
    const originHostname = new URL(origin).hostname;
    const hostHeader = req.headers.get("host") ?? new URL(req.url).host;
    const expectedHostname = hostHeader.split(":")[0];
    if (originHostname !== expectedHostname) {
      return jsonError(
        403,
        "validation",
        "Origen de la solicitud no permitido.",
      );
    }
  } catch {
    return jsonError(403, "validation", "Origen inválido.");
  }
  return null;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "validation", "Solicitud inválida.");
  }

  const parsed = proxyPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      400,
      "validation",
      "Faltan campos requeridos para la consulta.",
    );
  }

  const payload = parsed.data;
  const url = new URL(
    payload.tipo === "ec"
      ? "/api/public/estado-cuenta"
      : "/api/public/estado-cuenta/ics",
    API_BASE_URL,
  );

  if (payload.tipo === "ec") {
    if (payload.claveCatastral) url.searchParams.set("claveCatastral", payload.claveCatastral);
    if (payload.dni) url.searchParams.set("dni", payload.dni);
  } else {
    if (payload.ics) url.searchParams.set("ics", payload.ics);
    if (payload.dni) url.searchParams.set("dni", payload.dni);
  }

  const sameOrigin = enforceSameOrigin(req);
  if (sameOrigin !== null) return sameOrigin;

  const ip = clientIp(req);
  const browserOrigin = req.headers.get("origin") ?? req.nextUrl.origin;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-turnstile-token": payload.token,
        ...(ip ? { "x-forwarded-for": ip } : {}),
        "user-agent": req.headers.get("user-agent") ?? "amdc-consultas-publicas",
        origin: browserOrigin,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return jsonError(
      502,
      "network",
      "No pudimos conectar con el servicio. Intenta nuevamente en unos minutos.",
    );
  }

  const text = await upstream.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }

  if (upstream.ok) {
    return NextResponse.json(
      {
        ok: true,
        data: { tipo: payload.tipo, data: json },
      },
      { status: 200 },
    );
  }

  switch (upstream.status) {
    case 403:
      return jsonError(
        403,
        "captcha_invalid",
        "No pudimos validar que eres una persona. Recarga la página.",
      );
    case 404:
      return jsonError(
        404,
        "not_found",
        "No encontramos un estado de cuenta con esos datos.",
      );
    case 422:
    case 400:
      return jsonError(
        upstream.status,
        "validation",
        "Revisa los campos. Asegúrate de ingresar la clave o identidad correctamente.",
      );
    case 429:
      return jsonError(
        429,
        "rate_limit",
        "Has hecho muchas consultas en poco tiempo. Espera unos minutos.",
      );
    default:
      return jsonError(
        upstream.status >= 500 ? 502 : upstream.status,
        "server_error",
        "Tuvimos un problema al consultar. Intenta nuevamente.",
      );
  }
}
