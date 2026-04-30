import type { Metadata, Viewport } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://estadosdecuenta.amdc.hn"),
  title: {
    default: "Estados de Cuenta | AMDC",
    template: "%s | AMDC",
  },
  description:
    "Portal oficial de la Alcaldía Municipal del Distrito Central para consultar tu Estado de Cuenta de Bienes Inmuebles e Industria y Comercio.",
  applicationName: "Estados de Cuenta AMDC",
  keywords: [
    "AMDC",
    "Alcaldía Municipal del Distrito Central",
    "Tegucigalpa",
    "Estado de cuenta",
    "Bienes Inmuebles",
    "Industria y Comercio",
    "ICS",
    "Honduras",
  ],
  authors: [{ name: "Alcaldía Municipal del Distrito Central" }],
  openGraph: {
    type: "website",
    locale: "es_HN",
    url: "https://estadosdecuenta.amdc.hn",
    siteName: "Estados de Cuenta AMDC",
    title: "Estados de Cuenta | AMDC",
    description:
      "Consulta en línea tu Estado de Cuenta de Bienes Inmuebles o Industria y Comercio en Tegucigalpa M.D.C.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0040B9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es-HN"
      className={`${publicSans.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-background text-foreground flex flex-col"
        suppressHydrationWarning
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
