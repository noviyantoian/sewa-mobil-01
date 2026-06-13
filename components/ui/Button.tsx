import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "secondary-dark" | "ghost" | "text-arrow";
type Size = "md" | "lg" | "sm";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center justify-center font-medium transition-all duration-150 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] rounded-[4px]";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[#222] active:translate-y-px disabled:bg-[var(--color-hairline)] disabled:text-[var(--color-mute)]",
  secondary:
    "bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline)] hover:border-[var(--color-ink)] active:translate-y-px",
  "secondary-dark":
    "bg-transparent text-[var(--color-on-primary)] border border-[var(--color-on-primary)]/30 hover:bg-[var(--color-on-primary)]/10 hover:border-[var(--color-on-primary)]",
  ghost:
    "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-canvas-soft)]",
  "text-arrow":
    "!rounded-none bg-transparent text-[var(--color-ink)] hover:text-[var(--color-accent-blue-deep)] gap-2 px-0",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[14px] tracking-[-0.16px]",
  md: "h-11 px-5 text-[16px] tracking-[-0.16px]",
  lg: "h-12 px-6 text-[16px] tracking-[-0.16px]",
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
        variant !== "text-arrow" ? sizes[size] : "h-auto py-2",
        className
      )}
      {...props}
    />
  );
});
