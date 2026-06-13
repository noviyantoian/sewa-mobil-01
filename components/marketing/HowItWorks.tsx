"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n/I18nProvider";

const steps = [
  { key: "step1", img: "/images/how-1-search.webp" },
  { key: "step2", img: "/images/how-2-pickup.webp" },
  { key: "step3", img: "/images/cta-band.webp" },
] as const;

export function HowItWorks() {
  const t = useT();
  return (
    <section className="bg-[var(--color-surface-soft)] py-20 md:py-[80px]">
      <div className="container-folka">
        <h2 className="text-[32px] md:text-[48px] font-bold mb-12 max-w-2xl">
          {t("howItWorks.title")}
        </h2>
        <ol className="divide-y divide-[var(--color-hairline)]">
          {steps.map((s, i) => (
            <li key={s.key} className="grid grid-cols-1 md:grid-cols-12 gap-6 py-10 items-center">
              <div className="md:col-span-1 text-[40px] md:text-[64px] font-bold text-[var(--color-primary)] leading-none">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="md:col-span-6">
                <h3 className="text-[24px] md:text-[32px] font-bold mb-3">{t(`howItWorks.${s.key}Title`)}</h3>
                <p className="text-[16px] text-[var(--color-body)] max-w-xl">{t(`howItWorks.${s.key}Desc`)}</p>
              </div>
              <div className="md:col-span-5 relative aspect-[4/3] bg-[var(--color-surface-card)] overflow-hidden">
                <Image
                  src={s.img}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 35vw"
                  className="object-cover"
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
