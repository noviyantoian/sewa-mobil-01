"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n/I18nProvider";

type Item = {
  key: "mpv" | "suv" | "citycar" | "premium" | "ev";
  src: string;
  accent: string;
  accentText: string;
};

const items: Item[] = [
  { key: "mpv", src: "/images/category-mpv.webp", accent: "#7a3dff", accentText: "#ffffff" },
  { key: "suv", src: "/images/category-suv.webp", accent: "#ed52cb", accentText: "#ffffff" },
  { key: "citycar", src: "/images/category-citycar.webp", accent: "#00d722", accentText: "#080808" },
  { key: "premium", src: "/images/category-premium.webp", accent: "#3b89ff", accentText: "#ffffff" },
  { key: "ev", src: "/images/category-ev.webp", accent: "#ff6b00", accentText: "#ffffff" },
];

export function CategoryGrid() {
  const t = useT();
  const [feature, ...rest] = items;

  return (
    <section className="bg-[var(--color-canvas)] py-20 md:py-[96px]">
      <div className="container-folka">
        <div className="grid md:grid-cols-12 gap-6 items-end mb-12 md:mb-16">
          <div className="md:col-span-7">
            <div className="eyebrow text-[var(--color-mute)] mb-4">{t("categories.title")}</div>
            <h2 className="!text-[44.8px] md:!text-[56px]">{t("categories.subtitle")}</h2>
          </div>
        </div>

        <div className="grid gap-5 grid-cols-1 md:grid-cols-6 md:grid-rows-2 md:auto-rows-fr">
          {/* Feature bento — MPV span 2 col 2 row */}
          <Link
            href={`/cari?category=${feature.key}`}
            className="group relative md:col-span-3 md:row-span-2 rounded-[12px] overflow-hidden bg-[var(--color-canvas-soft)] border border-[var(--color-hairline)] hover:shadow-level-2 transition-shadow"
            style={{ minHeight: 420 }}
          >
            <Image
              src={feature.src}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, transparent 40%, ${feature.accent}E6 100%)`,
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white">
              <div className="eyebrow-sm opacity-90 mb-2">Bento Featured</div>
              <h3 className="!text-[32px] md:!text-[44.8px] !text-white !leading-[1.04] mb-2">
                {t(`categories.${feature.key}`)}
              </h3>
              <p className="text-[15px] md:text-[16px] text-white/90 max-w-md mb-4">
                {t(`categories.${feature.key}Desc`)}
              </p>
              <span className="inline-flex items-center gap-2 text-[14px] font-medium text-white">
                {t("categories.learnMore")}
              </span>
            </div>
          </Link>

          {/* Four small cards */}
          {rest.map((it) => (
            <Link
              key={it.key}
              href={`/cari?category=${it.key}`}
              className="group relative md:col-span-3 lg:col-span-1.5 rounded-[12px] overflow-hidden bg-[var(--color-canvas)] border border-[var(--color-hairline)] hover:shadow-level-2 transition-shadow flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-[var(--color-canvas-soft)] overflow-hidden">
                <Image
                  src={it.src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span
                  className="absolute top-3 left-3 inline-block px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.6px] rounded-[4px]"
                  style={{ backgroundColor: it.accent, color: it.accentText }}
                >
                  {t(`categories.${it.key}`)}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-[14px] text-[var(--color-body)] mb-4 leading-relaxed flex-1">
                  {t(`categories.${it.key}Desc`)}
                </p>
                <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent-blue-deep)]">
                  {t("categories.learnMore")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
