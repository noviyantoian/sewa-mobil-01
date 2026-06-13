"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";

export function CTABandPhoto() {
  const t = useT();
  return (
    <section className="bg-[var(--color-canvas)] py-20 md:py-[96px]">
      <div className="container-folka">
        <div className="relative rounded-[16px] overflow-hidden bg-[var(--color-primary)] text-[var(--color-on-primary)] grid lg:grid-cols-2 gap-0 shadow-level-3">
          <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[440px] order-2 lg:order-1">
            <Image
              src="/images/cta-band.webp"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 lg:bg-gradient-to-r lg:from-[var(--color-primary)] lg:via-transparent lg:to-transparent" />
          </div>
          <div className="p-8 md:p-12 lg:p-16 order-1 lg:order-2 flex flex-col justify-center">
            <div className="eyebrow text-[var(--color-on-primary)]/60 mb-4">Mulai sekarang</div>
            <h2 className="!text-[36px] md:!text-[44.8px] !text-[var(--color-on-primary)] mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-[18px] text-[var(--color-on-primary)]/80 leading-relaxed max-w-md mb-8">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/cari">
                <Button variant="primary" size="lg" className="!bg-white !text-[var(--color-primary)] hover:!bg-white/90">
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
        </div>
      </div>
    </section>
  );
}
