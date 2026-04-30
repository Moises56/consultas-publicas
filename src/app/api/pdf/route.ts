import { NextResponse, type NextRequest } from "next/server";
import { pdfProxyPayloadSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// BACKEND_API_URL es server-only (no se filtra al bundle del browser).
// Fallback a NEXT_PUBLIC_API_BASE_URL para compatibilidad con dev.
const API_BASE_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:3009";

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "";
  return req.headers.get("x-real-ip") ?? "";
}

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json(
    { ok: false, status, code, message },
    { status },
  );
}

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
  const sameOrigin = enforceSameOrigin(req);
  if (sameOrigin !== null) return sameOrigin;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "validation", "Solicitud inválida.");
  }

  const parsed = pdfProxyPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      400,
      "validation",
      "Faltan campos requeridos para descargar el PDF.",
    );
  }

  const payload = parsed.data;
  const url = new URL(
    payload.tipo === "ec"
      ? "/api/public/estado-cuenta/pdf"
      : "/api/public/estado-cuenta/ics/pdf",
    API_BASE_URL,
  );

  const upstreamBody =
    payload.tipo === "ec"
      ? {
          ...(payload.claveCatastral
            ? { claveCatastral: payload.claveCatastral }
            : {}),
          ...(payload.dni ? { dni: payload.dni } : {}),
        }
      : {
          ...(payload.ics ? { ics: payload.ics } : {}),
          ...(payload.dni ? { dni: payload.dni } : {}),
        };

  const ip = clientIp(req);
  const browserOrigin = req.headers.get("origin") ?? req.nextUrl.origin;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/pdf,application/json",
        "x-turnstile-token": payload.token,
        ...(ip ? { "x-forwarded-for": ip } : {}),
        "user-agent":
          req.headers.get("user-agent") ?? "amdc-consultas-publicas",
        origin: browserOrigin,
      },
      body: JSON.stringify(upstreamBody),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    return jsonError(
      502,
      "network",
      "No pudimos conectar con el servicio de PDF. Intenta nuevamente.",
    );
  }

  if (!upstream.ok) {
    let serverMessage = "";
    try {
      const errJson = await upstream.json();
      if (errJson && typeof errJson === "object" && "message" in errJson) {
        serverMessage = String((errJson as { message?: unknown }).message ?? "");
      }
    } catch {
      serverMessage = await upstream.text().catch(() => "");
    }

    switch (upstream.status) {
      case 403:
        return jsonError(
          403,
          "captcha_invalid",
          "No pudimos validar la verificación. Recarga e intenta nuevamente.",
        );
      case 404:
        return jsonError(
          404,
          "not_found",
          "No encontramos un estado de cuenta para generar el PDF.",
        );
      case 422:
      case 400:
        return jsonError(
          upstream.status,
          "validation",
          serverMessage || "Datos insuficientes para el PDF.",
        );
      case 429:
        return jsonError(
          429,
          "rate_limit",
          "Has descargado muchos PDF en poco tiempo. Espera unos minutos.",
        );
      default:
        return jsonError(
          upstream.status >= 500 ? 502 : upstream.status,
          "server_error",
          "No pudimos generar el PDF en este momento.",
        );
    }
  }

  const buffer = await upstream.arrayBuffer();
  const headers = new Headers();
  headers.set(
    "content-type",
    upstream.headers.get("content-type") ?? "application/pdf",
  );
  const disposition =
    upstream.headers.get("content-disposition") ??
    `attachment; filename="estado-cuenta-amdc.pdf"`;
  headers.set("content-disposition", disposition);
  headers.set("cache-control", "no-store");

  return new NextResponse(buffer, { status: 200, headers });
}
