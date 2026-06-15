"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  WhatsappLogo,
  Phone,
  MapPin,
  Clock,
  PaperPlaneTilt,
  NavigationArrow,
} from "@phosphor-icons/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { useT, useI18n } from "@/lib/i18n/I18nProvider";

const WA_NUMBER = "628112000800";
const PHONE_DISPLAY = "+62 811 2000 800";
const PHONE_TEL = "+628112000800";

const ADDRESS: Record<"id" | "en", string> = {
  id: "Jl. Jenderal Sudirman Kav. 21, Jakarta Pusat 10220",
  en: "Jl. Jenderal Sudirman Kav. 21, Central Jakarta 10220",
};

const CHANNEL_LABEL: Record<"id" | "en", { address: string; mapHint: string }> = {
  id: { address: "Alamat kantor", mapHint: "Sudirman, Jakarta Pusat" },
  en: { address: "Office address", mapHint: "Sudirman, Central Jakarta" },
};

export default function KontakPage() {
  const t = useT();
  const { locale } = useI18n();
  const [sending, setSending] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      toast.success(t("contact.sent"));
      form.reset();
    }, 700);
  }

  const channels = [
    {
      icon: WhatsappLogo,
      label: t("contact.whatsapp"),
      value: PHONE_DISPLAY,
      href: `https://wa.me/${WA_NUMBER}`,
      accent: true,
    },
    {
      icon: Phone,
      label: t("contact.call"),
      value: PHONE_DISPLAY,
      href: `tel:${PHONE_TEL}`,
      accent: false,
    },
  ];

  return (
    <>
      <Header />
      <main className="bg-[var(--color-canvas-warm)]">
        <div className="container-folka section">
          <span className="eyebrow">{t("nav.contact")}</span>
          <h1 className="display-lg mt-4 max-w-2xl">{t("contact.title")}</h1>
          <p className="body-lg mt-4 max-w-xl text-[var(--color-body-mid)]">{t("contact.subtitle")}</p>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            {/* Form */}
            <form onSubmit={onSubmit} className="card p-7 shadow-sm md:p-9">
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("contact.name")} htmlFor="c-name">
                    <Input id="c-name" name="name" autoComplete="name" required placeholder="Andi Pratama" />
                  </Field>
                  <Field label={t("contact.email")} htmlFor="c-email">
                    <Input
                      id="c-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="nama@email.com"
                    />
                  </Field>
                </div>
                <Field label={t("contact.message")} htmlFor="c-message">
                  <Textarea id="c-message" name="message" required rows={6} placeholder="…" />
                </Field>
                <Button type="submit" size="lg" loading={sending} className="w-full sm:w-auto">
                  <PaperPlaneTilt size={18} weight="bold" />
                  {t("contact.send")}
                </Button>
              </div>
            </form>

            {/* Channels */}
            <aside className="flex flex-col gap-4">
              {channels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <a
                    key={ch.label}
                    href={ch.href}
                    target={ch.href.startsWith("http") ? "_blank" : undefined}
                    rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="card group flex items-center gap-4 p-5 shadow-sm transition-[border-color,box-shadow] duration-150 hover:border-[var(--color-accent)] hover:shadow-md"
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                        ch.accent
                          ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
                          : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                      }`}
                    >
                      <Icon size={24} weight="fill" />
                    </span>
                    <span className="min-w-0">
                      <span className="label-caps block">{ch.label}</span>
                      <span className="tnum mt-0.5 block text-[17px] font-semibold text-[var(--color-ink)]">
                        {ch.value}
                      </span>
                    </span>
                  </a>
                );
              })}

              {/* Address */}
              <div className="card p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-canvas-soft)] text-[var(--color-ink)]">
                    <MapPin size={24} weight="fill" />
                  </span>
                  <div>
                    <span className="label-caps block">{CHANNEL_LABEL[locale].address}</span>
                    <p className="mt-0.5 text-[15px] text-[var(--color-body)]">{ADDRESS[locale]}</p>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="relative mt-4 flex h-40 items-center justify-center overflow-hidden rounded-[12px] bg-[var(--color-surface-dark)]">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                      background:
                        "radial-gradient(circle at 60% 40%, var(--color-accent) 0%, transparent 55%)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage:
                        "linear-gradient(var(--color-on-dark) 1px, transparent 1px), linear-gradient(90deg, var(--color-on-dark) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  <span className="relative inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--color-on-dark)]">
                    <NavigationArrow size={18} weight="fill" className="text-[var(--color-accent)]" />
                    {CHANNEL_LABEL[locale].mapHint}
                  </span>
                </div>
              </div>

              {/* Hours */}
              <div className="card flex items-center gap-4 bg-[var(--color-surface-dark)] p-5">
                <Clock size={24} weight="duotone" className="shrink-0 text-[var(--color-accent)]" />
                <p className="text-[15px] text-[var(--color-on-dark)]">{t("contact.hours")}</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
