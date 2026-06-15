"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ShieldCheck,
  ArrowLeft,
  Lock,
  ChatCircleDots,
  CheckCircle,
} from "@phosphor-icons/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { useT } from "@/lib/i18n/I18nProvider";

const OTP_LENGTH = 6;

export default function LoginPage() {
  const t = useT();
  const router = useRouter();

  const [step, setStep] = useState<"contact" | "otp">("contact");
  const [target, setTarget] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const otpValue = otp.join("");

  function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!target.trim()) return;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setStep("otp");
      toast.success(t("login.otpSent", { target: target.trim() }));
      requestAnimationFrame(() => inputs.current[0]?.focus());
    }, 650);
  }

  function setDigit(i: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    if (digit && i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus();
  }

  function onOtpKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  }

  function onOtpPaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    e.preventDefault();
    setOtp(Array.from({ length: OTP_LENGTH }, (_, i) => text[i] ?? ""));
    inputs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  }

  function verify(e: React.FormEvent) {
    e.preventDefault();
    if (otpValue.length < OTP_LENGTH) return;
    setVerifying(true);
    window.setTimeout(() => {
      toast.success(t("login.title"));
      router.push("/akun/booking");
    }, 700);
  }

  return (
    <>
      <Header />
      <main className="bg-[var(--color-canvas-warm)]">
        <div className="container-folka grid min-h-[calc(100vh-72px)] items-stretch gap-0 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
          {/* Form column */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[420px]">
              <Link href="/" className="inline-flex">
                <Logo />
              </Link>

              {step === "contact" ? (
                <form onSubmit={sendOtp} className="mt-10">
                  <h1 className="display-sm">{t("login.title")}</h1>
                  <p className="body-lg mt-3 text-[var(--color-body-mid)]">{t("login.subtitle")}</p>

                  <div className="card mt-8 p-6 shadow-sm md:p-7">
                    <Field label={t("login.email")} htmlFor="login-target">
                      <Input
                        id="login-target"
                        type="text"
                        inputMode="email"
                        autoComplete="username"
                        autoFocus
                        placeholder="nama@email.com"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                      />
                    </Field>
                    <Button
                      type="submit"
                      size="lg"
                      loading={sending}
                      className="mt-5 w-full"
                      disabled={!target.trim()}
                    >
                      {t("login.sendOtp")}
                    </Button>

                    <div className="my-6 flex items-center gap-4">
                      <span className="h-px flex-1 bg-[var(--color-hairline)]" />
                      <span className="label-caps">{t("login.or")}</span>
                      <span className="h-px flex-1 bg-[var(--color-hairline)]" />
                    </div>

                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full"
                      onClick={() => router.push("/")}
                    >
                      {t("login.guest")}
                    </Button>
                  </div>

                  <p className="mt-6 text-[13px] leading-relaxed text-[var(--color-mute)]">
                    {t("login.terms")}
                  </p>
                </form>
              ) : (
                <form onSubmit={verify} className="mt-10">
                  <button
                    type="button"
                    onClick={() => setStep("contact")}
                    className="link-arrow mb-6 cursor-pointer text-[var(--color-body-mid)]"
                  >
                    <ArrowLeft size={16} weight="bold" />
                    {t("common.back")}
                  </button>

                  <h1 className="display-sm">{t("login.otpLabel")}</h1>
                  <p className="body-lg mt-3 text-[var(--color-body-mid)]">
                    {t("login.otpSent", { target })}
                  </p>

                  <div className="card mt-8 p-6 shadow-sm md:p-7">
                    <div className="flex gap-2.5" onPaste={onOtpPaste}>
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => {
                            inputs.current[i] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          aria-label={`${t("login.otpLabel")} ${i + 1}`}
                          value={digit}
                          onChange={(e) => setDigit(i, e.target.value)}
                          onKeyDown={(e) => onOtpKey(i, e)}
                          className="tnum h-14 w-full rounded-[10px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] text-center text-[22px] font-semibold text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] duration-150 hover:border-[var(--color-mute)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-soft)]"
                        />
                      ))}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      loading={verifying}
                      disabled={otpValue.length < OTP_LENGTH}
                      className="mt-6 w-full"
                    >
                      <Lock size={18} weight="bold" />
                      {t("login.verify")}
                    </Button>

                    <button
                      type="button"
                      onClick={() => toast.success(t("login.otpSent", { target }))}
                      className="link-arrow mx-auto mt-5 flex cursor-pointer text-[var(--color-accent)]"
                    >
                      <ChatCircleDots size={16} weight="bold" />
                      {t("login.resend")}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Trust panel */}
          <aside className="relative hidden overflow-hidden rounded-[20px] bg-[var(--color-surface-dark)] p-12 lg:flex lg:flex-col lg:justify-between">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-30 blur-3xl"
              style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-on-dark-soft)]">
                <ShieldCheck size={16} weight="fill" className="text-[var(--color-accent)]" />
                {t("brand.name")}
              </span>
              <h2 className="display-md mt-8 max-w-sm !text-white">{t("brand.tagline")}</h2>
            </div>

            <ul className="relative space-y-4">
              {[t("trust.p1Title"), t("trust.p3Title"), t("trust.p4Title")].map((line) => (
                <li key={line} className="flex items-center gap-3 text-[16px] text-[var(--color-on-dark)]">
                  <CheckCircle size={22} weight="fill" className="shrink-0 text-[var(--color-accent)]" />
                  {line}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
