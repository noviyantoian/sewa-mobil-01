"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n/I18nProvider";

const items: Array<{ key: "transparency" | "verification" | "drivers" | "fleet"; img: string; accent: string }> = [
  { key: "transparency", img: "/images/feature-self-drive.webp", accent: "#7a3dff" },
  { key: "verification", img: "/images/trust-verifikasi.webp", accent: "#3b89ff" },
  { key: "drivers", img: "/images/feature-with-driver.webp", accent: "#ff6b00" },
  { key: "fleet", img: "/images/trust-handover.webp", accent: "#00d722" },
];

export function TrustSignals() {
  const t = useT();
  return (
    <section className="bg-[var(--color-canvas)] py-20 md:py-[96px]">
      <div className="container-folka">
        <div className="grid md:grid-cols-12 gap-6 items-end mb-12 md:mb-16">
          <div className="md:col-span-8">
            <div className="eyebrow text-[var(--color-mute)] mb-4">Trust signals</div>
            <h2 className="!text-[44.8px] md:!text-[56px]">{t("trust.title")}</h2>
          </div>
        </div>

        <ul className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li
              key={item.key}
              className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[12px] overflow-hidden flex flex-col hover:shadow-level-2 transition-shadow"
            >
              <div className="relative aspect-square bg-[var(--color-canvas-soft)] overflow-hidden">
                <Image
                  src={item.img}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
                <span
                  className="absolute top-3 left-3 inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.accent }}
                  aria-hidden
                />
              </div>
              <div className="p-6 flex-1">
                <h3 className="!text-[20px] !leading-[1.3] mb-2">
                  {t(`trust.items.${item.key}`)}
                </h3>
                <p className="text-[14px] text-[var(--color-body)] leading-relaxed">
                  {t(`trust.items.${item.key}Desc`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
