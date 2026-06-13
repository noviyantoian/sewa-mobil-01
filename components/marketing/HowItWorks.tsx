"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n/I18nProvider";

const steps = [
  { key: "step1", img: "/images/how-1-search.webp", accent: "#7a3dff" },
  { key: "step2", img: "/images/how-2-pickup.webp", accent: "#3b89ff" },
  { key: "step3", img: "/images/cta-band.webp", accent: "#ff6b00" },
] as const;

export function HowItWorks() {
  const t = useT();
  return (
    <section className="bg-[var(--color-canvas-soft)] py-20 md:py-[96px]">
      <div className="container-folka">
        <div className="grid md:grid-cols-12 gap-6 items-end mb-12 md:mb-16">
          <div className="md:col-span-8">
            <div className="eyebrow text-[var(--color-mute)] mb-4">Cara kerja</div>
            <h2 className="!text-[44.8px] md:!text-[56px]">{t("howItWorks.title")}</h2>
          </div>
        </div>

        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={s.key}
              className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[12px] overflow-hidden flex flex-col hover:shadow-level-2 transition-shadow"
            >
              <div className="relative aspect-[4/3] bg-[var(--color-canvas-soft)] overflow-hidden">
                <Image
                  src={s.img}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <span
                  className="absolute top-4 left-4 inline-flex items-center justify-center w-9 h-9 rounded-full text-white font-semibold text-[14px]"
                  style={{ backgroundColor: s.accent }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="!text-[24px] !leading-[1.2] mb-3">{t(`howItWorks.${s.key}Title`)}</h3>
                <p className="text-[15px] text-[var(--color-body)] leading-relaxed">{t(`howItWorks.${s.key}Desc`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
