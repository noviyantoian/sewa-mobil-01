"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { Info } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR } from "@/lib/format";

export type PriceBreakdown = {
  days: number;
  rentalSubtotal: number;
  addonsTotal: number;
  deposit: number;
  total: number;
  dueNow: number;
};

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[14px]">
      <span className={strong ? "font-semibold text-[var(--color-ink)]" : "text-[var(--color-body-mid)]"}>
        {label}
      </span>
      <span className={`tnum ${strong ? "font-bold text-[var(--color-ink)]" : "font-semibold text-[var(--color-ink)]"}`}>
        {value}
      </span>
    </div>
  );
}

export function PriceSummary({ price }: { price: PriceBreakdown }) {
  const t = useT();

  return (
    <div className="flex flex-col gap-3">
      <Row label={t("checkout.rentalSubtotal", { days: price.days })} value={formatIDR(price.rentalSubtotal)} />
      {price.addonsTotal > 0 && (
        <Row label={t("checkout.addonsTotal")} value={formatIDR(price.addonsTotal)} />
      )}

      <div className="flex items-center justify-between text-[14px]">
        <span className="inline-flex items-center gap-1.5 text-[var(--color-body-mid)]">
          {t("checkout.depositLabel")}
          <Tooltip.Provider delayDuration={150}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  aria-label={t("checkout.depositLabel")}
                  className="inline-flex cursor-help text-[var(--color-mute)] hover:text-[var(--color-accent)]"
                >
                  <Info size={15} weight="fill" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  sideOffset={6}
                  className="z-[80] max-w-[240px] rounded-[10px] bg-[var(--color-primary)] px-3 py-2 text-[12px] leading-relaxed text-white shadow-lg"
                >
                  {t("checkout.depositTip")}
                  <Tooltip.Arrow className="fill-[var(--color-primary)]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </span>
        <span className="tnum font-semibold text-[var(--color-ink)]">{formatIDR(price.deposit)}</span>
      </div>

      <div className="border-t border-[var(--color-hairline)] pt-3">
        <Row label={t("common.total")} value={formatIDR(price.total)} strong />
      </div>

      <div className="flex items-center justify-between rounded-[10px] bg-[var(--color-accent-soft)] px-3.5 py-3">
        <span className="text-[14px] font-semibold text-[var(--color-accent-ink)]">{t("checkout.dueNow")}</span>
        <span className="tnum text-[18px] font-bold text-[var(--color-accent-ink)]">{formatIDR(price.dueNow)}</span>
      </div>
    </div>
  );
}
