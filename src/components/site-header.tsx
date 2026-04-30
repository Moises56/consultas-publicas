import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-md"
          aria-label="Ir al inicio"
        >
          <Image
            src="/escudo-amdc.png"
            alt="Escudo de la Alcaldía Municipal del Distrito Central"
            width={40}
            height={40}
            priority
            className="h-10 w-auto"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Alcaldía Municipal del Distrito Central
            </span>
            <span className="text-sm font-semibold text-foreground">
              Estados de Cuenta · Consultas en línea
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Inicio
          </Link>
          <Link
            href="/consulta"
            className="rounded-md bg-[color:var(--brand-500)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--brand-700)]"
          >
            Consultar ahora
          </Link>
        </nav>
      </div>
    </header>
  );
}
