import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmnistiaAlert } from "@/components/amnistia-alert";

const amnistiaActiva = process.env.NEXT_PUBLIC_AMNISTIA_ACTIVA === "true";

export default function Home() {
  return (
    <>
      <AmnistiaAlert />
      <Hero />
      <Servicios />
      <ComoFunciona />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-hero-mesh text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-24 size-[28rem] rounded-full bg-[color:var(--gold-500)]/15 blur-[100px]"
      />
      <div
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

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pt-14 pb-28 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-14 md:px-8 md:pt-20 md:pb-32">
        <div className="space-y-9">
          {amnistiaActiva && (
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold-300)]/35 bg-[color:var(--gold-500)]/12 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--gold-300)] backdrop-blur">
              <Sparkles className="size-3.5" />
              Amnistía vigente
              <span className="text-white/55">·</span>
              <span className="normal-case tracking-normal text-white/85">
                aplica automáticamente
              </span>
            </div>
          )}

          <div className="space-y-6">
            <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-white/60 md:text-xs">
              <span
                aria-hidden
                className="h-px w-8 bg-[color:var(--gold-300)]/60"
              />
              Portal oficial · Tegucigalpa M.D.C.
            </p>
            <h1 className="font-display text-[2.6rem] leading-[0.98] tracking-[-0.025em] text-white md:text-[3.5rem] lg:text-[4.25rem]">
              <span className="block font-light text-white/85">Tu estado</span>
              <span
                className="block italic text-white"
                style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 144" }}
              >
                de cuenta
              </span>
              <span className="block font-light text-white/85">
                en menos de un minuto.
              </span>
            </h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-white/75 md:text-lg">
              Bienes Inmuebles e Industria y Comercio — sin filas, sin
              contraseña, sin descargar nada. Identifica tu propiedad o negocio
              y obtén el PDF oficial al instante.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="group h-12 gap-2 rounded-full bg-white px-7 text-[15px] font-semibold tracking-tight text-[color:var(--brand-700)] transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
            >
              <Link href="/consulta">
                Iniciar consulta
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <p className="text-sm text-white/60">
              Toma menos de 1 minuto · Sin registro
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/70">
            <li className="inline-flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-[color:var(--gold-300)]" />
              Datos protegidos
            </li>
            <li className="inline-flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-[color:var(--gold-300)]" />
              PDF oficial con QR
            </li>
            <li className="inline-flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-[color:var(--gold-300)]" />
              Información AMDC
            </li>
          </ul>
        </div>

        <aside className="relative mx-auto hidden w-full max-w-sm md:block">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-[2.25rem] bg-[color:var(--gold-500)]/15 blur-2xl"
          />
          <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.05] p-7 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/55">
                Documento
              </span>
              <span className="font-display text-5xl font-light leading-none text-white/15">
                EC
              </span>
            </div>
            <div className="mt-7 flex justify-center">
              <div className="rounded-2xl bg-white/95 p-4 shadow-lg ring-1 ring-white/40">
                <Image
                  src="/escudo-amdc.png"
                  alt=""
                  width={120}
                  height={120}
                  priority
                  className="h-28 w-auto"
                />
              </div>
            </div>
            <div className="mt-7 space-y-1 text-center">
              <p className="font-display text-xl leading-tight text-white">
                Estado de Cuenta
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">
                AMDC · Oficial
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] uppercase tracking-[0.18em] text-white/55">
              <span>Bienes Inmuebles</span>
              <span>·</span>
              <span>ICS</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Servicios() {
  return (
    <section id="servicios" className="relative">
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 md:px-8 md:pt-28 md:pb-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <div className="space-y-4">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--brand-500)]">
              <span
                aria-hidden
                className="h-px w-8 bg-[color:var(--brand-500)]/40"
              />
              Servicios disponibles
            </p>
            <h2 className="font-display text-[2.25rem] leading-[1.05] tracking-[-0.02em] text-ink md:text-[2.75rem]">
              Dos servicios,
              <span
                className="block italic text-[color:var(--brand-700)]"
                style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 144" }}
              >
                una sola plataforma
              </span>
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-ink-soft md:text-base">
            Selecciona el servicio que necesitas. La información proviene
            directamente de los sistemas tributarios de la AMDC y se actualiza
            en línea con cada consulta.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
          <ServicioCard
            href="/consulta?tipo=ec"
            number="01"
            tag="Inmuebles"
            icon={<Building2 className="size-5" />}
            title="Bienes Inmuebles"
            description="Consulta por clave catastral del inmueble. El detalle por año incluye impuesto, tren de aseo, bomberos y recargos."
            tone="brand"
          />
          <ServicioCard
            href="/consulta?tipo=ics"
            number="02"
            tag="Negocios"
            icon={<FileText className="size-5" />}
            title="Industria y Comercio"
            description="Consulta por código ICS de tu negocio. Visualiza el desglose y descarga el PDF oficial."
            tone="gold"
          />
        </div>
      </div>
    </section>
  );
}

