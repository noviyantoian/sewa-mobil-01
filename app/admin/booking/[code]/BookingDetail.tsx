"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  SteeringWheel,
  Key,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR, formatDateRange } from "@/lib/format";
import type { BookingStatus } from "@/lib/mock/bookings";
import type { BookingDetailVM } from "../../types";
import { updateBookingStatusAction, verifyDocumentAction } from "../actions";
import { assignDriverAction } from "../../sopir/actions";

const STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "active",
  "completed",
  "cancelled",
];

const selectClass =
  "w-full cursor-pointer appearance-none rounded-[10px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-3 py-2.5 text-[14px] text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-accent)]";

const verifyColor: Record<string, string> = {
  approved: "text-[var(--color-success)]",
  rejected: "text-[var(--color-error)]",
  pending: "text-[var(--color-warning)]",
};

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card shadow-sm">
      <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--color-mute)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-[var(--color-hairline)] py-2.5 first:border-t-0 first:pt-0">
      <span className="text-[13px] text-[var(--color-mute)]">{label}</span>
      <span className="text-right text-[14px] font-semibold text-[var(--color-ink)]">{children}</span>
    </div>
  );
}

export function BookingDetail({ vm }: { vm: BookingDetailVM }) {
  const t = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setBusy(true);
    const res = await fn();
    setBusy(false);
    if (res.ok) {
      toast.success(t("admin.saved"));
      router.refresh();
    } else {
      toast.error(t("admin.errFailed"));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/admin/booking"
            className="inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--color-mute)] hover:text-[var(--color-ink)]"
          >
            <ArrowLeft size={15} weight="bold" />
            {t("admin.bkBack")}
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="display-sm tnum">{vm.code}</h1>
            <StatusBadge status={vm.status} />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title={t("admin.customer")}>
          <Row label={t("admin.fName")}>{vm.customerName || "—"}</Row>
          <Row label={t("admin.fCity")}>
            {vm.customerPhone ? (
              <a href={`tel:${vm.customerPhone}`} className="tnum text-[var(--color-accent)] hover:underline">
                {vm.customerPhone}
              </a>
            ) : (
              "—"
            )}
          </Row>
          <Row label={t("admin.bkCreatedAt")}>
            <span className="tnum">{vm.createdAt.slice(0, 10)}</span>
          </Row>
        </Card>

        <Card title={t("admin.car")}>
          <Row label={t("admin.car")}>
            {vm.car ? (
              <Link href={`/admin/armada/${vm.car.id}`} className="text-[var(--color-accent)] hover:underline">
                {vm.car.brand} {vm.car.name}
              </Link>
            ) : (
              "—"
            )}
          </Row>
          <Row label={t("admin.dates")}>
            <span className="tnum">{formatDateRange(vm.fromAt.slice(0, 10), vm.toAt.slice(0, 10))}</span>
          </Row>
          <Row label={t("admin.bkMode")}>
            <span className="inline-flex items-center gap-1.5">
              {vm.mode === "withDriver" ? <SteeringWheel size={15} /> : <Key size={15} />}
              {vm.mode === "withDriver" ? t("admin.bkWithDriver") : t("admin.bkSelfDrive")}
            </span>
          </Row>
        </Card>

        <Card title={t("admin.bkLocations")}>
          <Row label={t("admin.bkPickup")}>{vm.pickup ?? "—"}</Row>
          <Row label={t("admin.bkReturn")}>{vm.ret ?? "—"}</Row>
        </Card>

        <Card title={t("admin.bkPayment")}>
          <Row label={t("admin.bkTotal")}>
            <span className="tnum">{formatIDR(vm.total)}</span>
          </Row>
          <Row label={t("admin.bkDeposit")}>
            <span className="tnum">{formatIDR(vm.deposit)}</span>
          </Row>
          <Row label={t("admin.bkChannel")}>{vm.channel}</Row>
        </Card>

        <Card title={t("admin.bkChangeStatus")}>
          <select
            value={vm.status}
            disabled={busy}
            onChange={(e) => run(() => updateBookingStatusAction(vm.bookingId, e.target.value))}
            className={selectClass}
            aria-label={t("admin.bkChangeStatus")}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`status.${s}`)}
              </option>
            ))}
          </select>
        </Card>

        <Card title={t("admin.bkDriver")}>
          <select
            value={vm.driverId ?? ""}
            disabled={busy || vm.drivers.length === 0}
            onChange={(e) => run(() => assignDriverAction(vm.bookingId, e.target.value))}
            className={selectClass}
            aria-label={t("admin.bkAssign")}
          >
            <option value="" disabled>
              {t("admin.bkNoDriver")}
            </option>
            {vm.drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Card>
      </div>

      <Card title={t("admin.bkDocuments")}>
        {vm.documents.length === 0 ? (
          <p className="text-[14px] text-[var(--color-mute)]">{t("admin.bkNoDocuments")}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {vm.documents.map((d) => (
              <li
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-hairline)] pt-3 first:border-t-0 first:pt-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-semibold uppercase text-[var(--color-ink)]">{d.type}</span>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
                  >
                    {t("admin.bkView")} <ArrowSquareOut size={13} />
                  </a>
                  <span className={`text-[12px] font-semibold uppercase ${verifyColor[d.verifyStatus] ?? "text-[var(--color-mute)]"}`}>
                    {d.verifyStatus}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={busy || d.verifyStatus === "approved"}
                    onClick={() => run(() => verifyDocumentAction(d.id, "approved"))}
                  >
                    {t("admin.bkApprove")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--color-error)]"
                    disabled={busy || d.verifyStatus === "rejected"}
                    onClick={() => run(() => verifyDocumentAction(d.id, "rejected"))}
                  >
                    {t("admin.bkReject")}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
