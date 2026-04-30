import { z } from "zod";

const claveCatastralRegex = /^[0-9]{2}-[0-9]{4}-[0-9]{3}(-[0-9]{3})?$/;
// DNI (persona natural) = 13 dígitos. RTN (persona jurídica/natural fiscal)
// = 13 o 14 dígitos. La BD AMDC almacena ambos en TXT_IDENTIFICACION sin
// distinguir formato, así que aceptamos cualquiera de los dos.
const dniRtnRegex = /^[0-9]{13,14}$/;
const icsRegex = /^[0-9A-Za-z-]+$/;

function optionalPattern(pattern: RegExp, message: string, maxLen = 32) {
  return z
    .string()
    .trim()
    .max(maxLen, "Demasiados caracteres")
    .refine((v) => v === "" || pattern.test(v), { message });
}

export const consultaECSchema = z
  .object({
    claveCatastral: optionalPattern(
      claveCatastralRegex,
      "Formato esperado: NN-NNNN-NNN (ej. 13-0739-007)",
      20,
    ),
    dni: optionalPattern(
      dniRtnRegex,
      "DNI o RTN debe tener 13 o 14 dígitos numéricos",
      14,
    ),
  })
  .refine((d) => !!(d.claveCatastral || d.dni), {
    message: "Ingresa la clave catastral, DNI o RTN",
    path: ["claveCatastral"],
  });

export type ConsultaECInput = z.infer<typeof consultaECSchema>;

export const consultaICSSchema = z
  .object({
    ics: optionalPattern(
      icsRegex,
      "Solo se permiten números, letras y guiones",
      20,
    ),
    dni: optionalPattern(
      dniRtnRegex,
      "DNI o RTN debe tener 13 o 14 dígitos numéricos",
      14,
    ),
  })
  .refine((d) => !!(d.ics || d.dni), {
    message: "Ingresa el código ICS, DNI o RTN",
    path: ["ics"],
  });

export type ConsultaICSInput = z.infer<typeof consultaICSSchema>;

/**
 * Schema para /api/consulta (search) — SIN token Turnstile.
 * El search está protegido por OriginGuard + BotBlockerGuard + rate-limit
 * en el backend; no requiere captcha para evitar UX de doble desafío.
 */
export const consultaProxyPayloadSchema = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("ec"),
    claveCatastral: z.string().optional(),
    dni: z.string().optional(),
  }),
  z.object({
    tipo: z.literal("ics"),
    ics: z.string().optional(),
    dni: z.string().optional(),
  }),
]);

export type ConsultaProxyPayload = z.infer<typeof consultaProxyPayloadSchema>;

/**
 * Schema para /api/pdf — CON token Turnstile (operación costosa).
 */
export const pdfProxyPayloadSchema = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("ec"),
    token: z.string().min(1),
    claveCatastral: z.string().optional(),
    dni: z.string().optional(),
  }),
  z.object({
    tipo: z.literal("ics"),
    token: z.string().min(1),
    ics: z.string().optional(),
    dni: z.string().optional(),
  }),
]);

export type PdfProxyPayload = z.infer<typeof pdfProxyPayloadSchema>;