interface ServicioCardProps {
  href: string;
  number: string;
  tag: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tone: "brand" | "gold";
}

function ServicioCard({
  href,
  number,
  tag,
  icon,
  title,
  description,
  tone,
}: ServicioCardProps) {
  const accent =
    tone === "brand"
      ? "bg-[color:var(--brand-500)] text-white"
      : "bg-[color:var(--gold-500)] text-[color:var(--brand-900)]";
  const numberColor =
    tone === "brand"
      ? "text-[color:var(--brand-100)]"
      : "text-[color:var(--gold-300)]";

  return (
    <Link
      href={href}
      aria-label={`Iniciar consulta de ${title}`}
      className="group/card relative isolate flex cursor-pointer flex-col gap-6 overflow-hidden rounded-[1.75rem] border border-[color:var(--paper-deep)] bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[color:var(--brand-500)]/50 hover:shadow-[0_28px_70px_-30px_rgba(0,64,185,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--paper)] active:translate-y-0 md:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[color:var(--brand-500)] to-[color:var(--gold-500)] transition-transform duration-500 group-hover/card:scale-x-100"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute right-6 top-6 font-display text-7xl font-light leading-none tracking-tighter transition-transform duration-500 group-hover/card:scale-110 md:text-8xl"
      >
        <span className={numberColor}>{number}</span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`flex size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover/card:scale-110 group-hover/card:rotate-3 ${accent}`}
        >
          {icon}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-soft/70">
          {tag}
        </span>
      </div>

      <div className="space-y-2.5">
        <h3 className="font-display text-2xl tracking-[-0.01em] text-ink transition-colors duration-300 group-hover/card:text-[color:var(--brand-700)] md:text-3xl">
          {title}
        </h3>
        <p className="max-w-md text-[14px] leading-relaxed text-ink-soft md:text-[15px]">
          {description}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-[color:var(--paper-deep)] pt-5">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-tight text-[color:var(--brand-700)]">
          Iniciar consulta
          <span className="block h-px w-0 bg-[color:var(--brand-700)] transition-all duration-300 group-hover/card:w-6" />
        </span>
        <span className="flex size-10 items-center justify-center rounded-full bg-[color:var(--paper)] text-[color:var(--brand-700)] transition-all duration-300 group-hover/card:scale-110 group-hover/card:bg-[color:var(--brand-700)] group-hover/card:text-white group-hover/card:shadow-md">
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function ComoFunciona() {
  const steps = [
    {
      step: "01",
      title: "Identifica",
      copy: "Ingresa la clave catastral del inmueble o el código ICS de tu negocio. La página valida los datos de forma segura.",
    },
    {
      step: "02",
      title: "Revisa",
      copy: "Verás el desglose por año y los totales en pantalla. Si la amnistía está vigente, se aplica automáticamente.",
    },
    {
      step: "03",
      title: "Descarga",
      copy: "Genera el PDF oficial con sello AMDC y código QR de validación. Listo para bancos, notarías y trámites.",
    },
  ];

  return (
    <section className="relative bg-[color:var(--paper-deep)]/40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--brand-500)]/20 to-transparent"
      />
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-24">
        <div className="mb-14 max-w-3xl space-y-4 md:mb-16">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--brand-500)]">
            <span
              aria-hidden
              className="h-px w-8 bg-[color:var(--brand-500)]/40"
            />
            ¿Cómo funciona?
          </p>
          <h2 className="font-display text-[2.25rem] leading-[1.05] tracking-[-0.02em] text-ink md:text-[2.75rem]">
            Tres pasos.
            <span
              className="italic text-[color:var(--brand-700)]"
              style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 144" }}
            >
              {" "}
              Sin sorpresas.
            </span>
          </h2>
        </div>

        <ol className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[color:var(--paper-deep)] bg-[color:var(--paper-deep)] md:grid-cols-3">
          {steps.map((item) => (
            <li
              key={item.step}
              className="relative bg-white p-7 transition-colors hover:bg-[color:var(--paper)] md:p-8"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-5xl font-light leading-none tracking-tight text-[color:var(--brand-100)] md:text-6xl">
                  {item.step}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--brand-500)]">
                  Paso
                </span>
              </div>
              <h3 className="mt-7 font-display text-2xl tracking-[-0.01em] text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft md:text-[15px]">
                {item.copy}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex flex-col items-center gap-5 text-center">
          <Button
            asChild
            size="lg"
            className="group h-12 gap-2 rounded-full bg-[color:var(--brand-700)] px-8 text-[15px] font-semibold tracking-tight text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[color:var(--brand-900)] hover:shadow-md"
          >
            <Link href="/consulta">
              Empezar consulta
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <p className="max-w-md text-xs text-ink-soft/70">
            La consulta es gratuita y no almacena información personal
            identificable.
          </p>
        </div>
      </div>
    </section>
  );
}
