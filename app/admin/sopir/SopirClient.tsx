"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { Star, SteeringWheel, MapPin, X, Check, UserPlus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CarCell } from "@/components/admin/CarCell";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatDateRange } from "@/lib/format";
import type { AdminBooking, AdminDriver } from "../types";

type Tone = "neutral" | "success" | "accent" | "outline";
const statusTone: Record<AdminDriver["status"], Tone> = {
  idle: "success",
  assigned: "accent",
  off: "neutral",
};
const statusDot: Record<AdminDriver["status"], string> = {
  idle: "var(--color-success)",
  assigned: "var(--color-accent)",
  off: "var(--color-mute-soft)",
};

export function SopirClient({
  drivers,
  bookings,
}: {
  drivers: AdminDriver[];
  bookings: AdminBooking[];
}) {
  const t = useT();
  const assignable = bookings.filter((b) => b.status === "confirmed" && b.mode === "withDriver");
  const [assigned, setAssigned] = useState<Record<string, string>>({});
  const [active, setActive] = useState<AdminBooking | null>(null);

  const idleDrivers = drivers.filter((d) => d.status === "idle");

  const confirm = (booking: AdminBooking, driver: AdminDriver) => {
    setAssigned((prev) => ({ ...prev, [booking.id]: driver.id }));
    setActive(null);
    toast(t("admin.assign"), { description: `${driver.name} · ${booking.id}` });
  };

  return (
    <div className="flex flex-col gap-9">
      <header className="flex flex-col gap-1">
        <span className="eyebrow">
          <SteeringWheel size={15} weight="fill" /> {t("admin.navDrivers")}
        </span>
        <h1 className="display-sm">{t("admin.driversTitle")}</h1>
      </header>

      {/* Bookings awaiting a driver */}
      <section className="flex flex-col gap-4">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-mute)]">
          {t("admin.navBookings")} · {t("status.confirmed")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {assignable.map((b) => {
            const driverId = assigned[b.id];
            const driver = driverId ? drivers.find((d) => d.id === driverId) : undefined;
            return (
              <div key={b.id} className="card shadow-sm flex flex-col gap-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <CarCell car={b.car ?? undefined} />
                  <span className="tnum text-[12px] font-semibold text-[var(--color-mute)]">{b.id}</span>
                </div>
                <div className="tnum text-[13px] text-[var(--color-body-mid)]">
                  {b.customerName} · {formatDateRange(b.pickupAt, b.returnAt)}
                </div>
                {driver ? (
                  <div className="flex items-center gap-2 rounded-[10px] bg-[var(--color-success-soft)] px-3 py-2 text-[13px] font-semibold text-[#0a7a35]">
                    <Check size={15} weight="bold" /> {driver.name}
                  </div>
                ) : (
                  <Button variant="primary" size="sm" className="self-start" onClick={() => setActive(b)}>
                    <UserPlus size={16} weight="bold" /> {t("admin.assign")}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Driver roster */}
      <section className="flex flex-col gap-4">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-mute)]">
          {t("admin.navDrivers")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {drivers.map((d) => (
            <DriverCard key={d.id} driver={d} />
          ))}
        </div>
      </section>

      <Dialog.Root open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[14px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Dialog.Title className="text-[19px] font-bold tracking-[-0.01em] text-[var(--color-ink)]">
                  {t("admin.assign")}
                </Dialog.Title>
                {active && (
                  <Dialog.Description className="tnum mt-0.5 text-[13px] text-[var(--color-mute)]">
                    {active.id} · {active.customerName}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-mute)] hover:bg-[var(--color-canvas-soft)] hover:text-[var(--color-ink)]"
                  aria-label={t("common.back")}
                >
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>

            <ul className="flex flex-col gap-2">
              {idleDrivers.length === 0 && (
                <li className="py-6 text-center text-[14px] text-[var(--color-mute)]">{t("common.loading")}</li>
              )}
              {idleDrivers.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => active && confirm(active, d)}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-[var(--color-hairline)] px-4 py-3 text-left transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
                  >
                    <div>
                      <div className="font-semibold text-[var(--color-ink)]">{d.name}</div>
                      <div className="inline-flex items-center gap-2 text-[12px] text-[var(--color-mute)]">
                        <span className="inline-flex items-center gap-0.5">
                          <Star size={12} weight="fill" className="text-[#ffb01f]" />
                          <span className="tnum">{d.rating.toFixed(2)}</span>
                        </span>
                        · {d.city}
                      </div>
                    </div>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
                      <Check size={16} weight="bold" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function DriverCard({ driver }: { driver: AdminDriver }) {
  const t = useT();
  return (
    <div className="card shadow-sm flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-canvas-soft)] text-[var(--color-body-mid)]">
            <SteeringWheel size={20} />
          </span>
          <div>
            <div className="font-bold text-[var(--color-ink)]">{driver.name}</div>
            <div className="text-[12px] text-[var(--color-mute)]">{driver.city}</div>
          </div>
        </div>
        <Badge tone={statusTone[driver.status]} dot={statusDot[driver.status]}>
          <span className="capitalize">{driver.status}</span>
        </Badge>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-hairline)] pt-3 text-[13px]">
        <span className="inline-flex items-center gap-1.5 text-[var(--color-body)]">
          <Star size={14} weight="fill" className="text-[#ffb01f]" />
          <span className="tnum font-semibold">{driver.rating.toFixed(2)}</span>
        </span>
        <span className="tnum text-[var(--color-mute)]">
          {driver.experienceYears} {t("admin.exp")}
        </span>
        <span className="inline-flex items-center gap-1 text-[var(--color-mute)]">
          <MapPin size={13} /> {driver.city}
        </span>
      </div>
    </div>
  );
}
