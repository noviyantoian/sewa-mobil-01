"use client";

import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus, ChatCircleDots, ArrowRight } from "@phosphor-icons/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/I18nProvider";

const ITEM_KEYS = ["1", "2", "3", "4", "5", "6"] as const;

export default function FaqPage() {
  const t = useT();

  return (
    <>
      <Header />
      <main className="bg-[var(--color-canvas-warm)]">
        <div className="container-folka section grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Heading rail */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">{t("faq.eyebrow")}</span>
            <h1 className="display-lg mt-4">{t("faq.title")}</h1>
            <p className="body-lg mt-4 max-w-sm text-[var(--color-body-mid)]">{t("faq.subtitle")}</p>

            <div className="card mt-8 hidden flex-col gap-4 bg-[var(--color-surface-dark)] p-7 lg:flex">
              <ChatCircleDots size={26} weight="duotone" className="text-[var(--color-accent)]" />
              <p className="text-[16px] text-[var(--color-on-dark)]">{t("faq.subtitle")}</p>
              <Link href="/kontak">
                <Button variant="secondary-dark" size="md" className="mt-1 w-full">
                  {t("nav.contact")}
                  <ArrowRight size={16} weight="bold" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Accordion */}
          <div>
            <Accordion.Root
              type="single"
              collapsible
              defaultValue="1"
              className="overflow-hidden rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] shadow-sm"
            >
              {ITEM_KEYS.map((k, i) => (
                <Accordion.Item
                  key={k}
                  value={k}
                  className={i > 0 ? "border-t border-[var(--color-hairline)]" : ""}
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="group/trigger flex w-full cursor-pointer items-center justify-between gap-6 p-6 text-left transition-colors duration-150 hover:bg-[var(--color-canvas-soft)] md:p-7">
                      <span className="text-[17px] font-semibold text-[var(--color-ink)] md:text-[19px]">
                        {t(`faq.q${k}`)}
                      </span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-hairline-strong)] text-[var(--color-ink)] transition-[transform,background-color,border-color,color] duration-200 ease-out group-data-[state=open]/trigger:rotate-45 group-data-[state=open]/trigger:border-[var(--color-accent)] group-data-[state=open]/trigger:bg-[var(--color-accent)] group-data-[state=open]/trigger:text-white">
                        <Plus size={18} weight="bold" />
                      </span>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden">
                    <p className="max-w-[62ch] px-6 pb-7 text-[16px] leading-relaxed text-[var(--color-body)] md:px-7">
                      {t(`faq.a${k}`)}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>

            {/* Mobile contact CTA */}
            <div className="card mt-6 flex items-center justify-between gap-4 bg-[var(--color-accent-soft)] p-6 lg:hidden">
              <p className="text-[15px] font-semibold text-[var(--color-accent-ink)]">{t("faq.subtitle")}</p>
              <Link href="/kontak" className="shrink-0">
                <Button size="sm">{t("nav.contact")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
