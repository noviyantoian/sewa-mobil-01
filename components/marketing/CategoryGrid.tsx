"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n/I18nProvider";

const items: Array<{ key: "mpv" | "suv" | "citycar" | "premium" | "ev"; src: string }> = [
  { key: "mpv", src: "/images/category-mpv.webp" },
  { key: "suv", src: "/images/category-suv.webp" },
  { key: "citycar", src: "/images/category-citycar.webp" },
  { key: "premium", src: "/images/category-premium.webp" },
  { key: "ev", src: "/images/category-ev.webp" },
];

export function CategoryGrid() {
  const t = useT();
  return (
    <section className="bg-[var(--color-canvas)] py-20 md:py-[80px]">
      <div className="container-folka">
        <div className="grid md:grid-cols-12 gap-6 items-end mb-12">
          <h2 className="md:col-span-7 text-[32px] md:text-[48px] font-bold leading-[1.1]">
            {t("categories.title")}
          </h2>
          <p className="md:col-span-5 text-[16px] text-[var(--color-body)] max-w-md">
            {t("categories.subtitle")}
          </p>
        </div>

        <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => (
            <li key={item.key}>
              <Link href={`/cari?category=${item.key}`} className="group block bg-[var(--color-canvas)]">
                <div className="relative aspect-[4/3] bg-[var(--color-surface-card)] overflow-hidden">
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="pt-5 pb-2">
                  <h3 className="text-[18px] font-bold text-[var(--color-ink)] mb-1">
                    {t(`categories.${item.key}`)}
                  </h3>
                  <p className="text-[14px] text-[var(--color-body)] mb-4 min-h-[2.5em]">
                    {t(`categories.${item.key}Desc`)}
                  </p>
                  <span className="label-uppercase text-[var(--color-ink)] group-hover:text-[var(--color-primary)]">
                    {t("categories.learnMore")}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
