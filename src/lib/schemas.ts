import { z } from "zod";

const claveCatastralRegex = /^[0-9]{2}-[0-9]{4}-[0-9]{3}(-[0-9]{3})?$/;
const icsRegex = /^[0-9A-Za-z-]+$/;

export const consultaECSchema = z.object({
  claveCatastral: z
    .string()
    .trim()
    .min(1, "Ingresa la clave catastral del inmueble")
    .max(20, "Demasiados caracteres")
    .regex(
      claveCatastralRegex,
      "Formato esperado: NN-NNNN-NNN (ej. 13-0739-007)",
    ),
});

export type ConsultaECInput = z.infer<typeof consultaECSchema>;

export const consultaICSSchema = z.object({
  ics: z
    .string()
    .trim()
    .min(1, "Ingresa el código ICS del negocio")
    .max(20, "Demasiados caracteres")
    .regex(icsRegex, "Solo se permiten números, letras y guiones"),
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
    claveCatastral: z.string().min(1),
  }),
  z.object({
    tipo: z.literal("ics"),
    ics: z.string().min(1),
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
    claveCatastral: z.string().min(1),
  }),
  z.object({
    tipo: z.literal("ics"),
    token: z.string().min(1),
    ics: z.string().min(1),
  }),
]);

export type PdfProxyPayload = z.infer<typeof pdfProxyPayloadSchema>;
