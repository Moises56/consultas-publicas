"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface TurnstileWidgetHandle {
  reset: () => void;
  getResponse: () => string | undefined;
  execute: () => void;
}

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
}

export const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(
  function TurnstileWidget({ onToken, onError, onExpire, className }, ref) {
    const innerRef = useRef<TurnstileInstance>(null);
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

    useImperativeHandle(
      ref,
      () => ({
        reset: () => innerRef.current?.reset(),
        getResponse: () => innerRef.current?.getResponse(),
        execute: () => innerRef.current?.execute(),
      }),
      [],
    );

    if (!siteKey) {
      return (
        <p className={className} role="status" aria-live="polite">
          <span className="text-xs text-muted-foreground">
            Turnstile no configurado. Define{" "}
            <code className="rounded bg-muted px-1 py-0.5">
              NEXT_PUBLIC_TURNSTILE_SITE_KEY
            </code>
            .
          </span>
        </p>
      );
    }

    return (
      <Turnstile
        ref={innerRef}
        siteKey={siteKey}
        options={{
          theme: "light",
          appearance: "interaction-only",
          refreshExpired: "auto",
          retry: "auto",
        }}
        onSuccess={onToken}
        onError={onError}
        onExpire={onExpire}
        className={className}
      />
    );
  },
);
