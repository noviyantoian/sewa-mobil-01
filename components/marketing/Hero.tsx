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
    <section className="bg-[var(--color-canvas)] pt-12 md:pt-20 pb-20 md:pb-32">
      <div className="container-folka grid gap-12 lg:gap-16 lg:grid-cols-12 items-start">
        {/* Left: copy + form */}
        <div className="lg:col-span-7">
          <div className="eyebrow text-[var(--color-mute)] mb-6">
            {t("hero.eyebrow")}
          </div>
          <h1 className="mb-6">
            {t("hero.title")}
          </h1>
          <p className="body-lg text-[var(--color-body)] max-w-2xl mb-10 md:mb-12">
            {t("hero.subtitle")}
          </p>

          <form
            onSubmit={onSubmit}
            className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[8px] p-5 md:p-6 shadow-level-2 max-w-2xl"
          >
            <div role="tablist" className="flex gap-1 mb-5">
              {(["selfDrive", "withDriver"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={
                    mode === m
                      ? "px-4 py-2 text-[14px] font-medium rounded-[4px] bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                      : "px-4 py-2 text-[14px] font-medium rounded-[4px] text-[var(--color-body)] hover:bg-[var(--color-canvas-soft)]"
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

            <div className="mt-5">
              <Button type="submit" variant="primary" size="lg" className="w-full md:w-auto">
                {t("hero.cta")}
              </Button>
            </div>
          </form>
        </div>

        {/* Right: photo card */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-[12px] overflow-hidden shadow-level-3 bg-[var(--color-canvas-soft)]">
            <Image
              src="/images/hero-mobile.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            {/* Accent chip overlay */}
            <div className="absolute top-5 left-5 inline-flex items-center gap-2 bg-[var(--color-canvas)]/95 backdrop-blur px-3 py-2 rounded-[4px]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-green)]" aria-hidden />
              <span className="text-[12px] font-medium tracking-[0.6px] uppercase text-[var(--color-ink)]">
                {t("hero.modeSelfDrive")} · {t("hero.modeWithDriver")}
              </span>
            </div>
          </div>
          {/* Small floating stat card */}
          <div className="hidden md:block absolute -bottom-6 -left-6 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[8px] p-4 shadow-level-2 max-w-[200px]">
            <div className="eyebrow-sm text-[var(--color-mute)] mb-1">Armada</div>
            <div className="text-[24px] font-semibold leading-none">10 mobil</div>
            <div className="text-[13px] text-[var(--color-body-mid)] mt-1">Jakarta · Bandung · Bali</div>
          </div>
        </div>
      </div>
    </section>
  );
}
