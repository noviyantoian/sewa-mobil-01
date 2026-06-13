import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/format";

const fieldBase =
  "w-full h-12 px-4 bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline)] focus:border-[var(--color-ink)] focus:outline-none placeholder:text-[var(--color-muted-soft)]";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...props },
  ref
) {
  return <input ref={ref} type={type} className={cn(fieldBase, className)} {...props} />;
});

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref
) {
  return (
    <select ref={ref} className={cn(fieldBase, "appearance-none pr-10", className)} {...props}>
      {children}
    </select>
  );
});

export function Label({
  htmlFor,
  children,
  className,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-[12px] font-bold uppercase tracking-[1.5px] text-[var(--color-muted)] mb-2",
        className
      )}
    >
      {children}
    </label>
  );
}
