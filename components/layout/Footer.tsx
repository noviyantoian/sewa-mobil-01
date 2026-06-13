"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/I18nProvider";

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-surface-soft)] text-[var(--color-body)]">
      <div className="container-folka py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-7 h-7 bg-[var(--color-primary)]" aria-hidden />
              <span className="font-bold text-[16px] text-[var(--color-ink)]">{t("brand.name")}</span>
            </div>
            <p className="text-[14px] leading-relaxed">{t("footer.tagline")}</p>
          </div>

          <div>
            <h4 className="label-uppercase text-[var(--color-ink)] mb-4">{t("footer.fleet")}</h4>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/cari?category=mpv" className="hover:text-[var(--color-ink)]">{t("categories.mpv")}</Link></li>
              <li><Link href="/cari?category=suv" className="hover:text-[var(--color-ink)]">{t("categories.suv")}</Link></li>
              <li><Link href="/cari?category=premium" className="hover:text-[var(--color-ink)]">{t("categories.premium")}</Link></li>
              <li><Link href="/cari?category=ev" className="hover:text-[var(--color-ink)]">{t("categories.ev")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="label-uppercase text-[var(--color-ink)] mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/tentang" className="hover:text-[var(--color-ink)]">{t("footer.about")}</Link></li>
              <li><Link href="/kontak" className="hover:text-[var(--color-ink)]">{t("footer.contact")}</Link></li>
              <li><Link href="/karier" className="hover:text-[var(--color-ink)]">{t("footer.career")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="label-uppercase text-[var(--color-ink)] mb-4">{t("footer.support")}</h4>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/faq" className="hover:text-[var(--color-ink)]">{t("footer.faq")}</Link></li>
              <li><Link href="/cara-kerja" className="hover:text-[var(--color-ink)]">{t("footer.howItWorks")}</Link></li>
              <li><Link href="/syarat" className="hover:text-[var(--color-ink)]">{t("footer.terms")}</Link></li>
              <li><Link href="/privasi" className="hover:text-[var(--color-ink)]">{t("footer.privacy")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-hairline)] text-[12px] text-[var(--color-muted)]">
          {t("footer.rights", { year })}
        </div>
      </div>
    </footer>
  );
}
