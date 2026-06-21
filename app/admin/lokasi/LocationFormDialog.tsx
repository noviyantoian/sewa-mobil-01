"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { useT } from "@/lib/i18n/I18nProvider";
import type { LocationRow } from "@/lib/repo";
import { createLocationAction, updateLocationAction } from "./actions";

const TYPES = ["office", "airport", "hotel", "other"] as const;

export function LocationFormDialog({
  open,
  location,
  onClose,
}: {
  open: boolean;
  location: LocationRow | null;
  onClose: () => void;
}) {
  const t = useT();
  const router = useRouter();
  const [city, setCity] = useState(location?.city ?? "");
  const [area, setArea] = useState(location?.area ?? "");
  const [type, setType] = useState<string>(location?.type ?? "office");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = { city: city.trim(), area: area.trim(), type };
    const res = location
      ? await updateLocationAction(location.id, payload)
      : await createLocationAction(payload);
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
              {location ? t("admin.locationEdit") : t("admin.addLocation")}
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
            <Field label={t("admin.fCity")} htmlFor="lcity">
              <Input id="lcity" value={city} onChange={(e) => setCity(e.target.value)} required />
            </Field>
            <Field label={t("admin.fArea")} htmlFor="larea">
              <Input id="larea" value={area} onChange={(e) => setArea(e.target.value)} required />
            </Field>
            <Field label={t("admin.fType")} htmlFor="ltype">
              <Select id="ltype" value={type} onChange={(e) => setType(e.target.value)} className="capitalize">
                {TYPES.map((ty) => (
                  <option key={ty} value={ty}>
                    {ty}
                  </option>
                ))}
              </Select>
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
