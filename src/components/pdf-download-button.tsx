"use client";

import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/turnstile-widget";
import type { StoredQuery } from "@/lib/resultado-storage";

interface PdfDownloadButtonProps {
  query: StoredQuery;
}

const ERROR_MESSAGES: Record<string, string> = {
  captcha_invalid:
    "No pudimos validar la verificación. Recarga la página e intenta de nuevo.",
  rate_limit:
    "Has descargado muchos PDF en poco tiempo. Espera unos minutos.",
  not_found: "No encontramos el estado de cuenta para generar el PDF.",
  validation: "No pudimos preparar el PDF con esos datos.",
  server_error: "No pudimos generar el PDF en este momento.",
  network: "No pudimos conectar con el servicio. Revisa tu conexión.",
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function buildFilename(query: StoredQuery): string {
  const id =
    query.tipo === "ec"
      ? query.claveCatastral?.replace(/[^0-9-]/g, "") ||
        query.dni?.replace(/[^0-9]/g, "") ||
        "consulta"
      : query.ics?.replace(/[^0-9A-Za-z-]/g, "") ||
        query.dni?.replace(/[^0-9]/g, "") ||
        "consulta";
  const tipoTag = query.tipo === "ec" ? "EC" : "ICS";
  return `Estado-de-Cuenta-${tipoTag}-${id}.pdf`;
}

export function PdfDownloadButton({ query }: PdfDownloadButtonProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  async function handleDownload() {
    if (loading) return;
    if (!token) {
      toast.info(
        "Estamos validando tu identidad. Espera un momento e intenta nuevamente.",
      );
      turnstileRef.current?.execute();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tipo: query.tipo,
          token,
          claveCatastral: query.claveCatastral,
          dni: query.dni,
          ics: query.ics,
        }),
        cache: "no-store",
      });

      if (!res.ok) {
        let code = "server_error";
        try {
          const err = (await res.json()) as { code?: string };
          if (err && typeof err.code === "string") code = err.code;
        } catch {
          // ignore parse errors
        }
        toast.error(ERROR_MESSAGES[code] ?? ERROR_MESSAGES.server_error);
        turnstileRef.current?.reset();
        setToken(null);
        return;
      }

      const blob = await res.blob();
      if (blob.size === 0 || !blob.type.includes("pdf")) {
        toast.error("La respuesta no contiene un PDF válido.");
        return;
      }
      downloadBlob(blob, buildFilename(query));
      toast.success("PDF descargado.");
      turnstileRef.current?.reset();
      setToken(null);
    } catch {
      toast.error(ERROR_MESSAGES.network);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        size="lg"
        onClick={handleDownload}
        disabled={loading}
        className="h-12 gap-2 rounded-full bg-[color:var(--gold-500)] px-6 text-base font-semibold text-[color:var(--brand-900)] shadow-sm transition-colors hover:bg-[color:var(--gold-300)] disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Generando PDF…
          </>
        ) : (
          <>
            <Download className="size-4" />
            Descargar PDF oficial
          </>
        )}
      </Button>
      <div className="flex items-center gap-3">
        <TurnstileWidget
          ref={turnstileRef}
          onToken={(t) => setToken(t)}
          onError={() => {
            setToken(null);
            toast.error(ERROR_MESSAGES.captcha_invalid);
          }}
          onExpire={() => setToken(null)}
        />
        <p className="text-xs text-muted-foreground">
          Cada descarga emite un nuevo PDF con un código de validación QR
          único.
        </p>
      </div>
    </div>
  );
}
