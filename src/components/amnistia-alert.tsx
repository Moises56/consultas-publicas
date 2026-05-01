"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Sparkles } from "lucide-react";

type AmnistiaInfo = {
  fechaFormateada: string;
  diasRestantes: number;
};

export function AmnistiaAlert() {
  const [info, setInfo] = useState<AmnistiaInfo | null>(null);

  useEffect(() => {
    const activa = process.env.NEXT_PUBLIC_AMNISTIA_ACTIVA === "true";
    const fechaFin = process.env.NEXT_PUBLIC_AMNISTIA_FECHA_FIN;
    if (!activa || !fechaFin) return;

    // Honduras (UTC-6): la amnistía vence al final del día indicado.
    const fin = new Date(`${fechaFin}T23:59:59-06:00`);
    if (Number.isNaN(fin.getTime())) return;

    const ahora = new Date();
    if (ahora > fin) return;

    const diasRestantes = Math.max(
      0,
      Math.ceil((fin.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24)),
    );

    setInfo({
      fechaFormateada: fin.toLocaleDateString("es-HN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      diasRestantes,
    });
  }, []);

  if (!info) return null;

  const diasLabel =
    info.diasRestantes === 0
      ? "Último día"
      : info.diasRestantes === 1
        ? "1 día restante"
        : `${info.diasRestantes} días restantes`;

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative isolate overflow-hidden border-b border-[color:var(--gold-700)]/30 bg-gradient-to-r from-[color:var(--gold-500)] via-[color:var(--gold-300)] to-[color:var(--gold-500)] text-[color:var(--brand-900)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,26,79,0.6) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-2.5 md:px-8">
        <div className="flex items-start gap-2.5 sm:items-center">
          <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-900)] text-[color:var(--gold-300)] sm:mt-0">
            <Sparkles className="size-3.5" />
          </span>
          <p className="leading-snug">
            <span className="font-semibold uppercase tracking-[0.12em]">
              Amnistía Tributaria 2026 vigente
            </span>
            <span className="mx-2 hidden text-[color:var(--brand-900)]/40 sm:inline">
              ·
            </span>
            <span className="block font-medium sm:inline">
              Aprovecha hasta el{" "}
              <span className="font-semibold underline decoration-[color:var(--brand-900)]/40 underline-offset-2">
                {info.fechaFormateada}
              </span>
              .
            </span>
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-[color:var(--brand-900)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gold-300)] sm:self-auto">
          <CalendarClock className="size-3.5" />
          {diasLabel}
        </span>
      </div>
    </div>
  );
}
