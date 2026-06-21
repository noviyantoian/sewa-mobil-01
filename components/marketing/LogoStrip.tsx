"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n/I18nProvider";
import { asset } from "@/lib/asset";
import { Reveal } from "@/components/ui/Reveal";

const partners = [
  { slug: "airbnb", name: "Airbnb" },
  { slug: "bookingdotcom", name: "Booking.com" },
  { slug: "expedia", name: "Expedia" },
  { slug: "tripadvisor", name: "Tripadvisor" },
  { slug: "gojek", name: "Gojek" },
  { slug: "grab", name: "Grab" },
];

export function LogoStrip() {
  const t = useT();
  const loop = [...partners, ...partners];

  return (
    <section className="border-y border-[var(--color-hairline)] bg-[var(--color-canvas)]">
      <div className="container-folka py-12 md:py-14">
        <Reveal>
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-mute)]">
            {t("logos.label")}
          </p>
        </Reveal>

        <div
          className="no-scrollbar relative mt-8 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          <ul className="marquee-track flex w-max items-center gap-x-12 md:gap-x-20">
            {loop.map((p, i) => (
              <li
                key={`${p.slug}-${i}`}
                aria-hidden={i >= partners.length}
                className="group flex shrink-0 items-center gap-2.5"
              >
                <Image
                  src={asset(`/images/logos/${p.slug}.svg`)}
                  alt={p.name}
                  width={28}
                  height={28}
                  unoptimized
                  className="h-6 w-6 opacity-50 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 md:h-7 md:w-7"
                />
                <span className="text-[16px] font-bold tracking-[-0.02em] text-[var(--color-mute-soft)] transition-colors duration-300 group-hover:text-[var(--color-ink-strong)] md:text-[18px]">
                  {p.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
