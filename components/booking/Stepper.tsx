"use client";

import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/format";

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
            <span className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors",
                  done && "bg-[var(--color-success)] text-white",
                  active && "bg-[var(--color-accent)] text-white",
                  !done && !active && "bg-[var(--color-canvas-soft)] text-[var(--color-mute)]"
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check size={16} weight="bold" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-[13px] font-semibold sm:inline",
                  active ? "text-[var(--color-ink)]" : "text-[var(--color-mute)]"
                )}
              >
                {label}
              </span>
            </span>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  "h-px flex-1 transition-colors",
                  done ? "bg-[var(--color-success)]" : "bg-[var(--color-hairline)]"
                )}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
