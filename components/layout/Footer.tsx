"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/I18nProvider";

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-canvas)] border-t border-[var(--color-hairline)]">
      <div className="container-folka py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-12 mb-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[14px] font-semibold">
                F
              </span>
              <span className="font-semibold text-[16px] text-[var(--color-ink)]">{t("brand.name")}</span>
            </div>
            <p className="text-[15px] text-[var(--color-body-mid)] leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="eyebrow-sm text-[var(--color-mute)] mb-4">{t("footer.fleet")}</h4>
              <ul className="space-y-2.5 text-[14px]">
                <li><Link href="/cari?category=mpv" className="text-[var(--color-body-mid)] hover:text-[var(--color-ink)]">{t("categories.mpv")}</Link></li>
                <li><Link href="/cari?category=suv" className="text-[var(--color-body-mid)] hover:text-[var(--color-ink)]">{t("categories.suv")}</Link></li>
                <li><Link href="/cari?category=premium" className="text-[var(--color-body-mid)] hover:text-[var(--color-ink)]">{t("categories.premium")}</Link></li>
                <li><Link href="/cari?category=ev" className="text-[var(--color-body-mid)] hover:text-[var(--color-ink)]">{t("categories.ev")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="eyebrow-sm text-[var(--color-mute)] mb-4">{t("footer.company")}</h4>
              <ul className="space-y-2.5 text-[14px]">
                <li><Link href="/tentang" className="text-[var(--color-body-mid)] hover:text-[var(--color-ink)]">{t("footer.about")}</Link></li>
                <li><Link href="/kontak" className="text-[var(--color-body-mid)] hover:text-[var(--color-ink)]">{t("footer.contact")}</Link></li>
                <li><Link href="/karier" className="text-[var(--color-body-mid)] hover:text-[var(--color-ink)]">{t("footer.career")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="eyebrow-sm text-[var(--color-mute)] mb-4">{t("footer.support")}</h4>
              <ul className="space-y-2.5 text-[14px]">
                <li><Link href="/faq" className="text-[var(--color-body-mid)] hover:text-[var(--color-ink)]">{t("footer.faq")}</Link></li>
                <li><Link href="/cara-kerja" className="text-[var(--color-body-mid)] hover:text-[var(--color-ink)]">{t("footer.howItWorks")}</Link></li>
                <li><Link href="/syarat" className="text-[var(--color-body-mid)] hover:text-[var(--color-ink)]">{t("footer.terms")}</Link></li>
                <li><Link href="/privasi" className="text-[var(--color-body-mid)] hover:text-[var(--color-ink)]">{t("footer.privacy")}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--color-hairline)] flex items-center justify-between flex-wrap gap-3 text-[13px] text-[var(--color-mute)]">
          <span>{t("footer.rights", { year })}</span>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" aria-hidden />
              Sistem normal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
