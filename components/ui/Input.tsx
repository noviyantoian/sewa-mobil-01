import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/format";

const fieldBase =
  "w-full h-11 px-4 bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline)] rounded-[4px] focus:border-[var(--color-ink)] focus:outline-none placeholder:text-[var(--color-mute-soft)] text-[16px] tracking-[-0.16px] transition-colors";

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
    <select ref={ref} className={cn(fieldBase, "appearance-none pr-10 bg-no-repeat bg-[length:12px] bg-[position:right_16px_center]", className)} style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%276%27 viewBox=%270 0 12 6%27 fill=%27none%27%3E%3Cpath d=%27M1 1l5 4 5-4%27 stroke=%27%23080808%27 stroke-width=%271.5%27 stroke-linecap=%27round%27/%3E%3C/svg%3E")' }} {...props}>
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
        "block text-[12px] font-medium uppercase tracking-[0.6px] text-[var(--color-mute)] mb-2",
        className
      )}
    >
      {children}
    </label>
  );
}
