import type { ApiResponse, PublicEstadoCuenta } from "./types";
import type { ConsultaProxyPayload } from "./schemas";

export async function consultarEstadoCuenta(
  payload: ConsultaProxyPayload,
): Promise<ApiResponse<PublicEstadoCuenta>> {
  try {
    const res = await fetch("/api/consulta", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = (await res.json().catch(() => null)) as
      | ApiResponse<PublicEstadoCuenta>
      | null;

    if (json && typeof json === "object" && "ok" in json) {
      return json;
    }

    return {
      ok: false,
      status: res.status,
      code: "server_error",
      message: "El servidor devolvió una respuesta inesperada.",
    };
  } catch {
    return {
      ok: false,
      status: 0,
      code: "network",
      message: "No pudimos conectar con el servicio. Revisa tu conexión.",
    };
  }
}
