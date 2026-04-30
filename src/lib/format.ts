const lempiras = new Intl.NumberFormat("es-HN", {
  style: "currency",
  currency: "HNL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const lempirasNoCurrency = new Intl.NumberFormat("es-HN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatLempiras(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number(value) : (value ?? 0);
  if (!Number.isFinite(n)) return "L 0.00";
  return lempiras.format(n).replace("HNL", "L").replace(/ /g, " ");
}

export function formatLempirasShort(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number(value) : (value ?? 0);
  if (!Number.isFinite(n)) return "0.00";
  return lempirasNoCurrency.format(n);
}
