"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { asset } from "@/lib/asset";
import { categoryColor } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";

type CatKey = "mpv" | "suv" | "citycar" | "premium" | "ev";

const cats: { key: CatKey; image: string; span: string }[] = [
  { key: "mpv", image: "/images/category-mpv.webp", span: "md:col-span-2" },
  { key: "suv", image: "/images/category-suv.webp", span: "md:col-span-2" },
  { key: "ev", image: "/images/category-ev.webp", span: "" },
  { key: "citycar", image: "/images/category-citycar.webp", span: "" },
  { key: "premium", image: "/images/category-premium.webp", span: "md:col-span-2" },
];

export function Categories() {
  const t = useT();

  return (
    <section className="section bg-[var(--color-canvas)]">
      <div className="container-folka">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">{t("categories.eyebrow")}</span>
          <h2 className="display-lg mt-4">{t("categories.title")}</h2>
          <p className="body-lg mt-4 text-[var(--color-body-mid)]">{t("categories.subtitle")}</p>
        </Reveal>

        <div className="rail mt-10 md:mt-12 md:grid md:grid-cols-4 md:gap-4 md:mx-0 md:px-0 md:overflow-visible">
          {cats.map((c, i) => (
            <Reveal
              key={c.key}
              delay={((i % 3) + 1) as 1 | 2 | 3}
              className={`min-w-[78%] md:min-w-0 ${c.span}`}
            >
              <Link
                href={`/cari?cat=${c.key}`}
                aria-label={t(`categories.${c.key}Name`)}
                className="group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-[20px] border border-[var(--color-hairline)] p-6 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[var(--color-hairline-strong)] hover:shadow-lg focus-visible:-translate-y-1"
              >
                <Image
                  src={asset(c.image)}
                  alt={t(`categories.${c.key}Name`)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/24 to-black/8"
                />
                <div className="relative">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,#fff_16%,transparent)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-white backdrop-blur">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: categoryColor[c.key] }}
                      aria-hidden
                    />
                    {t(`categories.${c.key}Name`)}
                  </span>
                  <p className="mt-3 max-w-[22ch] text-[15px] font-medium leading-snug text-white/90">
                    {t(`categories.${c.key}Desc`)}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white opacity-0 transition-[opacity,gap] duration-200 group-hover:gap-2.5 group-hover:opacity-100">
                    {t("categories.explore")}
                    <ArrowRight size={15} weight="bold" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
