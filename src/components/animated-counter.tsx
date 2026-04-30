"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { formatLempirasShort } from "@/lib/format";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  className?: string;
  ariaLabel?: string;
}

export function AnimatedCounter({
  value,
  duration = 1.2,
  prefix = "L ",
  className,
  ariaLabel,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const target = Number.isFinite(value) ? value : 0;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = `${prefix}${formatLempirasShort(obj.v)}`;
          }
        },
      });
    },
    { dependencies: [value, duration, prefix] },
  );

  return (
    <span
      ref={ref}
      className={className}
      aria-label={ariaLabel ?? `${prefix}${formatLempirasShort(value)}`}
    >
      {prefix}
      {formatLempirasShort(value)}
    </span>
  );
}
