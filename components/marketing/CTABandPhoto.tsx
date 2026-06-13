"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";

export function CTABandPhoto() {
  const t = useT();
  return (
    <section className="relative bg-[var(--color-surface-dark)] text-[var(--color-on-dark)] overflow-hidden">
      <Image
        src="/images/cta-band.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface-dark)]/40 to-[var(--color-surface-dark)]/80" />
      <div className="container-folka relative py-20 md:py-[80px] text-center max-w-3xl mx-auto">
        <h2 className="text-[32px] md:text-[48px] font-bold mb-4 text-[var(--color-on-dark)]">
          {t("cta.title")}
        </h2>
        <p className="text-[16px] md:text-[18px] text-[var(--color-on-dark-soft)] mb-10">
          {t("cta.subtitle")}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/cari">
            <Button variant="primary" size="lg">
              {t("cta.primary")}
            </Button>
          </Link>
          <Link href="/kontak">
            <Button variant="secondary-dark" size="lg">
              {t("cta.secondary")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
