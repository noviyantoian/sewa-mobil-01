"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, PencilSimple, Trash, Check, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useT } from "@/lib/i18n/I18nProvider";
import {
  createUnitAction,
  updateUnitAction,
  deleteUnitAction,
} from "../actions";

export interface ManagedUnit {
  id: string;
  plate: string;
  label: string | null;
  status: "available" | "maintenance";
  running: boolean;
  booking: { code: string; customerName: string | null; driverName: string | null } | null;
}

export function UnitsManager({
  carId,
  units,
}: {
  carId: string;
  units: ManagedUnit[];
}) {
  const t = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editPlate, setEditPlate] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [newPlate, setNewPlate] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const errMsg = (e?: string) =>
    e === "plate_taken"
      ? t("admin.errPlateTaken")
      : e === "unit_in_use"
        ? t("admin.errUnitInUse")
        : t("admin.errFailed");

  const run = async (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setBusy(true);
    const res = await fn();
    setBusy(false);
    if (res.ok) {
      toast.success(t("admin.saved"));
      router.refresh();
      return true;
    }
    toast.error(errMsg(res.error));
    return false;
  };

  const add = async () => {
    if (!newPlate.trim()) return;
    const ok = await run(() =>
      createUnitAction(carId, { plate: newPlate, label: newLabel || undefined }),
    );
    if (ok) {
      setNewPlate("");
      setNewLabel("");
    }
  };

  const startEdit = (u: ManagedUnit) => {
    setEditId(u.id);
    setEditPlate(u.plate);
    setEditLabel(u.label ?? "");
  };

  const saveEdit = async (u: ManagedUnit) => {
    if (!editPlate.trim()) return;
    const ok = await run(() =>
      updateUnitAction(u.id, {
        plate: editPlate,
        label: editLabel || undefined,
        status: u.status,
      }),
    );
    if (ok) setEditId(null);
  };

  const toggleStatus = (u: ManagedUnit) =>
    run(() =>
      updateUnitAction(u.id, {
        plate: u.plate,
        label: u.label ?? undefined,
        status: u.status === "available" ? "maintenance" : "available",
      }),
    );

  return (
    <section className="card shadow-sm p-6">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--color-mute)]">
          {t("admin.unitsTitle")}
        </h2>
        <span className="tnum text-[13px] text-[var(--color-mute)]">
          {units.length} {t("admin.unitsCount")}
        </span>
      </div>

      <ul className="flex flex-col">
        {units.length === 0 && (
          <li className="py-6 text-center text-[14px] text-[var(--color-mute)]">
            {t("admin.unitsEmpty")}
          </li>
        )}
        {units.map((u) => (
          <li
            key={u.id}
            className="flex flex-wrap items-center gap-3 border-t border-[var(--color-hairline)] py-3 first:border-t-0 first:pt-0"
          >
            {editId === u.id ? (
              <>
                <Input
                  value={editPlate}
                  onChange={(e) => setEditPlate(e.target.value.toUpperCase())}
                  aria-label={t("admin.unitPlate")}
                  className="w-36 uppercase"
                />
                <Input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder={t("admin.unitLabel")}
                  aria-label={t("admin.unitLabel")}
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  size="sm"
                  loading={busy}
                  onClick={() => saveEdit(u)}
                  aria-label={t("admin.save")}
                >
                  <Check size={16} weight="bold" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditId(null)}
                  aria-label={t("admin.cancel")}
                >
                  <X size={16} />
                </Button>
              </>
            ) : (
              <>
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
                <UnitStatusTag u={u} t={t} />
                <button
                  type="button"
                  disabled={busy || u.running}
                  onClick={() => toggleStatus(u)}
                  className="text-[12px] font-bold uppercase tracking-[0.04em] text-[var(--color-primary)] hover:underline disabled:opacity-40"
                >
                  {u.status === "available" ? t("admin.unitMaintenance") : t("admin.unitAvailable")}
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2.5"
                  disabled={busy}
                  onClick={() => startEdit(u)}
                  aria-label={t("admin.carEdit")}
                >
                  <PencilSimple size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2.5 text-[var(--color-error)]"
                  disabled={busy || u.running}
                  onClick={() => run(() => deleteUnitAction(u.id))}
                  aria-label={t("admin.delete")}
                >
                  <Trash size={16} />
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-[var(--color-hairline)] pt-5">
        <Input
          value={newPlate}
          onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
          placeholder={t("admin.unitPlate")}
          aria-label={t("admin.unitPlate")}
          className="w-40 uppercase"
        />
        <Input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder={t("admin.unitLabel")}
          aria-label={t("admin.unitLabel")}
          className="flex-1"
        />
        <Button variant="primary" loading={busy} disabled={!newPlate.trim()} onClick={add}>
          <Plus size={16} weight="bold" /> {t("admin.unitAdd")}
        </Button>
      </div>
    </section>
  );
}

function UnitStatusTag({ u, t }: { u: ManagedUnit; t: (k: string) => string }) {
  const tone = u.running
    ? "bg-[var(--color-warning)]/12 text-[var(--color-warning)]"
    : u.status === "maintenance"
      ? "bg-[var(--color-hairline)] text-[var(--color-mute)]"
      : "bg-[var(--color-success)]/12 text-[var(--color-success)]";
  const label = u.running
    ? t("admin.unitRunning")
    : u.status === "maintenance"
      ? t("admin.unitMaintenance")
      : t("admin.unitAvailable");
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] ${tone}`}>
      {label}
    </span>
  );
}
