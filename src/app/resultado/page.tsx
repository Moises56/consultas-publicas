"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, FileSearch, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResultadoDetalle } from "@/components/resultado-detalle";
import { PdfDownloadButton } from "@/components/pdf-download-button";
import { loadResultado, type StoredResultado } from "@/lib/resultado-storage";

export default function ResultadoPage() {
  const [hydrated, setHydrated] = useState(false);
  const [stored, setStored] = useState<StoredResultado | null>(null);

  useEffect(() => {
    setHydrated(true);
    setStored(loadResultado());
  }, []);

  if (!hydrated) {
    return (
      <section className="mx-auto max-w-4xl space-y-4 px-4 py-12 md:px-6 md:py-16">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-72 w-full" />
      </section>
    );
  }

  if (!stored) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 md:px-6">
        <Card className="border-border/70">
          <CardContent className="space-y-5 p-8 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[color:var(--brand-50)] text-[color:var(--brand-700)]">
              <FileSearch className="size-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Aún no hay resultados
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Tu sesión expiró o aún no has realizado una consulta. Vuelve al
                formulario para ingresar tu clave catastral, código ICS o
                número de identidad.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[color:var(--brand-500)] text-white hover:bg-[color:var(--brand-700)]"
            >
              <Link href="/consulta">
                <Search className="size-4" />
                Iniciar consulta
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const { result, query } = stored;

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/consulta"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Nueva consulta
        </Link>
        <span className="rounded-full bg-[color:var(--brand-50)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--brand-700)]">
          {result.tipo === "ec" ? "Bienes Inmuebles" : "Industria y Comercio"}
        </span>
      </div>

      <ResultadoDetalle resultado={result} />

      <div className="mt-8 rounded-2xl border border-border/70 bg-muted/40 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold text-foreground">
              Descarga tu PDF oficial
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              El PDF incluye sello AMDC, código QR de validación y disclaimer.
              Listo para presentar en bancos, notarías y trámites municipales.
            </p>
          </div>
          <PdfDownloadButton query={query} />
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        El saldo es válido por el día solicitado. Para pagos, consulta los
        canales habilitados de la AMDC.
      </p>
    </section>
  );
}
