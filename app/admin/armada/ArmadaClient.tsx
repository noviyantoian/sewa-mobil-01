"use client";

import { toast } from "sonner";
import { Plus, PencilSimple, DotsThreeVertical } from "@phosphor-icons/react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { CarCell } from "@/components/admin/CarCell";
import { Button } from "@/components/ui/Button";
import { Badge, categoryColor } from "@/components/ui/Badge";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR } from "@/lib/format";
import type { UiCar } from "@/lib/repo";

const catLabel: Record<UiCar["category"], string> = {
  mpv: "MPV",
  suv: "SUV",
  citycar: "City Car",
  premium: "Premium",
  ev: "Electric",
};

export function ArmadaClient({ cars }: { cars: UiCar[] }) {
  const t = useT();

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

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="eyebrow">{t("admin.navFleet")}</span>
          <h1 className="display-sm">{t("admin.fleetTitle")}</h1>
        </div>
        <Button variant="primary" onClick={() => toast(t("admin.addCar"))}>
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
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5"
              onClick={() => toast(c.name, { description: t("common.viewDetails") })}
              aria-label={t("common.viewDetails")}
            >
              <PencilSimple size={16} />
            </Button>
          )}
        />
      </section>
    </div>
  );
}
