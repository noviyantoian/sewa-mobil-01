import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/format";

const fieldBase =
  "w-full h-12 px-4 bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline-strong)] rounded-[10px] outline-none placeholder:text-[var(--color-mute-soft)] text-[15px] tracking-[-0.01em] transition-[border-color,box-shadow] duration-150 hover:border-[var(--color-mute)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-soft)] disabled:bg-[var(--color-canvas-soft)] disabled:text-[var(--color-mute)]";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...props },
  ref
) {
  return <input ref={ref} type={type} className={cn(fieldBase, className)} {...props} />;
});

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref
) {
  return <textarea ref={ref} className={cn(fieldBase, "h-auto min-h-28 py-3 leading-relaxed", className)} {...props} />;
});

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        fieldBase,
        "appearance-none pr-10 bg-no-repeat bg-[length:12px] bg-[position:right_16px_center] cursor-pointer",
        className
      )}
      style={{
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%276%27 viewBox=%270 0 12 6%27 fill=%27none%27%3E%3Cpath d=%27M1 1l5 4 5-4%27 stroke=%27%23080808%27 stroke-width=%271.5%27 stroke-linecap=%27round%27/%3E%3C/svg%3E")',
      }}
      {...props}
    >
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
  children: ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("label-caps block mb-2", className)}>
      {children}
    </label>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label?: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error ? (
        <p className="mt-1.5 text-[13px] text-[var(--color-error)]">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[13px] text-[var(--color-mute)]">{hint}</p>
      ) : null}
    </div>
  );
}
