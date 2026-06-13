"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useT } from "@/lib/i18n/I18nProvider";

export default function LoginPage() {
  const t = useT();
  const router = useRouter();
  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <>
      <Header />
      <main className="bg-[var(--color-canvas)] py-16 md:py-24">
        <div className="container-folka max-w-md">
          <h1 className="text-[32px] md:text-[40px] font-bold mb-2">{t("login.title")}</h1>
          <p className="text-[var(--color-body)] mb-10">{t("login.subtitle")}</p>

          {stage === "phone" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStage("otp");
              }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="ph">{t("login.phoneLabel")}</Label>
                <Input
                  id="ph"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("login.phonePlaceholder")}
                  required
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full">
                {t("login.sendOtp")}
              </Button>
            </form>
          )}

          {stage === "otp" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.push("/akun/booking");
              }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="otp">{t("login.otpLabel")}</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="------"
                  className="text-center text-[24px] tracking-[6px] font-bold"
                  required
                />
                <p className="text-[12px] text-[var(--color-muted)] mt-2">{t("login.otpHint")}</p>
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full">
                {t("login.verify")}
              </Button>
              <button
                type="button"
                onClick={() => setStage("phone")}
                className="block w-full text-center text-[13px] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              >
                {t("login.resend")}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
