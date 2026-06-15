import { type ReactNode } from "react";
import { cn } from "@/lib/format";

type Tone = "neutral" | "accent" | "success" | "warning" | "error" | "dark" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-[var(--color-canvas-soft)] text-[var(--color-ink-strong)] border border-[var(--color-hairline)]",
  accent: "bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)]",
  success: "bg-[var(--color-success-soft)] text-[#0a7a35]",
  warning: "bg-[var(--color-warning-soft)] text-[#9a6500]",
  error: "bg-[var(--color-error-soft)] text-[var(--color-error)]",
  dark: "bg-[var(--color-primary)] text-white",
  outline: "border border-[var(--color-hairline-strong)] text-[var(--color-body)]",
};

export function Badge({
  children,
  tone = "neutral",
  dot,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none tracking-[0.01em]",
        tones[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} aria-hidden />}
      {children}
    </span>
  );
}

export const categoryColor: Record<string, string> = {
  mpv: "var(--color-cat-mpv)",
  suv: "var(--color-cat-suv)",
  citycar: "var(--color-cat-citycar)",
  premium: "var(--color-cat-premium)",
  ev: "var(--color-cat-ev)",
};
