"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus, ChatCircleDots } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const items = [
  { q: "q1", a: "a1" },
  { q: "q2", a: "a2" },
  { q: "q3", a: "a3" },
  { q: "q4", a: "a4" },
  { q: "q5", a: "a5" },
  { q: "q6", a: "a6" },
] as const;

const WHATSAPP_URL = "https://wa.me/628112000800";

export function FAQAccordion() {
  const t = useT();

  return (
    <section className="section bg-[var(--color-canvas-warm)]">
      <style>{`
        @keyframes faqDown { from { height: 0 } to { height: var(--radix-accordion-content-height) } }
        @keyframes faqUp { from { height: var(--radix-accordion-content-height) } to { height: 0 } }
        .faq-content[data-state="open"] { animation: faqDown 260ms cubic-bezier(0.16,1,0.3,1); }
        .faq-content[data-state="closed"] { animation: faqUp 200ms cubic-bezier(0.16,1,0.3,1); }
        @media (prefers-reduced-motion: reduce) {
          .faq-content[data-state="open"], .faq-content[data-state="closed"] { animation: none; }
        }
      `}</style>

      <div className="container-folka grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal className="flex flex-col">
          <span className="eyebrow">{t("faq.eyebrow")}</span>
          <h2 className="display-lg mt-4">{t("faq.title")}</h2>

          <div className="mt-8 rounded-[20px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-7 shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <ChatCircleDots size={24} weight="fill" />
            </span>
            <p className="mt-5 text-[16px] leading-relaxed text-[var(--color-body)]">
              {t("faq.subtitle")}
            </p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex">
              <Button variant="primary" size="md">
                {t("ctaBand.secondary")}
              </Button>
            </a>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <Accordion.Root
            type="single"
            collapsible
            defaultValue="q1"
            className="overflow-hidden rounded-[20px] border border-[var(--color-hairline)] bg-[var(--color-canvas)]"
          >
            {items.map((item, i) => (
              <Accordion.Item
                key={item.q}
                value={item.q}
                className={i > 0 ? "border-t border-[var(--color-hairline)]" : ""}
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group/faq flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left transition-colors duration-200 hover:bg-[var(--color-canvas-soft)]">
                    <span className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-[var(--color-ink)] md:text-[18px]">
                      {t(`faq.${item.q}`)}
                    </span>
                    <span
                      aria-hidden
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-hairline-strong)] text-[var(--color-ink)] transition-[transform,background-color,color,border-color] duration-200 group-data-[state=open]/faq:rotate-45 group-data-[state=open]/faq:border-[var(--color-accent)] group-data-[state=open]/faq:bg-[var(--color-accent)] group-data-[state=open]/faq:text-white"
                    >
                      <Plus size={18} weight="bold" />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="faq-content overflow-hidden">
                  <p className="max-w-2xl px-6 pb-6 text-[15px] leading-relaxed text-[var(--color-body-mid)]">
                    {t(`faq.${item.a}`)}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Reveal>
      </div>
    </section>
  );
}
