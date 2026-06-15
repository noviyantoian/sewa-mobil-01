import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/format";

type Variant = "primary" | "dark" | "secondary" | "secondary-dark" | "ghost" | "link";
type Size = "sm" | "md" | "lg" | "xl";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 font-semibold tracking-[-0.01em] cursor-pointer select-none transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-px";

const variants: Record<Variant, string> = {
  primary:
    "rounded-[10px] bg-[var(--color-accent)] text-white shadow-accent hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-hairline-strong)] disabled:text-[var(--color-mute)] disabled:shadow-none",
  dark:
    "rounded-[10px] bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[#26282c] shadow-sm",
  secondary:
    "rounded-[10px] bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline-strong)] hover:border-[var(--color-ink)] hover:bg-[var(--color-canvas-soft)]",
  "secondary-dark":
    "rounded-[10px] bg-white/0 text-white border border-white/25 hover:bg-white/10 hover:border-white/60",
  ghost:
    "rounded-[10px] bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-canvas-soft)]",
  link:
    "rounded-none px-0 h-auto py-1 bg-transparent text-[var(--color-ink)] hover:text-[var(--color-accent)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[14px]",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-[16px]",
  xl: "h-14 px-8 text-[17px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", loading = false, disabled, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(base, variants[variant], variant !== "link" && sizes[size], className)}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});
