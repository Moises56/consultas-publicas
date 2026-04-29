# AMDC — Consultas Públicas

Portal público para consultar Estados de Cuenta de Bienes Inmuebles (EC) y Industria/Comercio (ICS) de la Alcaldía Municipal del Distrito Central, sin requerir registro.

> **Plan maestro**: ver `../planpublic.md` en el monorepo. Toda decisión, contrato de API, schema de BD y fases de implementación viven ahí.

## Stack

- Next.js 15 (App Router)
- shadcn/ui (Radix base) + Tailwind CSS 4
- GSAP + @gsap/react para animaciones
- React Hook Form + Zod
- Cloudflare Turnstile (`@marsidev/react-turnstile`)
- Backend: NestJS en `mer-fact-back` (endpoints `/api/public/*`)

## Setup local

```bash
cp .env.local.example .env.local
# rellenar NEXT_PUBLIC_TURNSTILE_SITE_KEY desde Cloudflare dashboard
npm run dev
```

App en `http://localhost:3000`. Backend tiene que estar corriendo en `http://localhost:3009`.

## Producción

Deploy en Vercel apuntando `estadosdecuenta.amdc.hn`. Variables de entorno se configuran en el dashboard.

## Privacidad

Las respuestas y PDFs **NO** incluyen nombres, apellidos, DNI/RTN ni número de cuenta del contribuyente. Solo se exponen: clave catastral / código ICS, colonia, uso, avalúo, tabla por años, totales.
