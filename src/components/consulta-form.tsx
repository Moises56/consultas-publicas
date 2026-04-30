"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  FileText,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/turnstile-widget";
import {
  consultaECSchema,
  consultaICSSchema,
  type ConsultaECInput,
  type ConsultaICSInput,
} from "@/lib/schemas";
import { consultarEstadoCuenta } from "@/lib/api-client";
import { saveResultado, type StoredQuery } from "@/lib/resultado-storage";
import { cn } from "@/lib/utils";

type Tipo = "ec" | "ics";

interface ConsultaFormProps {
  defaultTipo?: Tipo;
}

export function ConsultaForm({ defaultTipo = "ec" }: ConsultaFormProps) {
  const router = useRouter();
  const [tipo, setTipo] = useState<Tipo>(defaultTipo);
  const [token, setToken] = useState<string | null>(null);
  const [submitting, startTransition] = useTransition();
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const lastQueryRef = useRef<StoredQuery | null>(null);

  const ecForm = useForm<ConsultaECInput>({
    resolver: zodResolver(consultaECSchema),
    defaultValues: { claveCatastral: "", dni: "" },
    mode: "onSubmit",
  });

  const icsForm = useForm<ConsultaICSInput>({
    resolver: zodResolver(consultaICSSchema),
    defaultValues: { ics: "", dni: "" },
    mode: "onSubmit",
  });

  function handleResult(
    response: Awaited<ReturnType<typeof consultarEstadoCuenta>>,
  ) {
    if (!response.ok) {
      const messages: Record<string, string> = {
        captcha_invalid:
          "No pudimos validar que eres una persona. Recarga la página e intenta de nuevo.",
        rate_limit:
          "Has hecho muchas consultas en poco tiempo. Espera unos minutos e intenta nuevamente.",
        not_found:
          "No encontramos un estado de cuenta con esos datos. Verifica e intenta de nuevo.",
        validation:
          "Revisa los campos. Asegúrate de ingresar la clave o identidad correctamente.",
        server_error:
          "Tuvimos un problema al consultar. Intenta nuevamente en unos minutos.",
        network: "No pudimos conectar con el servicio. Revisa tu conexión.",
      };
      toast.error(messages[response.code] ?? response.message);
      turnstileRef.current?.reset();
      setToken(null);
      return;
    }

    if (lastQueryRef.current) {
      saveResultado({
        query: lastQueryRef.current,
        result: response.data,
      });
    }

    toast.success("Estado de cuenta encontrado.");
    router.push("/resultado");
  }

  function ensureToken() {
    if (!token) {
      toast.error(
        "Estamos validando que eres una persona. Espera un momento e intenta de nuevo.",
      );
      turnstileRef.current?.execute();
      return false;
    }
    return true;
  }

  const onSubmitEC = ecForm.handleSubmit((values) => {
    if (!ensureToken()) return;
    const query: StoredQuery = {
      tipo: "ec",
      claveCatastral: values.claveCatastral || undefined,
      dni: values.dni || undefined,
    };
    lastQueryRef.current = query;
    startTransition(async () => {
      const response = await consultarEstadoCuenta({
        tipo: "ec",
        token: token!,
        claveCatastral: query.claveCatastral,
        dni: query.dni,
      });
      handleResult(response);
    });
  });

  const onSubmitICS = icsForm.handleSubmit((values) => {
    if (!ensureToken()) return;
    const query: StoredQuery = {
      tipo: "ics",
      ics: values.ics || undefined,
      dni: values.dni || undefined,
    };
    lastQueryRef.current = query;
    startTransition(async () => {
      const response = await consultarEstadoCuenta({
        tipo: "ics",
        token: token!,
        ics: query.ics,
        dni: query.dni,
      });
      handleResult(response);
    });
  });

  const ecFieldError =
    ecForm.formState.errors.claveCatastral?.message ??
    ecForm.formState.errors.dni?.message;
  const icsFieldError =
    icsForm.formState.errors.ics?.message ??
    icsForm.formState.errors.dni?.message;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white ring-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[color:var(--brand-700)] via-[color:var(--brand-500)] to-[color:var(--gold-500)]"
      />

      <header className="space-y-5 px-6 pt-10 pb-7 md:px-12 md:pt-12 md:pb-8">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-px w-10 bg-[color:var(--brand-500)]/40"
          />
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[color:var(--brand-500)]">
            Tipo de consulta
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-3xl leading-[1.05] tracking-[-0.02em] text-ink md:text-[2.25rem]">
            ¿Qué deseas consultar hoy?
          </h2>
          <p className="max-w-prose text-sm leading-relaxed text-ink-soft md:text-[15px]">
            Elige el servicio y proporciona uno de los identificadores. Tu
            estado de cuenta se mostrará en pantalla con la opción de descargar
            el PDF oficial.
          </p>
        </div>
      </header>

      <div className="px-6 md:px-12">
        <div
          aria-hidden
          className="h-px bg-gradient-to-r from-transparent via-[color:var(--paper-deep)] to-transparent"
        />
      </div>

      <div className="px-6 pt-8 pb-10 md:px-12 md:pt-10 md:pb-12">
        <Tabs
          value={tipo}
          onValueChange={(v) => setTipo(v as Tipo)}
          className="gap-9 md:gap-10"
        >
          <TabsList className="grid h-auto w-full grid-cols-2 gap-3 bg-transparent p-0">
            <TabsTrigger
              value="ec"
              className="group/seg relative flex h-[68px] cursor-pointer items-center gap-3.5 overflow-hidden rounded-2xl border border-[color:var(--paper-deep)] bg-white px-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--brand-500)]/40 hover:shadow-md data-active:border-[color:var(--brand-500)] data-active:bg-white data-active:shadow-[0_12px_32px_-14px_rgba(0,64,185,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-500)]/40 md:h-[76px] md:px-5"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[color:var(--brand-500)] to-[color:var(--brand-700)] transition-transform duration-500 group-data-[state=active]/seg:scale-x-100"
              />
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--brand-50)] text-[color:var(--brand-700)] transition-all duration-300 group-hover/seg:scale-105 group-data-[state=active]/seg:bg-[color:var(--brand-700)] group-data-[state=active]/seg:text-white md:size-11">
                <Building2 className="size-4.5 md:size-5" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[14px] font-semibold tracking-tight text-ink transition-colors duration-300 group-data-[state=active]/seg:text-[color:var(--brand-700)] md:text-[15px]">
                  Bienes Inmuebles
                </span>
                <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-ink-soft/70">
                  Catastro · EC
                </span>
              </span>
              <span
                aria-hidden
                className="ml-auto flex size-2 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-500)] opacity-0 transition-all duration-300 group-data-[state=active]/seg:opacity-100"
              />
            </TabsTrigger>

            <TabsTrigger
              value="ics"
              className="group/seg relative flex h-[68px] cursor-pointer items-center gap-3.5 overflow-hidden rounded-2xl border border-[color:var(--paper-deep)] bg-white px-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--gold-500)]/50 hover:shadow-md data-active:border-[color:var(--gold-500)] data-active:bg-white data-active:shadow-[0_12px_32px_-14px_rgba(253,191,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold-500)]/40 md:h-[76px] md:px-5"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[color:var(--gold-500)] to-[color:var(--gold-700)] transition-transform duration-500 group-data-[state=active]/seg:scale-x-100"
              />
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--gold-500)]/15 text-[color:var(--gold-700)] transition-all duration-300 group-hover/seg:scale-105 group-data-[state=active]/seg:bg-[color:var(--gold-500)] group-data-[state=active]/seg:text-[color:var(--brand-900)] md:size-11">
                <FileText className="size-4.5 md:size-5" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[14px] font-semibold tracking-tight text-ink transition-colors duration-300 group-data-[state=active]/seg:text-[color:var(--brand-700)] md:text-[15px]">
                  Industria y Comercio
                </span>
                <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-ink-soft/70">
                  Negocios · ICS
                </span>
              </span>
              <span
                aria-hidden
                className="ml-auto flex size-2 shrink-0 items-center justify-center rounded-full bg-[color:var(--gold-500)] opacity-0 transition-all duration-300 group-data-[state=active]/seg:opacity-100"
              />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ec" className="space-y-7">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ingresa <strong>uno de los dos campos</strong>: la clave catastral
              de tu inmueble o tu número de identidad.
            </p>
            <form onSubmit={onSubmitEC} noValidate className="space-y-6">
              <FieldRow
                id="ec-clave"
                label="Clave catastral"
                hint="Formato: dos dígitos, guión, cuatro dígitos, guión, tres dígitos."
                error={ecForm.formState.errors.claveCatastral?.message}
              >
                <Input
                  id="ec-clave"
                  inputMode="text"
                  autoComplete="off"
                  placeholder="00-0000-000"
                  className="h-12 rounded-lg border-[color:var(--paper-deep)] bg-white text-[15px] font-medium tracking-tight shadow-sm focus-visible:border-[color:var(--brand-500)] focus-visible:ring-[color:var(--brand-500)]/15"
                  aria-invalid={!!ecForm.formState.errors.claveCatastral}
                  {...ecForm.register("claveCatastral")}
                />
              </FieldRow>

              <Divider />

              <FieldRow
                id="ec-dni"
                label="Número de identidad (DNI)"
                hint="13 dígitos numéricos, sin guiones"
                error={ecForm.formState.errors.dni?.message}
              >
                <Input
                  id="ec-dni"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  placeholder="0000000000000"
                  className="h-12 rounded-lg border-[color:var(--paper-deep)] bg-white text-[15px] font-medium tracking-tight shadow-sm focus-visible:border-[color:var(--brand-500)] focus-visible:ring-[color:var(--brand-500)]/15"
                  aria-invalid={!!ecForm.formState.errors.dni}
                  {...ecForm.register("dni")}
                />
              </FieldRow>

              {ecFieldError && (
                <Alert variant="destructive">
                  <AlertTitle>Revisa los datos</AlertTitle>
                  <AlertDescription>{ecFieldError}</AlertDescription>
                </Alert>
              )}

              <SubmitArea submitting={submitting} />
            </form>
          </TabsContent>

          <TabsContent value="ics" className="space-y-7">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ingresa <strong>uno de los dos campos</strong>: el código ICS de
              tu negocio o tu número de identidad / RTN.
            </p>
            <form onSubmit={onSubmitICS} noValidate className="space-y-6">
              <FieldRow
                id="ics-codigo"
                label="Código ICS"
                hint="Número de identificación de la empresa"
                error={icsForm.formState.errors.ics?.message}
              >
                <Input
                  id="ics-codigo"
                  inputMode="text"
                  autoComplete="off"
                  placeholder="00000"
                  className="h-12 rounded-lg border-[color:var(--paper-deep)] bg-white text-[15px] font-medium tracking-tight shadow-sm focus-visible:border-[color:var(--brand-500)] focus-visible:ring-[color:var(--brand-500)]/15"
                  aria-invalid={!!icsForm.formState.errors.ics}
                  {...icsForm.register("ics")}
                />
              </FieldRow>

              <Divider />

              <FieldRow
                id="ics-dni"
                label="DNI o RTN"
                hint="13 dígitos para DNI · 14 dígitos para RTN"
                error={icsForm.formState.errors.dni?.message}
              >
                <Input
                  id="ics-dni"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  placeholder="00000000000000"
                  className="h-12 rounded-lg border-[color:var(--paper-deep)] bg-white text-[15px] font-medium tracking-tight shadow-sm focus-visible:border-[color:var(--brand-500)] focus-visible:ring-[color:var(--brand-500)]/15"
                  aria-invalid={!!icsForm.formState.errors.dni}
                  {...icsForm.register("dni")}
                />
              </FieldRow>

              {icsFieldError && (
                <Alert variant="destructive">
                  <AlertTitle>Revisa los datos</AlertTitle>
                  <AlertDescription>{icsFieldError}</AlertDescription>
                </Alert>
              )}

              <SubmitArea submitting={submitting} />
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-10 flex flex-col gap-4 border-t border-[color:var(--paper-deep)] pt-7 md:mt-12 md:pt-8">
          <div className="flex items-start gap-3 text-xs leading-relaxed text-ink-soft md:text-[13px]">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[color:var(--brand-500)]" />
            <p>
              Esta consulta está protegida por Cloudflare Turnstile. No se
              almacenan datos personales identificables — la respuesta se
              sanitiza antes de enviarse al portal.
            </p>
          </div>
          <div className="flex justify-start">
            <TurnstileWidget
              ref={turnstileRef}
              onToken={(t) => setToken(t)}
              onError={() => {
                setToken(null);
                toast.error(
                  "No pudimos verificar que eres una persona. Recarga la página.",
                );
              }}
              onExpire={() => setToken(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-5 py-2" aria-hidden>
      <span className="h-px flex-1 bg-[color:var(--paper-deep)]" />
      <span className="font-display text-base italic leading-none text-ink-soft/55">
        o bien
      </span>
      <span className="h-px flex-1 bg-[color:var(--paper-deep)]" />
    </div>
  );
}

function FieldRow({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-[13px] font-semibold tracking-tight text-ink"
      >
        {label}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs leading-relaxed text-ink-soft/80">{hint}</p>
      )}
      {error && (
        <p className={cn("text-xs font-medium text-destructive")}>{error}</p>
      )}
    </div>
  );
}

function SubmitArea({ submitting }: { submitting: boolean }) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={submitting}
      className="group/btn mt-3 h-12 w-full gap-2 rounded-full bg-[color:var(--brand-700)] text-[15px] font-semibold tracking-tight text-white shadow-sm transition-all hover:bg-[color:var(--brand-900)] hover:shadow-md sm:w-auto sm:px-10"
    >
      {submitting ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Consultando…
        </>
      ) : (
        <>
          Consultar estado de cuenta
          <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
        </>
      )}
    </Button>
  );
}
