"use client";

import {
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  MapPin,
  Sparkles,
  Tag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/animated-counter";
import { MoraTable } from "@/components/mora-table";
import type {
  PublicEstadoCuenta,
  PublicEstadoCuentaEC,
  PublicEstadoCuentaICS,
  PublicPropiedad,
  PublicEmpresaICS,
} from "@/lib/types";
import { formatLempirasShort } from "@/lib/format";

interface ResultadoDetalleProps {
  resultado: PublicEstadoCuenta;
}

export function ResultadoDetalle({ resultado }: ResultadoDetalleProps) {
  if (resultado.tipo === "ec") {
    return <ResultadoEC data={resultado.data} />;
  }
  return <ResultadoICS data={resultado.data} />;
}

function ResultadoHeaderInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/60 p-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-[color:var(--brand-50)] text-[color:var(--brand-700)]">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground break-all">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function AmnistiaBanner({
  amnistia,
  fecha,
  descripcion,
}: {
  amnistia: boolean;
  fecha?: string | null;
  descripcion?: string;
}) {
  if (!amnistia) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[color:var(--gold-500)]/40 bg-[color:var(--gold-500)]/10 p-4 text-sm">
      <Sparkles className="mt-0.5 size-5 shrink-0 text-[color:var(--gold-700)]" />
      <div className="space-y-1">
        <p className="font-semibold text-[color:var(--gold-700)]">
          Amnistía aplicada
        </p>
        <p className="text-foreground/85">
          {descripcion ??
            "Tu estado de cuenta refleja los beneficios de la amnistía vigente."}
        </p>
        {fecha && (
          <p className="text-xs text-muted-foreground">
            Amnistía vigente hasta: <strong>{fecha}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

function TotalAPagarCard({
  totalGeneral,
  descuento,
  totalAPagar,
  fechaConsulta,
}: {
  totalGeneral: number;
  descuento: number;
  totalAPagar: number;
  fechaConsulta?: string;
}) {
  const tieneDescuento = descuento > 0;
  return (
    <Card className="overflow-hidden border-none bg-amdc-gradient text-white shadow-md">
      <CardContent className="space-y-5 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
              Total a pagar
            </p>
            <AnimatedCounter
              value={totalAPagar}
              className="mt-1 block text-4xl font-bold tracking-tight md:text-5xl"
              prefix="L "
              ariaLabel={`Total a pagar L ${formatLempirasShort(totalAPagar)}`}
            />
          </div>
          {fechaConsulta && (
            <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur">
              Consultado el {fechaConsulta}
            </div>
          )}
        </div>

        <div className="grid gap-3 text-sm md:grid-cols-2">
          <div className="rounded-lg bg-white/10 p-3 backdrop-blur">
            <p className="text-[11px] uppercase tracking-wider text-white/70">
              Total general
            </p>
            <p className="mt-1 text-lg font-semibold">
              L {formatLempirasShort(totalGeneral)}
            </p>
          </div>
          <div
            className={
              tieneDescuento
                ? "rounded-lg bg-[color:var(--gold-500)]/25 p-3 ring-1 ring-[color:var(--gold-300)]/40 backdrop-blur"
                : "rounded-lg bg-white/10 p-3 backdrop-blur"
            }
          >
            <p className="text-[11px] uppercase tracking-wider text-white/70">
              Descuento pronto pago
            </p>
            <p
              className={
                tieneDescuento
                  ? "mt-1 inline-flex items-center gap-1.5 text-lg font-semibold text-[color:var(--gold-300)]"
                  : "mt-1 text-lg font-semibold text-white/70"
              }
            >
              {tieneDescuento ? (
                <>
                  <CheckCircle2 className="size-4" />
                  −L {formatLempirasShort(descuento)}
                </>
              ) : (
                "No aplica"
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResultadoEC({ data }: { data: PublicEstadoCuentaEC }) {
  const propiedades: PublicPropiedad[] | undefined = data.propiedades;
  const isMulti = !!(propiedades && propiedades.length > 0);

  return (
    <div className="space-y-6">
      <Card className="border-border/70">
        <CardContent className="space-y-5 p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--brand-500)]">
                Estado de Cuenta · Bienes Inmuebles
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {isMulti
                  ? `${propiedades!.length} propiedades encontradas`
                  : "Detalle de tu propiedad"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Información oficial AMDC. Los datos personales del propietario
                no se muestran en este portal por privacidad.
              </p>
            </div>
          </div>

          {!isMulti && (
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultadoHeaderInfo
                icon={<Tag className="size-4" />}
                label="Clave catastral"
                value={data.claveCatastral}
              />
              <ResultadoHeaderInfo
                icon={<MapPin className="size-4" />}
                label="Colonia"
                value={data.nombreColonia ?? data.colonia}
              />
            </div>
          )}

          <AmnistiaBanner
            amnistia={!!data.amnistiaAplicada}
            fecha={data.fechaFinAmnistia ?? undefined}
            descripcion={data.amnistiaDescripcion}
          />
        </CardContent>
      </Card>

      <TotalAPagarCard
        totalGeneral={data.totalGeneralNumerico}
        descuento={data.descuentoProntoPagoNumerico}
        totalAPagar={data.totalAPagarNumerico}
        fechaConsulta={data.fecha}
      />

      {isMulti ? (
        <div className="space-y-5">
          {propiedades!.map((p, idx) => (
            <PropiedadBlock key={`${p.claveCatastral}-${idx}`} propiedad={p} />
          ))}
        </div>
      ) : (
        <Card className="border-border/70">
          <CardContent className="space-y-4 p-5 md:p-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-[color:var(--brand-500)]" />
              <h3 className="text-base font-semibold text-foreground">
                Detalle por año
              </h3>
            </div>
            <MoraTable
              rows={data.detallesMora ?? []}
              variant="ec"
              total={data.totalGeneralNumerico}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PropiedadBlock({ propiedad }: { propiedad: PublicPropiedad }) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-4 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-50)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--brand-700)]">
              <Building2 className="size-3.5" />
              Propiedad
            </p>
            <h3 className="text-lg font-semibold text-foreground break-all">
              {propiedad.claveCatastral}
            </h3>
            <p className="text-sm text-muted-foreground">
              {propiedad.nombreColonia ?? propiedad.colonia}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Total propiedad
            </p>
            <p className="text-xl font-bold text-[color:var(--brand-700)]">
              L {formatLempirasShort(propiedad.totalPropiedadNumerico)}
            </p>
          </div>
        </div>
        <MoraTable
          rows={propiedad.detallesMora}
          variant="ec"
          total={propiedad.totalPropiedadNumerico}
        />
      </CardContent>
    </Card>
  );
}

function ResultadoICS({ data }: { data: PublicEstadoCuentaICS }) {
  const empresas: PublicEmpresaICS[] | undefined = data.empresas;
  const isMulti = !!(empresas && empresas.length > 0);

  return (
    <div className="space-y-6">
      <Card className="border-border/70">
        <CardContent className="space-y-5 p-6 md:p-7">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--brand-500)]">
              Estado de Cuenta · Industria y Comercio
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {isMulti
                ? `${empresas!.length} empresas encontradas`
                : "Detalle de tu negocio"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Información oficial AMDC. Los datos del propietario no se muestran
              en este portal por privacidad.
            </p>
          </div>

          {!isMulti && (
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultadoHeaderInfo
                icon={<FileText className="size-4" />}
                label="Código ICS"
                value={data.numeroEmpresa}
              />
              <ResultadoHeaderInfo
                icon={<CalendarDays className="size-4" />}
                label="Mes / período"
                value={data.mes}
              />
            </div>
          )}

          <AmnistiaBanner
            amnistia={!!data.amnistiaAplicada}
            fecha={data.fechaFinAmnistia ?? undefined}
            descripcion={data.amnistiaDescripcion}
          />
        </CardContent>
      </Card>

      <TotalAPagarCard
        totalGeneral={data.totalGeneralNumerico}
        descuento={data.descuentoProntoPagoNumerico}
        totalAPagar={data.totalAPagarNumerico}
        fechaConsulta={data.fecha}
      />

      {isMulti ? (
        <div className="space-y-5">
          {empresas!.map((e, idx) => (
            <EmpresaBlock key={`${e.numeroEmpresa}-${idx}`} empresa={e} />
          ))}
        </div>
      ) : (
        <Card className="border-border/70">
          <CardContent className="space-y-4 p-5 md:p-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-[color:var(--brand-500)]" />
              <h3 className="text-base font-semibold text-foreground">
                Detalle por año
              </h3>
            </div>
            <MoraTable
              rows={data.detallesMora ?? []}
              variant="ics"
              total={data.totalGeneralNumerico}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EmpresaBlock({ empresa }: { empresa: PublicEmpresaICS }) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-4 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-50)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--brand-700)]">
              <FileText className="size-3.5" />
              Empresa
            </p>
            <h3 className="text-lg font-semibold text-foreground break-all">
              {empresa.numeroEmpresa}
            </h3>
            <p className="text-sm text-muted-foreground">{empresa.mes}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Total empresa
            </p>
            <p className="text-xl font-bold text-[color:var(--brand-700)]">
              L {formatLempirasShort(empresa.totalPropiedadNumerico)}
            </p>
          </div>
        </div>
        <MoraTable
          rows={empresa.detallesMora}
          variant="ics"
          total={empresa.totalPropiedadNumerico}
        />
      </CardContent>
    </Card>
  );
}
