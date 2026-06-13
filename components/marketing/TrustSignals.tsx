"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n/I18nProvider";

const items: Array<{ key: "transparency" | "verification" | "drivers" | "fleet"; img: string }> = [
  { key: "transparency", img: "/images/feature-self-drive.webp" },
  { key: "verification", img: "/images/trust-verifikasi.webp" },
  { key: "drivers", img: "/images/feature-with-driver.webp" },
  { key: "fleet", img: "/images/trust-handover.webp" },
];

export function TrustSignals() {
  const t = useT();
  return (
    <section className="bg-[var(--color-canvas)] py-20 md:py-[80px]">
      <div className="container-folka">
        <h2 className="text-[32px] md:text-[48px] font-bold mb-12 max-w-2xl">
          {t("trust.title")}
        </h2>
        <ul className="grid gap-x-8 gap-y-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.key}>
              <div className="relative aspect-square bg-[var(--color-surface-card)] mb-6 overflow-hidden">
                <Image
                  src={item.img}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
              <h3 className="text-[18px] font-bold text-[var(--color-ink)] mb-2">
                {t(`trust.items.${item.key}`)}
              </h3>
              <p className="text-[14px] text-[var(--color-body)] leading-relaxed">
                {t(`trust.items.${item.key}Desc`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
