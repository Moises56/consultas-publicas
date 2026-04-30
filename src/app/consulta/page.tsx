import type { Metadata } from "next";
import { ConsultaForm } from "@/components/consulta-form";
import { HeroAnimated } from "@/components/hero-animated";

export const metadata: Metadata = {
  title: "Consulta tu estado de cuenta",
  description:
    "Consulta en línea tu Estado de Cuenta de Bienes Inmuebles o Industria y Comercio en la AMDC.",
};

type SearchParams = Promise<{ tipo?: string }>;

function parseTipo(value: string | undefined): "ec" | "ics" {
  if (value === "ics") return "ics";
  return "ec";
}

export default async function ConsultaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const tipo = parseTipo(params.tipo);

  return (
    <>
      <HeroAnimated defaultTipo={tipo} />
      <section className="relative -mt-20 pb-28 md:-mt-24 md:pb-32">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <ConsultaForm defaultTipo={tipo} />

          <div className="mt-10 grid gap-3 rounded-2xl border border-[color:var(--paper-deep)] bg-white/60 p-6 text-sm leading-relaxed text-ink-soft backdrop-blur md:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-500)]">
              ¿Necesitas ayuda?
            </p>
            <p>
              <strong className="font-semibold text-ink">
                ¿Cómo encontrar tu clave catastral?
              </strong>{" "}
              Aparece en tu último recibo de pago, en facturas de servicios
              municipales o en notificaciones enviadas por la AMDC.
            </p>
            <p>
              Si tienes problemas con la consulta, puedes acudir a la oficina
              AER (Edificio Ejecutivo AMDC, Av. Cristóbal Colón) o llamar al{" "}
              <a
                href="tel:+50422377989"
                className="font-semibold text-[color:var(--brand-700)] underline-offset-4 hover:underline"
              >
                +504 2237-7989
              </a>
              . También puedes escribir a{" "}
              <a
                href="mailto:gac@amdc.hn"
                className="font-semibold text-[color:var(--brand-700)] underline-offset-4 hover:underline"
              >
                gac@amdc.hn
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
