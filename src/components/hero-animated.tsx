"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

const amnistiaActiva = process.env.NEXT_PUBLIC_AMNISTIA_ACTIVA === "true";

interface HeroAnimatedProps {
  defaultTipo?: "ec" | "ics";
}

export function HeroAnimated({ defaultTipo }: HeroAnimatedProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-eyebrow]", { y: 12, opacity: 0, duration: 0.5 })
        .from(
          "[data-hero-title-line]",
          { y: 28, opacity: 0, duration: 0.7, stagger: 0.08 },
          "-=0.2",
        )
        .from(
          "[data-hero-sub]",
          { y: 16, opacity: 0, duration: 0.5 },
          "-=0.4",
        )
        .from(
          "[data-hero-chip]",
          { y: 8, opacity: 0, stagger: 0.08, duration: 0.4 },
          "-=0.3",
        );

      gsap.to("[data-hero-orb]", {
        y: -20,
        duration: 4.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to("[data-hero-orb-2]", {
        y: 16,
        x: -10,
        duration: 5.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: root },
  );

  const titulo =
    defaultTipo === "ics"
      ? { lead: "Consulta tu", emphasis: "Estado de Cuenta", tail: "de Industria y Comercio." }
      : defaultTipo === "ec"
        ? { lead: "Consulta tu", emphasis: "Estado de Cuenta", tail: "de Bienes Inmuebles." }
        : { lead: "Consulta tu", emphasis: "Estado de Cuenta", tail: "con la AMDC." };

  const sub =
    defaultTipo === "ics"
      ? "Identifícate con tu código ICS, DNI o RTN. Verás los totales en pantalla y descargarás el PDF oficial."
      : defaultTipo === "ec"
        ? "Identifícate con la clave catastral o tu número de identidad. El saldo se calcula al instante."
        : "Bienes Inmuebles e Industria y Comercio. Sin filas, sin contraseña, sin descargar nada.";

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden bg-hero-mesh text-white"
    >
      <div
        data-hero-orb
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-24 size-[28rem] rounded-full bg-[color:var(--gold-500)]/15 blur-[100px]"
      />
      <div
        data-hero-orb-2
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 size-80 rounded-full bg-[color:var(--brand-300)]/30 blur-[80px]"
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in srgb, var(--gold-300) 60%, transparent), transparent)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pt-14 pb-32 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16 md:px-8 md:pt-20 md:pb-36">
        <div className="space-y-7 md:space-y-9">
          {amnistiaActiva && (
            <div
              data-hero-chip
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold-300)]/35 bg-[color:var(--gold-500)]/12 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--gold-300)] backdrop-blur"
            >
              <Sparkles className="size-3.5" />
              Amnistía vigente
              <span className="text-white/55">·</span>
              <span className="normal-case tracking-normal text-white/80">
                aplica automáticamente
              </span>
            </div>
          )}
          <div className="space-y-5">
            <p
              data-hero-eyebrow
              className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-white/60 md:text-xs"
            >
              <span className="h-px w-8 bg-[color:var(--gold-300)]/60" aria-hidden />
              Portal oficial · Tegucigalpa M.D.C.
            </p>
            <h1 className="font-display text-[2.5rem] leading-[0.98] tracking-[-0.025em] text-white md:text-[3.5rem] lg:text-[4rem]">
              <span data-hero-title-line className="block font-light text-white/85">
                {titulo.lead}
              </span>
              <span
                data-hero-title-line
                className="block italic text-white"
                style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 144" }}
              >
                {titulo.emphasis}
              </span>
              <span
                data-hero-title-line
                className="block font-light text-white/85"
              >
                {titulo.tail}
              </span>
            </h1>
            <p
              data-hero-sub
              className="max-w-xl text-pretty text-sm leading-relaxed text-white/75 md:text-base"
            >
              {sub}
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/75">
            <li data-hero-chip className="inline-flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-[color:var(--gold-300)]" />
              Datos protegidos
            </li>
            <li data-hero-chip className="inline-flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-[color:var(--gold-300)]" />
              PDF oficial con QR
            </li>
            <li data-hero-chip className="inline-flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-[color:var(--gold-300)]" />
              Sin registro
            </li>
          </ul>
        </div>

        <aside
          data-hero-chip
          className="hidden md:block"
          aria-hidden
        >
          <div className="flex flex-col items-end gap-4 text-right">
            <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/45">
              Servicio
            </span>
            <span className="font-display text-7xl font-light leading-none text-white/10">
              01
            </span>
            <div className="h-px w-16 bg-white/20" />
            <span className="max-w-[14rem] text-xs leading-relaxed text-white/55">
              Consulta de estados de cuenta para Bienes Inmuebles e ICS.
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
