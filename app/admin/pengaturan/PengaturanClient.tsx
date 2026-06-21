"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserCircle, SignIn } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/format";
import { updateTenantSettingsAction } from "./actions";

export function PengaturanClient({ guestCheckout }: { guestCheckout: boolean }) {
  const t = useT();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  // Optimistic local mirror so the segmented control reflects the choice
  // immediately while the server action persists + revalidates.
  const [value, setValue] = useState(guestCheckout);

  const setGuestCheckout = (next: boolean) => {
    if (next === value || pending) return;
    const prev = value;
    setValue(next);
    startTransition(async () => {
      const res = await updateTenantSettingsAction({ guestCheckout: next });
      if (res.ok) {
        toast.success(t("admin.settingsSaved"));
        router.refresh();
      } else {
        setValue(prev);
        toast.error(t("admin.errFailed"));
      }
    });
  };

  const options: { value: boolean; label: string; hint: string; icon: React.ReactNode }[] = [
    {
      value: true,
      label: t("admin.guestCheckoutOn"),
      hint: t("admin.guestCheckoutOnHint"),
      icon: <UserCircle size={22} />,
    },
    {
      value: false,
      label: t("admin.guestCheckoutOff"),
      hint: t("admin.guestCheckoutOffHint"),
      icon: <SignIn size={22} />,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <span className="eyebrow">{t("admin.navSettings")}</span>
        <h1 className="display-sm">{t("admin.settingsTitle")}</h1>
        <p className="max-w-prose text-[15px] font-light text-[var(--color-body)]">
          {t("admin.settingsSubtitle")}
        </p>
      </header>

      <section className="card flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <h2 className="text-[17px] font-bold tracking-[-0.01em] text-[var(--color-ink)]">
            {t("admin.guestCheckoutLabel")}
          </h2>
          <p className="max-w-prose text-[14px] font-light text-[var(--color-body)]">
            {t("admin.guestCheckoutDesc")}
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label={t("admin.guestCheckoutLabel")}
          className="grid gap-3 sm:grid-cols-2"
        >
          {options.map((opt) => {
            const active = value === opt.value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={pending}
                onClick={() => setGuestCheckout(opt.value)}
                className={cn(
                  "group flex cursor-pointer flex-col gap-2 border p-4 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60",
                  active
                    ? "border-[var(--color-accent)] bg-[color-mix(in_srgb,var(--color-accent)_6%,transparent)]"
                    : "border-[var(--color-hairline-strong)] hover:border-[var(--color-ink)]",
                )}
              >
                <span
                  className={cn(
                    "flex items-center gap-2 font-bold tracking-[-0.01em]",
                    active ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]",
                  )}
                >
                  {opt.icon}
                  {opt.label}
                </span>
                <span className="text-[13px] font-light text-[var(--color-body)]">
                  {opt.hint}
                </span>
              </button>
            );
          })}
        </div>

        <p className="border-t border-[var(--color-hairline)] pt-4 text-[12px] font-light leading-relaxed text-[var(--color-muted)]">
          {t("admin.guestCheckoutNote")}
        </p>
      </section>
    </div>
  );
}
