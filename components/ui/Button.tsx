import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "secondary-dark" | "ghost" | "text-link";
type Size = "md" | "lg" | "sm";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center justify-center font-bold uppercase tracking-[0.5px] transition-colors duration-150 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-active)] active:bg-[var(--color-primary-active)] disabled:bg-[var(--color-primary-disabled)] disabled:text-[var(--color-muted)]",
  secondary:
    "bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline-strong)] hover:border-[var(--color-ink)] active:bg-[var(--color-surface-soft)]",
  "secondary-dark":
    "bg-transparent text-[var(--color-on-dark)] border border-[var(--color-on-dark)] hover:bg-[var(--color-on-dark)] hover:text-[var(--color-ink)]",
  ghost:
    "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)]",
  "text-link":
    "bg-transparent text-[var(--color-ink)] hover:text-[var(--color-primary)] !tracking-[1.5px] !uppercase !text-[13px]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[13px]",
  md: "h-12 px-8 text-[14px]",
  lg: "h-14 px-10 text-[15px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        base,
        variants[variant],
        variant !== "text-link" ? sizes[size] : "h-auto px-0 py-1",
        className
      )}
      {...props}
    />
  );
});
