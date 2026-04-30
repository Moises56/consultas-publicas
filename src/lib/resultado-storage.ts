import type { PublicEstadoCuenta, TipoConsulta } from "./types";

export const RESULTADO_STORAGE_KEY = "amdc:resultado";

export interface StoredQuery {
  tipo: TipoConsulta;
  claveCatastral?: string;
  dni?: string;
  ics?: string;
}

export interface StoredResultado {
  query: StoredQuery;
  result: PublicEstadoCuenta;
  ts: number;
}

const MAX_AGE_MS = 30 * 60 * 1000;

export function saveResultado(value: Omit<StoredResultado, "ts">) {
  try {
    sessionStorage.setItem(
      RESULTADO_STORAGE_KEY,
      JSON.stringify({ ...value, ts: Date.now() }),
    );
  } catch {
    // Modo privado o storage lleno: ignoramos.
  }
}

export function loadResultado(): StoredResultado | null {
  try {
    const raw = sessionStorage.getItem(RESULTADO_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredResultado;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.query ||
      !parsed.result ||
      typeof parsed.ts !== "number"
    ) {
      return null;
    }
    if (Date.now() - parsed.ts > MAX_AGE_MS) {
      sessionStorage.removeItem(RESULTADO_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearResultado() {
  try {
    sessionStorage.removeItem(RESULTADO_STORAGE_KEY);
  } catch {
    // ignore
  }
}
