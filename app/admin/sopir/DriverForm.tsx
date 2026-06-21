"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { useT } from "@/lib/i18n/I18nProvider";
import { createDriverAction, updateDriverAction } from "./actions";

const STATUSES = ["idle", "assigned", "off"] as const;

export interface DriverFormState {
  name: string;
  experienceYears: string;
  rating: string;
  city: string;
  status: string;
}

export function emptyDriverForm(): DriverFormState {
  return { name: "", experienceYears: "0", rating: "5", city: "", status: "idle" };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card shadow-sm p-6">
      <h2 className="mb-4 text-[15px] font-bold uppercase tracking-[0.08em] text-[var(--color-mute)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function DriverForm({
  driverId,
  initial,
}: {
  driverId?: string;
  initial?: DriverFormState;
}) {
  const t = useT();
  const router = useRouter();
  const [f, setF] = useState<DriverFormState>(() => initial ?? emptyDriverForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (k: keyof DriverFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      name: f.name.trim(),
      experienceYears: Number(f.experienceYears),
      rating: Number(f.rating),
      city: f.city.trim() || undefined,
      status: f.status,
    };
    const res = driverId
      ? await updateDriverAction(driverId, payload)
      : await createDriverAction(payload);
    if (res.ok) {
      toast.success(t("admin.saved"));
      router.push("/admin/sopir");
      router.refresh();
      return;
    }
    setLoading(false);
    setError(t("admin.errFailed"));
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/admin/sopir"
            className="inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--color-mute)] hover:text-[var(--color-ink)]"
          >
            <ArrowLeft size={15} weight="bold" />
            {t("admin.backToDrivers")}
          </Link>
          <h1 className="display-sm">
            {driverId ? f.name || t("admin.driverEdit") : t("admin.addDriver")}
          </h1>
        </div>
        <div className="flex gap-2.5">
          <Button type="button" variant="secondary" onClick={() => router.push("/admin/sopir")}>
            {t("admin.cancel")}
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {t("admin.save")}
          </Button>
        </div>
      </header>

      <Section title={t("admin.driverInfoSection")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("admin.fName")} htmlFor="dname">
            <Input id="dname" value={f.name} onChange={set("name")} required />
          </Field>
          <Field label={t("admin.fCity")} htmlFor="dcity">
            <Input id="dcity" value={f.city} onChange={set("city")} />
          </Field>
          <Field label={t("admin.fExperience")} htmlFor="dexp">
            <Input id="dexp" type="number" min={0} value={f.experienceYears} onChange={set("experienceYears")} required />
          </Field>
          <Field label={t("admin.fRating")} htmlFor="drating">
            <Input id="drating" type="number" min={0} max={5} step="0.01" value={f.rating} onChange={set("rating")} required />
          </Field>
          <Field label={t("admin.fStatus")} htmlFor="dstatus">
            <Select id="dstatus" value={f.status} onChange={set("status")} className="capitalize">
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Section>

      {error && (
        <p className="rounded-[10px] bg-[var(--color-error-soft)] px-3 py-2 text-[13px] font-semibold text-[var(--color-error)]">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2.5">
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/sopir")}>
          {t("admin.cancel")}
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {t("admin.save")}
        </Button>
      </div>
    </form>
  );
}
