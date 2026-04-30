import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  BadgeCheck,
  ArrowRight,
  ShieldCheck,
  FileSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Validación de documento",
  description:
    "Verificación de Estado de Cuenta emitido por la Alcaldía Municipal del Distrito Central.",
  robots: { index: false, follow: false },
};

type Params = Promise<{ id: string }>;

function isValidId(id: string): boolean {
  // logId es UUID v4 generado por el backend
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id,
  );
}

export default async function ValidacionPage({ params }: { params: Params }) {
  const { id } = await params;
  const valid = isValidId(id);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-4 py-12 md:px-6">
      <Card className="overflow-hidden border-border/70 ring-paper">
        <div
          aria-hidden
          className="pointer-events-none h-1.5 w-full bg-gradient-to-r from-[color:var(--brand-700)] via-[color:var(--brand-500)] to-[color:var(--gold-500)]"
        />
        <CardContent className="space-y-7 p-8 md:p-10">
          <div className="flex items-center gap-4">
            <Image
              src="/escudo-amdc.png"
              alt=""
              width={56}
              height={56}
              className="h-14 w-auto"
              priority
            />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--brand-500)]">
                Verificación de documento
              </p>
              <p className="font-display text-xl tracking-tight text-ink md:text-2xl">
                Alcaldía Municipal del Distrito Central
              </p>
            </div>
          </div>

          {valid ? (
            <>
              <div className="rounded-2xl border border-[color:var(--brand-500)]/20 bg-[color:var(--brand-50)]/60 p-6">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 size-6 shrink-0 text-[color:var(--brand-700)]" />
                  <div className="space-y-2">
                    <h1 className="font-display text-2xl tracking-tight text-ink md:text-3xl">
                      Documento emitido por AMDC
                    </h1>
                    <p className="text-sm leading-relaxed text-ink-soft md:text-[15px]">
                      Este código QR pertenece a un Estado de Cuenta generado
                      por el portal oficial{" "}
                      <strong className="text-ink">
                        estadosdecuenta.amdc.hn
                      </strong>
                      . El identificador único es:
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-border/70 bg-[color:var(--paper)]/60 p-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-ink-soft/70">
                  Identificador del documento
                </p>
                <p className="mt-1 break-all font-mono text-xs text-ink md:text-sm">
                  {id}
                </p>
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-ink-soft">
                <p className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[color:var(--brand-500)]" />
                  <span>
                    El saldo reflejado en el PDF era válido al momento de la
                    consulta. Para verificar el estado actual, realiza una
                    consulta nueva.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[color:var(--brand-500)]" />
                  <span>
                    AMDC no almacena datos personales identificables del
                    consultante en este portal.
                  </span>
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
              <div className="flex items-start gap-3">
                <FileSearch className="mt-0.5 size-6 shrink-0 text-destructive" />
                <div className="space-y-2">
                  <h1 className="font-display text-2xl tracking-tight text-ink md:text-3xl">
                    Identificador inválido
                  </h1>
                  <p className="text-sm leading-relaxed text-ink-soft md:text-[15px]">
                    El identificador <code className="break-all">{id}</code> no
                    tiene el formato de un documento emitido por este portal.
                    Si escaneaste un PDF reciente y ves esta página, contacta a
                    AER para validar el documento manualmente.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              asChild
              size="lg"
              className="group h-12 gap-2 rounded-full bg-[color:var(--brand-700)] px-6 text-[15px] font-semibold tracking-tight text-white hover:bg-[color:var(--brand-900)] sm:w-auto"
            >
              <Link href="/consulta">
                Hacer una consulta nueva
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <p className="text-xs text-ink-soft/70">
              ¿Dudas? Contacta a AER:{" "}
              <a
                href="tel:+50422377989"
                className="font-medium text-[color:var(--brand-700)] hover:underline"
              >
                +504 2237-7989
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
