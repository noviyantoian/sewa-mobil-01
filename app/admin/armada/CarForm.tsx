"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, X, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { selectClass } from "@/components/admin/formStyles";
import { useT } from "@/lib/i18n/I18nProvider";
import { createCarAction, updateCarAction } from "./actions";

const CATEGORIES = ["mpv", "suv", "citycar", "premium", "ev"] as const;
const TRANSMISSIONS = ["auto", "manual"] as const;

export interface CarFormState {
  slug: string;
  name: string;
  brand: string;
  category: string;
  color: string;
  capacity: string;
  transmission: string;
  fuel: string;
  year: string;
  rateSelfDrive: string;
  rateWithDriver: string;
  deposit: string;
  available: boolean;
  features: string[];
  doors: string;
  luggage: string;
  plate: string;
  exterior: string;
  side: string;
  interior: string;
}

export function emptyCarForm(): CarFormState {
  return {
    slug: "",
    name: "",
    brand: "",
    category: "mpv",
    color: "",
    capacity: "5",
    transmission: "auto",
    fuel: "",
    year: "",
    rateSelfDrive: "",
    rateWithDriver: "",
    deposit: "",
    available: true,
    features: [],
    doors: "",
    luggage: "",
    plate: "",
    exterior: "",
    side: "",
    interior: "",
  };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card shadow-sm">
      <h2 className="mb-4 text-[15px] font-bold uppercase tracking-[0.08em] text-[var(--color-mute)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CarForm({
  carId,
  initial,
}: {
  carId?: string;
  initial?: CarFormState;
}) {
  const t = useT();
  const router = useRouter();
  const [f, setF] = useState<CarFormState>(() => initial ?? emptyCarForm());
  const [featInput, setFeatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const text =
    (k: keyof CarFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  const setImg = (k: "exterior" | "side" | "interior") => (url: string) =>
    setF((p) => ({ ...p, [k]: url }));

  const addFeature = () => {
    const v = featInput.trim();
    setFeatInput("");
    if (!v || f.features.includes(v)) return;
    setF((p) => ({ ...p, features: [...p.features, v] }));
  };
  const removeFeature = (v: string) =>
    setF((p) => ({ ...p, features: p.features.filter((x) => x !== v) }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      slug: f.slug.trim(),
      name: f.name.trim(),
      brand: f.brand.trim(),
      category: f.category,
      color: f.color.trim() || undefined,
      capacity: Number(f.capacity),
      transmission: f.transmission,
      fuel: f.fuel.trim() || undefined,
      year: f.year ? Number(f.year) : undefined,
      rateSelfDrive: Number(f.rateSelfDrive),
      rateWithDriver: Number(f.rateWithDriver),
      deposit: Number(f.deposit),
      available: f.available,
      features: f.features,
      doors: f.doors ? Number(f.doors) : null,
      luggage: f.luggage ? Number(f.luggage) : null,
      plate: f.plate.trim() || undefined,
      images: {
        exterior: f.exterior.trim() || undefined,
        side: f.side.trim() || undefined,
        interior: f.interior.trim() || undefined,
      },
    };
    const res = carId
      ? await updateCarAction(carId, payload)
      : await createCarAction(payload);
    if (res.ok) {
      toast.success(t("admin.saved"));
      router.push("/admin/armada");
      router.refresh();
      return;
    }
    setLoading(false);
    setError(
      res.error === "slug_taken" ? t("admin.errSlugTaken") : t("admin.errFailed"),
    );
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/admin/armada"
            className="inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--color-mute)] hover:text-[var(--color-ink)]"
          >
            <ArrowLeft size={15} weight="bold" />
            {t("admin.backToFleet")}
          </Link>
          <h1 className="display-sm">
            {carId ? `${f.brand} ${f.name}`.trim() || t("admin.carEdit") : t("admin.addCar")}
          </h1>
        </div>
        <div className="flex gap-2.5">
          <Button type="button" variant="secondary" onClick={() => router.push("/admin/armada")}>
            {t("admin.cancel")}
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {t("admin.save")}
          </Button>
        </div>
      </header>

      <Section title={t("admin.carInfoSection")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("admin.fName")} htmlFor="name">
            <Input id="name" value={f.name} onChange={text("name")} required />
          </Field>
          <Field label={t("admin.fSlug")} htmlFor="slug">
            <Input id="slug" value={f.slug} onChange={text("slug")} required placeholder="avanza-silver" />
          </Field>
          <Field label={t("admin.fBrand")} htmlFor="brand">
            <Input id="brand" value={f.brand} onChange={text("brand")} required />
          </Field>
          <Field label={t("admin.fCategory")} htmlFor="category">
            <select id="category" value={f.category} onChange={text("category")} className={selectClass}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.toUpperCase()}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title={t("admin.carSpecsSection")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label={t("admin.fCapacity")} htmlFor="capacity">
            <Input id="capacity" type="number" min={1} value={f.capacity} onChange={text("capacity")} required />
          </Field>
          <Field label={t("admin.fTransmission")} htmlFor="transmission">
            <select id="transmission" value={f.transmission} onChange={text("transmission")} className={selectClass}>
              {TRANSMISSIONS.map((tr) => (
                <option key={tr} value={tr}>
                  {tr === "auto" ? t("common.auto") : t("common.manual")}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("admin.fFuel")} htmlFor="fuel">
            <Input id="fuel" value={f.fuel} onChange={text("fuel")} placeholder={t("admin.fFuelPlaceholder")} />
          </Field>
          <Field label={t("admin.fYear")} htmlFor="year">
            <Input id="year" type="number" min={1990} value={f.year} onChange={text("year")} />
          </Field>
          <Field label={t("admin.fColor")} htmlFor="color">
            <Input id="color" value={f.color} onChange={text("color")} />
          </Field>
          <Field label={t("admin.fPlate")} htmlFor="plate">
            <Input id="plate" value={f.plate} onChange={text("plate")} placeholder={t("admin.fPlatePlaceholder")} />
          </Field>
          <Field label={t("admin.fDoors")} htmlFor="doors">
            <Input id="doors" type="number" min={0} value={f.doors} onChange={text("doors")} />
          </Field>
          <Field label={t("admin.fLuggage")} htmlFor="luggage">
            <Input id="luggage" type="number" min={0} value={f.luggage} onChange={text("luggage")} />
          </Field>
        </div>

        <div className="mt-4">
          <span className="mb-1.5 block text-[13px] font-semibold text-[var(--color-body)]">
            {t("admin.fFeatures")}
          </span>
          <div className="flex gap-2">
            <Input
              value={featInput}
              onChange={(e) => setFeatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              placeholder={t("admin.fFeaturesAdd")}
            />
            <Button type="button" variant="secondary" onClick={addFeature} aria-label={t("admin.fFeaturesAdd")}>
              <Plus size={16} weight="bold" />
            </Button>
          </div>
          {f.features.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {f.features.map((feat) => (
                <span
                  key={feat}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-canvas-soft)] py-1 pl-3 pr-1.5 text-[13px] text-[var(--color-body)]"
                >
                  {feat}
                  <button
                    type="button"
                    onClick={() => removeFeature(feat)}
                    aria-label={`${t("admin.imgRemove")} ${feat}`}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[var(--color-mute)] hover:bg-[var(--color-hairline)] hover:text-[var(--color-ink)]"
                  >
                    <X size={13} weight="bold" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section title={t("admin.carRatesSection")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label={t("admin.fRateSelf")} htmlFor="rateSelf">
            <Input id="rateSelf" type="number" min={0} value={f.rateSelfDrive} onChange={text("rateSelfDrive")} required />
          </Field>
          <Field label={t("admin.fRateDriver")} htmlFor="rateDriver">
            <Input id="rateDriver" type="number" min={0} value={f.rateWithDriver} onChange={text("rateWithDriver")} required />
          </Field>
          <Field label={t("admin.fDeposit")} htmlFor="deposit">
            <Input id="deposit" type="number" min={0} value={f.deposit} onChange={text("deposit")} required />
          </Field>
        </div>
      </Section>

      <Section title={t("admin.carPhotosSection")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <span className="mb-1.5 block text-[13px] font-semibold text-[var(--color-body)]">{t("admin.fImgExterior")}</span>
            <ImageUpload value={f.exterior} onChange={setImg("exterior")} />
          </div>
          <div>
            <span className="mb-1.5 block text-[13px] font-semibold text-[var(--color-body)]">{t("admin.fImgSide")}</span>
            <ImageUpload value={f.side} onChange={setImg("side")} />
          </div>
          <div>
            <span className="mb-1.5 block text-[13px] font-semibold text-[var(--color-body)]">{t("admin.fImgInterior")}</span>
            <ImageUpload value={f.interior} onChange={setImg("interior")} />
          </div>
        </div>
      </Section>

      <Section title={t("admin.carStatusSection")}>
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={f.available}
            onChange={(e) => setF((p) => ({ ...p, available: e.target.checked }))}
            className="h-4 w-4 cursor-pointer accent-[var(--color-accent)]"
          />
          <span className="text-[14px] text-[var(--color-body)]">{t("admin.fAvailable")}</span>
        </label>
      </Section>

      {error && (
        <p className="rounded-[10px] bg-[var(--color-error-soft)] px-3 py-2 text-[13px] font-semibold text-[var(--color-error)]">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2.5">
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/armada")}>
          {t("admin.cancel")}
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {t("admin.save")}
        </Button>
      </div>
    </form>
  );
}
