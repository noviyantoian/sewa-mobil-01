"use client";

import { QrCode, Wallet, CreditCard, Bank, type Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/format";

export type PaymentMethod = "qris" | "gopay" | "ovo" | "card" | "va";

const methods: { id: PaymentMethod; label: string; icon: Icon }[] = [
  { id: "qris", label: "QRIS", icon: QrCode },
  { id: "gopay", label: "GoPay", icon: Wallet },
  { id: "ovo", label: "OVO", icon: Wallet },
  { id: "card", label: "Kartu kredit/debit", icon: CreditCard },
  { id: "va", label: "Virtual Account", icon: Bank },
];

export function PaymentMethods({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (next: PaymentMethod) => void;
}) {
  return (
    <div role="radiogroup" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {methods.map(({ id, label, icon: Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            className={cn(
              "flex cursor-pointer flex-col items-start gap-2 rounded-[12px] border p-3.5 text-left transition-colors",
              active
                ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                : "border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] hover:border-[var(--color-ink)]"
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-[9px]",
                active ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-canvas-soft)] text-[var(--color-ink)]"
              )}
            >
              <Icon size={18} weight={active ? "fill" : "regular"} />
            </span>
            <span className="text-[13px] font-semibold leading-tight text-[var(--color-ink)]">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
