"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/I18nProvider";

export default function ConfirmationPage() {
  const params = useParams<{ id: string }>();
  const t = useT();

  return (
    <>
      <Header />
      <main className="bg-[var(--color-canvas)] py-20 md:py-[80px]">
        <div className="container-folka max-w-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-8 bg-[var(--color-success)] text-white flex items-center justify-center text-[28px] font-bold">
            {"v"}
          </div>
          <h1 className="text-[40px] md:text-[48px] font-bold mb-4">{t("checkout.doneTitle")}</h1>
          <p className="text-[16px] md:text-[18px] text-[var(--color-body)] mb-8">
            {t("checkout.doneSubtitle")}
          </p>
          <div className="inline-block label-uppercase text-[var(--color-muted)] mb-10">
            {t("account.bookingId", { id: params.id })}
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button variant="primary" size="lg" onClick={() => window.print()}>
              {t("checkout.downloadReceipt")}
            </Button>
            <Link href="/akun/booking">
              <Button variant="secondary" size="lg">
                {t("checkout.toAccount")}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
