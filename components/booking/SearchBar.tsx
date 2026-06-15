"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, CalendarBlank, MagnifyingGlass, SteeringWheel, UserCircle, Storefront, Truck } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { locations } from "@/lib/mock/locations";
import { cn } from "@/lib/format";

type Mode = "selfDrive" | "withDriver";
type Pickup = "self" | "deliver";

function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const cities = Array.from(new Set(locations.map((l) => l.city))).map((c) => ({
  id: c.toLowerCase(),
  label: c,
}));

const isCityId = (id: string) => cities.some((c) => c.id === id);
const isBranchId = (id: string) => locations.some((l) => l.id === id);

export function SearchBar({
  variant = "hero",
  initial,
}: {
  variant?: "hero" | "compact";
  initial?: { mode?: Mode; loc?: string; from?: string; to?: string; pickup?: Pickup };
}) {
  const t = useT();
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [mode, setMode] = useState<Mode>(initial?.mode ?? "selfDrive");
  const [pickup, setPickup] = useState<Pickup>(initial?.pickup ?? "self");
  const [loc, setLoc] = useState(initial?.loc ?? locations[0].id);
  const [from, setFrom] = useState(initial?.from ?? addDays(1));
  const [to, setTo] = useState(initial?.to ?? addDays(4));

  const choosePickup = (p: Pickup) => {
    setPickup(p);
    if (p === "deliver" && !isCityId(loc)) setLoc(cities[0].id);
    if (p === "self" && !isBranchId(loc)) setLoc(locations[0].id);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams({ mode, pickup, loc, from, to });
    router.push(`/cari?${q.toString()}`);
  };

  const compact = variant === "compact";

  return (
    <form
      onSubmit={submit}
      className={cn("card overflow-hidden", compact ? "shadow-sm" : "shadow-xl")}
    >
      <div className="flex flex-col gap-2.5 border-b border-[var(--color-hairline)] bg-[var(--color-canvas-soft)] p-2.5 sm:flex-row sm:gap-3">
        <div className="min-w-0 flex-1">
          <span className="label-caps mb-1 block px-0.5">{t("hero.groupMode")}</span>
          <div role="tablist" aria-label={t("hero.groupMode")} className="flex gap-1 rounded-[10px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-1">
            {([
              { m: "selfDrive" as Mode, icon: SteeringWheel, label: t("hero.modeSelfDrive") },
              { m: "withDriver" as Mode, icon: UserCircle, label: t("hero.modeWithDriver") },
            ]).map(({ m, icon: Icon, label }) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-pressed={active}
                  onClick={() => setMode(m)}
                  className={cn(
                    "inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[7px] py-2 text-[13px] font-semibold transition-colors",
                    active
                      ? "bg-[var(--color-ink)] text-white"
                      : "text-[var(--color-body-mid)] hover:text-[var(--color-ink)]"
                  )}
                >
                  <Icon size={15} weight={active ? "fill" : "regular"} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <span className="label-caps mb-1 block px-0.5">{t("hero.groupPickup")}</span>
          <div role="radiogroup" aria-label={t("hero.groupPickup")} className="flex gap-1 rounded-[10px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-1">
            {([
              { p: "self" as Pickup, icon: Storefront, label: t("hero.pickupSelf") },
              { p: "deliver" as Pickup, icon: Truck, label: t("hero.pickupDeliver") },
            ]).map(({ p, icon: Icon, label }) => {
              const active = pickup === p;
              return (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-pressed={active}
                  onClick={() => choosePickup(p)}
                  className={cn(
                    "inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[7px] py-2 text-[13px] font-semibold transition-colors",
                    active
                      ? "bg-[var(--color-ink)] text-white"
                      : "text-[var(--color-body-mid)] hover:text-[var(--color-ink)]"
                  )}
                >
                  <Icon size={15} weight={active ? "fill" : "regular"} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={cn("grid gap-px bg-[var(--color-hairline)]", compact ? "md:grid-cols-[1.4fr_1fr_1fr_auto]" : "md:grid-cols-3")}>
        <FieldCell
          icon={<MapPin size={18} />}
          label={pickup === "deliver" ? t("hero.labelDeliver") : t("hero.labelLocation")}
        >
          <select
            value={loc}
            onChange={(e) => setLoc(e.target.value)}
            aria-label={pickup === "deliver" ? t("hero.labelDeliver") : t("hero.labelLocation")}
            className="w-full cursor-pointer bg-transparent text-[15px] font-semibold text-[var(--color-ink)] outline-none"
          >
            {pickup === "deliver"
              ? cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))
              : locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.city} — {l.area}
                  </option>
                ))}
          </select>
        </FieldCell>

        <FieldCell icon={<CalendarBlank size={18} />} label={t("hero.labelPickup")}>
          <input
            type="date"
            value={from}
            min={today}
            onChange={(e) => {
              setFrom(e.target.value);
              if (e.target.value >= to) {
                const next = new Date(e.target.value);
                next.setDate(next.getDate() + 1);
                setTo(next.toISOString().slice(0, 10));
              }
            }}
            aria-label={t("hero.labelPickup")}
            className="w-full cursor-pointer bg-transparent text-[15px] font-semibold text-[var(--color-ink)] outline-none"
          />
        </FieldCell>

        <FieldCell icon={<CalendarBlank size={18} />} label={t("hero.labelReturn")}>
          <input
            type="date"
            value={to}
            min={from}
            onChange={(e) => setTo(e.target.value)}
            aria-label={t("hero.labelReturn")}
            className="w-full cursor-pointer bg-transparent text-[15px] font-semibold text-[var(--color-ink)] outline-none"
          />
        </FieldCell>

        {compact && (
          <div className="flex items-stretch bg-[var(--color-canvas)] p-2">
            <Button type="submit" variant="primary" size="lg" className="w-full md:w-auto" aria-label={t("hero.cta")}>
              <MagnifyingGlass size={18} weight="bold" />
              <span className="md:hidden lg:inline">{t("hero.cta")}</span>
            </Button>
          </div>
        )}
      </div>

      {pickup === "deliver" && (
        <p className="bg-[var(--color-canvas)] px-5 pb-3 pt-0.5 text-[12px] text-[var(--color-mute)]">
          {t("hero.deliverHint")}
        </p>
      )}

      {!compact && (
        <div className="bg-[var(--color-canvas)] p-2">
          <Button type="submit" variant="primary" size="xl" className="w-full">
            <MagnifyingGlass size={20} weight="bold" />
            {t("hero.cta")}
          </Button>
        </div>
      )}
    </form>
  );
}

function FieldCell({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-w-0 items-center gap-3 bg-[var(--color-canvas)] px-5 py-3.5 transition-colors focus-within:bg-[var(--color-accent-soft)]/40">
      <span className="shrink-0 text-[var(--color-accent)]" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="label-caps mb-0.5 block">{label}</span>
        {children}
      </span>
    </label>
  );
}
