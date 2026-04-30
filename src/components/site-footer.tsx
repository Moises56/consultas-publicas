import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border/60 bg-[color:var(--brand-900)] text-white/85">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
            Administración Estratégica de Recursos
          </p>
          <p className="text-base font-semibold leading-tight">
            Alcaldía Municipal del<br />Distrito Central
          </p>
          <p className="text-sm text-white/70">
            Edificio Ejecutivo AMDC, Avenida Cristóbal Colón, contiguo a
            Hospital Viera. Tegucigalpa, Francisco Morazán.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
            Contacto AER
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="text-white/60">Atención al ciudadano:</span>{" "}
              <a
                href="tel:+50422377989"
                className="font-medium hover:underline"
              >
                +504 2237-7989
              </a>
            </li>
            <li>
              <span className="text-white/60">Correo:</span>{" "}
              <a
                href="mailto:gac@amdc.hn"
                className="font-medium hover:underline"
              >
                gac@amdc.hn
              </a>
            </li>
            <li>
              <span className="text-white/60">Horario:</span>{" "}
              <span className="font-medium">Lun–Vie 8:00 a.m. – 4:00 p.m.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
            Enlaces
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/consulta" className="hover:underline">
                Consultar estado de cuenta
              </Link>
            </li>
            <li>
              <a
                href="https://amdc.hn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Sitio institucional AMDC
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-4 text-xs text-white/60 md:flex-row md:items-center md:px-6">
          <p>© {year} Alcaldía Municipal del Distrito Central. Todos los derechos reservados.</p>
          <p>
            Portal oficial de consultas públicas. El saldo es válido por el día solicitado.
          </p>
        </div>
      </div>
    </footer>
  );
}
