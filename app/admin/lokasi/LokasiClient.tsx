"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, PencilSimple, Trash, DotsThreeVertical } from "@phosphor-icons/react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useT } from "@/lib/i18n/I18nProvider";
import type { LocationRow } from "@/lib/repo";
import { LocationFormDialog } from "./LocationFormDialog";
import { deleteLocationAction } from "./actions";

export function LokasiClient({ locations }: { locations: LocationRow[] }) {
  const t = useT();
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LocationRow | null>(null);
  const [deleting, setDeleting] = useState<LocationRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    const res = await deleteLocationAction(deleting.id);
    setDeleteLoading(false);
    if (res.ok) {
      toast.success(t("admin.deleted"));
      setDeleting(null);
      router.refresh();
    } else {
      toast.error(
        res.error === "location_in_use" ? t("admin.errLocationInUse") : t("admin.errFailed"),
      );
    }
  };

  const columns: Column<LocationRow>[] = [
    {
      key: "city",
      header: t("admin.fCity"),
      render: (l) => <span className="font-semibold text-[var(--color-ink)]">{l.city}</span>,
    },
    { key: "area", header: t("admin.fArea"), render: (l) => l.area },
    {
      key: "type",
      header: t("admin.fType"),
      align: "right",
      render: (l) => (
        <Badge tone="neutral">
          <span className="capitalize">{l.type}</span>
        </Badge>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="eyebrow">{t("admin.navLocations")}</span>
          <h1 className="display-sm">{t("admin.locationsTitle")}</h1>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus size={17} weight="bold" />
          {t("admin.addLocation")}
        </Button>
      </header>

      <section className="card shadow-sm">
        <DataTable
          columns={columns}
          rows={locations}
          rowKey={(l) => l.id}
          actionsHeader={<DotsThreeVertical size={16} className="ml-auto" />}
          actions={(l) => (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5"
                onClick={() => {
                  setEditing(l);
                  setFormOpen(true);
                }}
                aria-label={t("admin.locationEdit")}
              >
                <PencilSimple size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 text-[var(--color-error)]"
                onClick={() => setDeleting(l)}
                aria-label={t("admin.delete")}
              >
                <Trash size={16} />
              </Button>
            </div>
          )}
        />
      </section>

      {formOpen && (
        <LocationFormDialog
          key={editing?.id ?? "new"}
          open={formOpen}
          location={editing}
          onClose={() => setFormOpen(false)}
        />
      )}

      <Dialog.Root open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[14px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6 shadow-xl">
            <Dialog.Title className="text-[18px] font-bold tracking-[-0.01em] text-[var(--color-ink)]">
              {t("admin.locationDeleteConfirm")}
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-[14px] text-[var(--color-body-mid)]">
              {deleting ? `${deleting.city} · ${deleting.area}` : ""}
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
