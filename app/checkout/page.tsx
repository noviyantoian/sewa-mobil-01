"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR, daysBetween } from "@/lib/format";
import { getCarBySlug } from "@/lib/mock/cars";
import { locations } from "@/lib/mock/locations";

type Step = 1 | 2 | 3 | 4;

export default function CheckoutPage() {
  const params = useSearchParams();
  const router = useRouter();
  const t = useT();
  const car = getCarBySlug(params.get("car") ?? "innova-zenix");
  const mode = (params.get("mode") as "selfDrive" | "withDriver") ?? "selfDrive";

  const [step, setStep] = useState<Step>(1);
  const [pickupLoc, setPickupLoc] = useState(locations[0].id);
  const [returnLoc, setReturnLoc] = useState(locations[0].id);
  const today = new Date();
  const def1 = new Date(); def1.setDate(today.getDate() + 1);
  const def2 = new Date(); def2.setDate(today.getDate() + 3);
  const [pickupAt, setPickupAt] = useState(def1.toISOString().slice(0, 16));
  const [returnAt, setReturnAt] = useState(def2.toISOString().slice(0, 16));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ktp, setKtp] = useState<File | null>(null);
  const [sim, setSim] = useState<File | null>(null);
  const [payMethod, setPayMethod] = useState<"qris" | "va" | "ewallet" | "card">("qris");
  const [agree, setAgree] = useState(false);

  const [holdSec, setHoldSec] = useState(15 * 60);
  useEffect(() => {
    if (holdSec <= 0) return;
    const id = setInterval(() => setHoldSec((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [holdSec]);

  if (!car) {
    return (
      <>
        <Header />
        <main className="container-folka py-32 text-center">
          <p>Mobil tidak ditemukan.</p>
        </main>
        <Footer />
      </>
    );
  }

  const days = daysBetween(pickupAt, returnAt);
  const subtotal = (mode === "withDriver" ? car.rateWithDriver : car.rateSelfDrive) * days;
  const total = subtotal;

  const mins = String(Math.floor(holdSec / 60)).padStart(2, "0");
  const secs = String(holdSec % 60).padStart(2, "0");

  const next = () => setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  const submit = () => {
    const id = `FK-26-${Math.floor(1000 + Math.random() * 9000)}`;
    router.push(`/konfirmasi/${id}`);
  };

  const steps: Array<{ n: Step; key: "stepDate" | "stepIdentity" | "stepPayment" | "stepDone" }> = [
    { n: 1, key: "stepDate" },
    { n: 2, key: "stepIdentity" },
    { n: 3, key: "stepPayment" },
    { n: 4, key: "stepDone" },
  ];

  return (
    <>
      <Header />
      <main className="bg-[var(--color-canvas)] py-10 md:py-16">
        <div className="container-folka">
          <ol className="flex items-center mb-10 overflow-x-auto">
            {steps.map((s, i) => (
              <li key={s.n} className="flex items-center flex-shrink-0">
                <div
                  className={
                    s.n <= step
                      ? "w-8 h-8 bg-[var(--color-primary)] text-[var(--color-on-primary)] flex items-center justify-center text-[13px] font-bold"
                      : "w-8 h-8 bg-[var(--color-surface-card)] text-[var(--color-muted)] border border-[var(--color-hairline)] flex items-center justify-center text-[13px] font-bold"
                  }
                >
                  {s.n}
                </div>
                <span
                  className={
                    s.n === step
                      ? "ml-3 text-[13px] font-bold uppercase tracking-[1.5px] text-[var(--color-ink)]"
                      : "ml-3 text-[13px] font-bold uppercase tracking-[1.5px] text-[var(--color-muted)] hidden md:inline"
                  }
                >
                  {t(`checkout.${s.key}`)}
                </span>
                {i < steps.length - 1 && (
                  <div className="w-8 md:w-16 h-px bg-[var(--color-hairline)] mx-3" />
                )}
              </li>
            ))}
          </ol>

          <div className="mb-8 p-3 bg-[var(--color-surface-soft)] text-[13px] text-[var(--color-body)] flex items-center justify-between">
            <span>
              {holdSec > 0
                ? t("checkout.holdTimer", { minutes: mins, seconds: secs })
                : t("checkout.holdExpired")}
            </span>
          </div>

          <div className="grid gap-10 md:grid-cols-12">
            <section className="md:col-span-7 lg:col-span-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="pl">{t("checkout.pickupLocation")}</Label>
                      <Select id="pl" value={pickupLoc} onChange={(e) => setPickupLoc(e.target.value)}>
                        {locations.map((l) => (
                          <option key={l.id} value={l.id}>{l.city} - {l.area}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="rl">{t("checkout.returnLocation")}</Label>
                      <Select id="rl" value={returnLoc} onChange={(e) => setReturnLoc(e.target.value)}>
                        {locations.map((l) => (
                          <option key={l.id} value={l.id}>{l.city} - {l.area}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pa">{t("checkout.pickupDate")}</Label>
                      <Input id="pa" type="datetime-local" value={pickupAt} onChange={(e) => setPickupAt(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="ra">{t("checkout.returnDate")}</Label>
                      <Input id="ra" type="datetime-local" value={returnAt} onChange={(e) => setReturnAt(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Label htmlFor="n">{t("checkout.identityName")}</Label>
                      <Input id="n" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Lengkap" />
                    </div>
                    <div>
                      <Label htmlFor="em">{t("checkout.identityEmail")}</Label>
                      <Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@domain.com" />
                    </div>
                    <div>
                      <Label htmlFor="ph">{t("checkout.identityPhone")}</Label>
                      <Input id="ph" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xx-xxxx-xxxx" />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 mt-6">
                    <div>
                      <Label htmlFor="ktp">{t("checkout.identityKtp")}</Label>
                      <Input id="ktp" type="file" accept="image/*" onChange={(e) => setKtp(e.target.files?.[0] ?? null)} />
                      <p className="text-[12px] text-[var(--color-muted)] mt-2">
                        {ktp ? ktp.name : t("checkout.identityUploadHint")}
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="sim">{t("checkout.identitySim")}</Label>
                      <Input id="sim" type="file" accept="image/*" onChange={(e) => setSim(e.target.files?.[0] ?? null)} />
                      <p className="text-[12px] text-[var(--color-muted)] mt-2">
                        {sim ? sim.name : t("checkout.identityUploadHint")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <Label>{t("checkout.paymentMethod")}</Label>
                  <div className="space-y-3">
                    {([
                      ["qris", "paymentQris"],
                      ["va", "paymentVa"],
                      ["ewallet", "paymentEwallet"],
                      ["card", "paymentCard"],
                    ] as const).map(([v, k]) => (
                      <label
                        key={v}
                        className={
                          payMethod === v
                            ? "flex items-center gap-3 p-4 border-2 border-[var(--color-primary)] cursor-pointer bg-[var(--color-canvas)]"
                            : "flex items-center gap-3 p-4 border border-[var(--color-hairline)] cursor-pointer bg-[var(--color-canvas)] hover:border-[var(--color-ink)]"
                        }
                      >
                        <input
                          type="radio"
                          name="pay"
                          value={v}
                          checked={payMethod === v}
                          onChange={() => setPayMethod(v)}
                          className="accent-[var(--color-primary)]"
                        />
                        <span className="text-[15px] font-bold">{t(`checkout.${k}`)}</span>
                      </label>
                    ))}
                  </div>
                  <label className="mt-8 flex items-start gap-3 cursor-pointer text-[14px]">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="mt-1 accent-[var(--color-primary)]"
                    />
                    <span>{t("checkout.agreeTerms")}</span>
                  </label>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-6 bg-[var(--color-success)] text-white flex items-center justify-center text-[28px] font-bold">
                    {"v"}
                  </div>
                  <h2 className="text-[28px] font-bold mb-3">{t("checkout.doneTitle")}</h2>
                  <p className="text-[var(--color-body)] max-w-md mx-auto">{t("checkout.doneSubtitle")}</p>
                </div>
              )}

              <div className="mt-10 flex gap-3 justify-between">
                <Button variant="secondary" onClick={back} disabled={step === 1}>
                  {t("checkout.back")}
                </Button>
                {step < 3 && (
                  <Button variant="primary" onClick={next}>
                    {t("checkout.next")}
                  </Button>
                )}
                {step === 3 && (
                  <Button variant="primary" disabled={!agree} onClick={submit}>
                    {t("checkout.pay", { amount: formatIDR(total + car.deposit) })}
                  </Button>
                )}
              </div>
            </section>

            <aside className="md:col-span-5 lg:col-span-4">
              <div className="bg-[var(--color-surface-card)] p-6 md:sticky md:top-24">
                <div className="relative aspect-[4/3] bg-[var(--color-canvas)] overflow-hidden mb-4">
                  <Image src={car.exterior} alt={car.name} fill sizes="40vw" className="object-cover" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[var(--color-muted)] mb-1">
                  {car.brand}
                </div>
                <h3 className="text-[20px] font-bold mb-4">{car.name}</h3>

                <h4 className="label-uppercase text-[var(--color-muted)] mb-3">{t("checkout.summary")}</h4>
                <dl className="space-y-2 text-[14px]">
                  <div className="flex justify-between">
                    <dt>{t("checkout.summarySubtotal", { days })}</dt>
                    <dd>{formatIDR(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-[var(--color-muted)]">
                    <dt>{t("checkout.summaryDeposit")}</dt>
                    <dd>{formatIDR(car.deposit)}</dd>
                  </div>
                  <div className="border-t border-[var(--color-hairline)] pt-3 flex justify-between font-bold text-[var(--color-ink)] text-[18px]">
                    <dt>{t("checkout.summaryTotal")}</dt>
                    <dd>{formatIDR(total + car.deposit)}</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
