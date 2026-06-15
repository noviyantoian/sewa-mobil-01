"use client";

import { useEffect, useState } from "react";
import { Timer } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";

const HOLD_SECONDS = 15 * 60;

function format(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function HoldTimer() {
  const t = useT();
  const [remaining, setRemaining] = useState(HOLD_SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const low = remaining <= 120;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)] px-4 py-3">
      <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--color-accent-ink)]">
        <Timer size={18} weight="fill" />
        {t("checkout.holdNotice")}
      </span>
      <span
        className="tnum inline-flex items-center gap-1.5 rounded-full bg-[var(--color-canvas)] px-3 py-1 text-[14px] font-bold"
        style={{ color: low ? "var(--color-error)" : "var(--color-accent-ink)" }}
        aria-live="polite"
      >
        {t("checkout.holdTimer", { time: format(remaining) })}
      </span>
    </div>
  );
}
