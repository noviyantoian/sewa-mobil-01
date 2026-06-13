"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/lib/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { Select, Label, Input } from "@/components/ui/Input";
import { locations } from "@/lib/mock/locations";

export function Hero() {
  const t = useT();
  const router = useRouter();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const after2 = new Date();
  after2.setDate(today.getDate() + 3);

  const [mode, setMode] = useState<"selfDrive" | "withDriver">("selfDrive");
  const [location, setLocation] = useState(locations[0].id);
  const [pickup, setPickup] = useState(tomorrow.toISOString().slice(0, 10));
  const [ret, setRet] = useState(after2.toISOString().slice(0, 10));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams({ mode, loc: location, from: pickup, to: ret });
    router.push(`/cari?${q.toString()}`);
  };

  return (
    <section className="relative bg-[var(--color-surface-dark)] text-[var(--color-on-dark)] overflow-hidden">
      <Image
        src="/images/hero-main.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-dark)] via-[var(--color-surface-dark)]/70 to-transparent" />
      <div className="container-folka relative py-20 md:py-32">
        <div className="max-w-2xl">
          <div className="label-uppercase text-[var(--color-on-dark-soft)] mb-6">
            {t("hero.eyebrow")}
          </div>
          <h1 className="text-[40px] md:text-[64px] font-bold leading-[1.05] mb-6 text-[var(--color-on-dark)]">
            {t("hero.title")}
          </h1>
          <p className="text-[16px] md:text-[18px] leading-relaxed text-[var(--color-on-dark-soft)] max-w-xl mb-10">
            {t("hero.subtitle")}
          </p>

          <form
            onSubmit={onSubmit}
            className="bg-[var(--color-canvas)] text-[var(--color-ink)] p-6 md:p-8"
          >
            <div role="tablist" className="flex border-b border-[var(--color-hairline)] mb-6">
              {(["selfDrive", "withDriver"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={
                    mode === m
                      ? "px-4 py-3 text-[13px] font-bold uppercase tracking-[1.5px] border-b-2 border-[var(--color-ink)]"
                      : "px-4 py-3 text-[13px] font-bold uppercase tracking-[1.5px] text-[var(--color-muted)] border-b-2 border-transparent hover:text-[var(--color-ink)]"
                  }
                >
                  {m === "selfDrive" ? t("hero.modeSelfDrive") : t("hero.modeWithDriver")}
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <Label htmlFor="loc">{t("hero.labelLocation")}</Label>
                <Select id="loc" value={location} onChange={(e) => setLocation(e.target.value)}>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.city} - {l.area}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="pickup">{t("hero.labelPickup")}</Label>
                <Input id="pickup" type="date" value={pickup} onChange={(e) => setPickup(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="ret">{t("hero.labelReturn")}</Label>
                <Input id="ret" type="date" value={ret} onChange={(e) => setRet(e.target.value)} />
              </div>
            </div>

            <div className="mt-6">
              <Button type="submit" variant="primary" size="lg" className="w-full md:w-auto">
                {t("hero.cta")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
