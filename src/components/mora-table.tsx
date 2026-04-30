"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import type {
  PublicDetalleMora,
  PublicDetalleMoraICS,
} from "@/lib/types";
import { formatLempirasShort } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MoraTableProps {
  rows: Array<PublicDetalleMora | PublicDetalleMoraICS>;
  variant: "ec" | "ics";
  total?: string | number;
}

export function MoraTable({ rows, variant, total }: MoraTableProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const targets = root.current?.querySelectorAll("[data-mora-row]");
      if (!targets || targets.length === 0) return;
      gsap.from(targets, {
        opacity: 0,
        y: 12,
        duration: 0.45,
        ease: "power2.out",
        stagger: 0.05,
      });
    },
    { scope: root, dependencies: [rows] },
  );

  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border/70 bg-muted/40 p-6 text-center text-sm text-muted-foreground">
        No hay detalle de mora para mostrar.
      </p>
    );
  }

  const totalNumber =
    typeof total === "number"
      ? total
      : typeof total === "string"
        ? Number(total)
        : rows.reduce((acc, r) => acc + (r.totalNumerico ?? 0), 0);

  return (
    <div ref={root} className="overflow-hidden rounded-xl border border-border/70">
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--brand-700)] text-white">
            <tr>
              <Th className="text-left">Año</Th>
              <Th>Impuesto</Th>
              <Th>Tren de aseo</Th>
              <Th>Bomberos</Th>
              {variant === "ics" && <Th>Otros</Th>}
              <Th>Recargo</Th>
              <Th>Total</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={`${row.year}-${idx}`}
                data-mora-row
                className={cn(
                  "border-t border-border/60",
                  idx % 2 === 0 ? "bg-background" : "bg-muted/40",
                  row.amnistiaAplicada
                    ? "ring-1 ring-inset ring-[color:var(--gold-500)]/40"
                    : null,
                )}
              >
                <Td className="text-left font-medium text-foreground">
                  {row.year}
                  {row.amnistiaAplicada && (
                    <span className="ml-2 rounded-full bg-[color:var(--gold-500)]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--gold-700)]">
                      Amnistía
                    </span>
                  )}
                </Td>
                <Td>{formatLempirasShort(row.impuestoNumerico)}</Td>
                <Td>{formatLempirasShort(row.trenDeAseoNumerico)}</Td>
                <Td>{formatLempirasShort(row.tasaBomberosNumerico)}</Td>
                {variant === "ics" && (
                  <Td>
                    {formatLempirasShort(
                      (row as PublicDetalleMoraICS).otrosNumerico,
                    )}
                  </Td>
                )}
                <Td>{formatLempirasShort(row.recargoNumerico)}</Td>
                <Td className="font-semibold text-foreground">
                  {formatLempirasShort(row.totalNumerico)}
                </Td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[color:var(--brand-50)]">
            <tr data-mora-row>
              <Td
                className="text-left font-semibold uppercase tracking-wider text-[color:var(--brand-700)]"
                colSpan={variant === "ics" ? 6 : 5}
              >
                Total general
              </Td>
              <Td className="font-bold text-[color:var(--brand-700)]">
                {formatLempirasShort(totalNumber)}
              </Td>
            </tr>
          </tfoot>
        </table>
      </div>

      <ul className="divide-y divide-border/60 md:hidden">
        {rows.map((row, idx) => (
          <li key={`${row.year}-${idx}-m`} data-mora-row className="p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-base font-semibold text-foreground">
                Año {row.year}
              </p>
              <p className="text-base font-semibold text-foreground">
                L {formatLempirasShort(row.totalNumerico)}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <dt>Impuesto</dt>
                <dd className="text-foreground">
                  {formatLempirasShort(row.impuestoNumerico)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Tren aseo</dt>
                <dd className="text-foreground">
                  {formatLempirasShort(row.trenDeAseoNumerico)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Bomberos</dt>
                <dd className="text-foreground">
                  {formatLempirasShort(row.tasaBomberosNumerico)}
                </dd>
              </div>
              {variant === "ics" && (
                <div className="flex items-center justify-between">
                  <dt>Otros</dt>
                  <dd className="text-foreground">
                    {formatLempirasShort(
                      (row as PublicDetalleMoraICS).otrosNumerico,
                    )}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt>Recargo</dt>
                <dd className="text-foreground">
                  {formatLempirasShort(row.recargoNumerico)}
                </dd>
              </div>
            </dl>
            {row.amnistiaAplicada && (
              <p className="mt-2 inline-flex items-center rounded-full bg-[color:var(--gold-500)]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--gold-700)]">
                Amnistía
              </p>
            )}
          </li>
        ))}
        <li data-mora-row className="bg-[color:var(--brand-50)] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-700)]">
              Total general
            </p>
            <p className="text-base font-bold text-[color:var(--brand-700)]">
              L {formatLempirasShort(totalNumber)}
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}

function Th({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <th
      scope="col"
      className={cn(
        "px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wider",
        className,
      )}
    >
      {children}
    </th>
  );
}

function Td({
  className,
  children,
  colSpan,
}: {
  className?: string;
  children: React.ReactNode;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn("px-3 py-2 text-right text-foreground/85", className)}
    >
      {children}
    </td>
  );
}
