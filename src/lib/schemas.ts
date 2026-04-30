import { z } from "zod";

const claveCatastralRegex = /^[0-9]{2}-[0-9]{4}-[0-9]{3}(-[0-9]{3})?$/;
const dniRegex = /^[0-9]{13}$/;
const rtnRegex = /^[0-9]{13,14}$/;
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
    dni: optionalPattern(dniRegex, "El DNI debe tener 13 dígitos numéricos", 14),
  })
  .refine((d) => !!(d.claveCatastral || d.dni), {
    message: "Ingresa la clave catastral o el DNI",
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
      rtnRegex,
      "DNI o RTN debe tener 13 o 14 dígitos numéricos",
      14,
    ),
  })
  .refine((d) => !!(d.ics || d.dni), {
    message: "Ingresa el código ICS, DNI o RTN",
    path: ["ics"],
  });

export type ConsultaICSInput = z.infer<typeof consultaICSSchema>;

export const proxyPayloadSchema = z.discriminatedUnion("tipo", [
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

export type ProxyPayload = z.infer<typeof proxyPayloadSchema>;
