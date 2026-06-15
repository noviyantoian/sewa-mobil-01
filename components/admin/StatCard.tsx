"use client";

import type { ReactNode } from "react";
import { TrendUp, TrendDown } from "@phosphor-icons/react";
import { cn } from "@/lib/format";

export function StatCard({
  label,
  value,
  icon,
  delta,
  bars,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  delta?: { value: string; up?: boolean };
  bars?: number[];
}) {
  const max = bars && bars.length ? Math.max(...bars) : 1;
  return (
    <div className="card shadow-sm flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between">
        <span className="label-caps">{label}</span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
          {icon}
        </span>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="tnum text-[30px] font-bold leading-none tracking-[-0.03em] text-[var(--color-ink)]">
            {value}
          </span>
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[12px] font-semibold",
                delta.up ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
              )}
            >
              {delta.up ? <TrendUp size={13} weight="bold" /> : <TrendDown size={13} weight="bold" />}
              <span className="tnum">{delta.value}</span>
            </span>
          )}
        </div>

        {bars && bars.length > 0 && (
          <div className="flex h-10 items-end gap-1" aria-hidden>
            {bars.map((b, i) => (
              <span
                key={i}
                className="w-1.5 rounded-[2px] bg-[var(--color-accent)] opacity-80"
                style={{ height: `${Math.max(12, (b / max) * 100)}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
