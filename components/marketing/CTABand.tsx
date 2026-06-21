"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { asset } from "@/lib/asset";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const WHATSAPP_URL = "https://wa.me/628112000800";

export function CTABand() {
  const t = useT();

  return (
    <section className="section bg-[var(--color-canvas)]">
      <div className="container-folka">
        <div className="relative isolate overflow-hidden rounded-[28px]">
          <Image
            src={asset("/images/cta-band.webp")}
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1232px"
            className="object-cover"
          />
          {/* Dark overlay tuned for AA text contrast over photo */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,8,8,0.86)_0%,rgba(8,8,8,0.62)_55%,rgba(8,8,8,0.38)_100%)]"
          />

          <Reveal className="relative max-w-2xl px-7 py-16 md:px-14 md:py-24">
            <h2 className="display-lg text-white">{t("ctaBand.title")}</h2>
            <p className="body-lg mt-5 max-w-xl text-[var(--color-on-dark-soft)]">
              {t("ctaBand.subtitle")}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/cari" className="inline-flex">
                <Button variant="primary" size="xl" className="w-full sm:w-auto">
                  {t("ctaBand.primary")}
                  <ArrowRight size={20} weight="bold" />
                </Button>
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex">
                <Button variant="secondary-dark" size="xl" className="w-full sm:w-auto">
                  <WhatsappLogo size={20} weight="fill" />
                  {t("ctaBand.secondary")}
                </Button>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
