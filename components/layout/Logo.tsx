import { cn } from "@/lib/format";

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-[9px] bg-[var(--color-accent)]">
        <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-white/25" aria-hidden />
        <span className="text-[15px] font-bold text-white">F</span>
      </span>
      <span
        className={cn(
          "text-[17px] font-bold tracking-[-0.02em]",
          dark ? "text-white" : "text-[var(--color-ink)]"
        )}
      >
        Folka<span className="text-[var(--color-accent)]">Drive</span>
      </span>
    </span>
  );
}
