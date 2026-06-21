"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Plus,
  PencilSimple,
  Trash,
  DotsThreeVertical,
  CaretDown,
} from "@phosphor-icons/react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { CarCell } from "@/components/admin/CarCell";
import { Button } from "@/components/ui/Button";
import { Badge, categoryColor } from "@/components/ui/Badge";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR, cn } from "@/lib/format";
import type { UiCar } from "@/lib/repo";
import type { AdminUnit } from "../types";
import { deleteCarAction } from "./actions";

const catLabel: Record<UiCar["category"], string> = {
  mpv: "MPV",
  suv: "SUV",
  citycar: "City Car",
  premium: "Premium",
  ev: "Electric",
};

/** Count units by live state: running (out on a booking) wins over status. */
function unitSummary(list: AdminUnit[]): {
  running: number;
  available: number;
  maintenance: number;
} {
  let running = 0;
  let available = 0;
  let maintenance = 0;
  for (const u of list) {
    if (u.running) running += 1;
    else if (u.status === "maintenance") maintenance += 1;
    else available += 1;
  }
  return { running, available, maintenance };
}

export function ArmadaClient({
  cars,
  units,
}: {
  cars: UiCar[];
  units?: AdminUnit[];
}) {
  const unitList = units ?? [];
  const t = useT();
  const router = useRouter();
  const [deleting, setDeleting] = useState<UiCar | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const unitsByCar = new Map<string, AdminUnit[]>();
  for (const u of unitList) {
    const list = unitsByCar.get(u.carId) ?? [];
    unitsByCar.set(u.carId, [...list, u]);
  }

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const openCreate = () => router.push("/admin/armada/baru");
  const openEdit = (c: UiCar) => router.push(`/admin/armada/${c.id}`);

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    const res = await deleteCarAction(deleting.id);
    setDeleteLoading(false);
    if (res.ok) {
      toast.success(t("admin.deleted"));
      setDeleting(null);
      router.refresh();
    } else {
      toast.error(
        res.error === "car_in_use" ? t("admin.errCarInUse") : t("admin.errFailed"),
      );
    }
  };

  const columns: Column<UiCar>[] = [
    { key: "car", header: t("admin.car"), render: (c) => <CarCell car={c} /> },
    {
      key: "category",
      header: t("admin.navFleet"),
      hideOnMobile: true,
      render: (c) => (
        <Badge tone="neutral" dot={categoryColor[c.category]}>
          {catLabel[c.category]}
        </Badge>
      ),
    },
    {
      key: "units",
      header: t("admin.unitsTitle"),
      hideOnMobile: true,
      render: (c) => {
        const list = unitsByCar.get(c.id) ?? [];
        if (list.length === 0)
          return <span className="text-[var(--color-mute)]">—</span>;
        const s = unitSummary(list);
        const open = expanded.has(c.id);
        return (
          <button
            type="button"
            onClick={() => toggleExpand(c.id)}
            aria-expanded={open}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <span className="tnum text-[var(--color-success)]">
              {s.available} {t("admin.unitAvailable")}
            </span>
            {s.running > 0 && (
              <span className="tnum text-[var(--color-warning)]">
                · {s.running} {t("admin.unitRunning")}
              </span>
            )}
            {s.maintenance > 0 && (
              <span className="tnum text-[var(--color-mute)]">
                · {s.maintenance} {t("admin.unitMaintenance")}
              </span>
            )}
            <CaretDown
              size={13}
              weight="bold"
              className={cn("transition-transform", open && "rotate-180")}
            />
          </button>
        );
      },
    },
    {
      key: "rate",
      header: t("admin.rate"),
      align: "right",
      render: (c) => <span className="tnum font-semibold text-[var(--color-ink)]">{formatIDR(c.rateSelfDrive)}</span>,
    },
    {
      key: "status",
      header: t("admin.actions"),
      align: "right",
      render: (c) =>
        c.available ? (
          <Badge tone="success">{t("common.available")}</Badge>
        ) : (
          <Badge tone="neutral">{t("common.unavailable")}</Badge>
        ),
    },
  ];

  /** Inline sub-row: the unit list (plates + live state) for one expanded model. */
  const renderUnitsPanel = (c: UiCar) => {
    const list = unitsByCar.get(c.id) ?? [];
    return (
      <div className="pt-1">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="label-caps text-[var(--color-mute)]">
            {t("admin.unitsTitle")}
          </span>
          <button
            type="button"
            onClick={() => openEdit(c)}
            className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--color-primary)] hover:underline"
          >
            {t("admin.unitsManage")}
          </button>
        </div>
        <ul className="flex flex-col">
          {list.map((u) => (
            <li
              key={u.id}
              className="flex flex-wrap items-center gap-3 border-t border-[var(--color-hairline)] py-2.5 first:border-t-0 first:pt-0"
            >
              <span className="tnum w-32 font-bold text-[var(--color-ink)]">{u.plate}</span>
              <span className="flex-1 text-[13px] text-[var(--color-body)]">
                {u.label || <span className="text-[var(--color-mute)]">—</span>}
                {u.running && u.booking && (
                  <span className="ml-2 text-[12px] text-[var(--color-mute)]">
                    · {u.booking.customerName ?? "—"}
                    {u.booking.driverName ? ` · ${u.booking.driverName}` : ""}
                  </span>
                )}
              </span>
              {u.running ? (
                <Badge tone="warning">{t("admin.unitRunning")}</Badge>
              ) : u.status === "maintenance" ? (
                <Badge tone="neutral">{t("admin.unitMaintenance")}</Badge>
              ) : (
                <Badge tone="success">{t("admin.unitAvailable")}</Badge>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="eyebrow">{t("admin.navFleet")}</span>
          <h1 className="display-sm">{t("admin.fleetTitle")}</h1>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus size={17} weight="bold" />
          {t("admin.addCar")}
        </Button>
      </header>

      <section className="card shadow-sm">
        <DataTable
          columns={columns}
          rows={cars}
          rowKey={(c) => c.slug}
          actionsHeader={<DotsThreeVertical size={16} className="ml-auto" />}
          actions={(c) => (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5"
                onClick={() => openEdit(c)}
                aria-label={t("admin.carEdit")}
              >
                <PencilSimple size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 text-[var(--color-error)]"
                onClick={() => setDeleting(c)}
                aria-label={t("admin.delete")}
              >
                <Trash size={16} />
              </Button>
            </div>
          )}
          isRowExpanded={(c) => expanded.has(c.id)}
          expandedContent={renderUnitsPanel}
        />
      </section>

      <Dialog.Root open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[14px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6 shadow-xl">
            <Dialog.Title className="text-[18px] font-bold tracking-[-0.01em] text-[var(--color-ink)]">
              {t("admin.carDeleteConfirm")}
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-[14px] text-[var(--color-body-mid)]">
              {deleting ? `${deleting.brand} ${deleting.name}` : ""}
            </Dialog.Description>
            <div className="mt-5 flex justify-end gap-2.5">
              <Button variant="secondary" size="md" onClick={() => setDeleting(null)}>
                {t("admin.cancel")}
              </Button>
              <Button variant="primary" size="md" loading={deleteLoading} onClick={confirmDelete}>
                {t("admin.delete")}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
