"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, PencilSimple, Trash, DotsThreeVertical } from "@phosphor-icons/react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { CarCell } from "@/components/admin/CarCell";
import { Button } from "@/components/ui/Button";
import { Badge, categoryColor } from "@/components/ui/Badge";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR } from "@/lib/format";
import type { UiCar } from "@/lib/repo";
import { CarFormDialog } from "./CarFormDialog";
import { deleteCarAction } from "./actions";

const catLabel: Record<UiCar["category"], string> = {
  mpv: "MPV",
  suv: "SUV",
  citycar: "City Car",
  premium: "Premium",
  ev: "Electric",
};

export function ArmadaClient({ cars }: { cars: UiCar[] }) {
  const t = useT();
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UiCar | null>(null);
  const [deleting, setDeleting] = useState<UiCar | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (c: UiCar) => {
    setEditing(c);
    setFormOpen(true);
  };

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
        />
      </section>

      {formOpen && (
        <CarFormDialog
          key={editing?.id ?? "new"}
          open={formOpen}
          car={editing}
          onClose={() => setFormOpen(false)}
        />
      )}

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
