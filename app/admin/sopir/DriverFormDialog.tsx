"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { useT } from "@/lib/i18n/I18nProvider";
import type { AdminDriver } from "../types";
import { createDriverAction, updateDriverAction } from "./actions";

const STATUSES = ["idle", "assigned", "off"] as const;

const selectClass =
  "w-full cursor-pointer appearance-none rounded-[10px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-3 py-2.5 text-[14px] capitalize text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-accent)]";

export function DriverFormDialog({
  open,
  driver,
  onClose,
}: {
  open: boolean;
  driver: AdminDriver | null;
  onClose: () => void;
}) {
  const t = useT();
  const router = useRouter();
  const [name, setName] = useState(driver?.name ?? "");
  const [exp, setExp] = useState(driver ? String(driver.experienceYears) : "0");
  const [rating, setRating] = useState(driver ? String(driver.rating) : "5");
  const [city, setCity] = useState(driver?.city ?? "");
  const [status, setStatus] = useState<string>(driver?.status ?? "idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      name: name.trim(),
      experienceYears: Number(exp),
      rating: Number(rating),
      city: city.trim() || undefined,
      status,
    };
    const res = driver
      ? await updateDriverAction(driver.id, payload)
      : await createDriverAction(payload);
    if (res.ok) {
      toast.success(t("admin.saved"));
      onClose();
      router.refresh();
      return;
    }
    setLoading(false);
    setError(t("admin.errFailed"));
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-6 py-4">
            <Dialog.Title className="text-[19px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
              {driver ? t("admin.driverEdit") : t("admin.addDriver")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t("admin.cancel")}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-mute)] hover:bg-[var(--color-canvas-soft)] hover:text-[var(--color-ink)]"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4 px-6 py-5">
            <Field label={t("admin.fName")} htmlFor="dname">
              <Input id="dname" value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t("admin.fExperience")} htmlFor="dexp">
                <Input id="dexp" type="number" min={0} value={exp} onChange={(e) => setExp(e.target.value)} required />
              </Field>
              <Field label={t("admin.fRating")} htmlFor="drating">
                <Input id="drating" type="number" min={0} max={5} step="0.01" value={rating} onChange={(e) => setRating(e.target.value)} required />
              </Field>
            </div>
            <Field label={t("admin.fCity")} htmlFor="dcity">
              <Input id="dcity" value={city} onChange={(e) => setCity(e.target.value)} />
            </Field>
            <Field label={t("admin.fStatus")} htmlFor="dstatus">
              <select id="dstatus" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            {error && (
              <p className="rounded-[10px] bg-[var(--color-error-soft)] px-3 py-2 text-[13px] font-semibold text-[var(--color-error)]">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2.5 border-t border-[var(--color-hairline)] pt-4">
              <Dialog.Close asChild>
                <Button type="button" variant="secondary" size="md">
                  {t("admin.cancel")}
                </Button>
              </Dialog.Close>
              <Button type="submit" variant="primary" size="md" loading={loading}>
                {t("admin.save")}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
