"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Trash, UserCircle, DotsThreeVertical } from "@phosphor-icons/react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Field, Input, Select } from "@/components/ui/Input";
import { useT } from "@/lib/i18n/I18nProvider";
import type { Member, SeatInfo } from "@/lib/repo";
import type { MemberRole } from "@/lib/db/schema";
import {
  createMemberAction,
  updateMemberRoleAction,
  deleteMemberAction,
} from "./actions";

const ROLES: MemberRole[] = ["owner", "admin", "finance", "ops"];
const roleKey: Record<MemberRole, string> = {
  owner: "admin.roleOwner",
  admin: "admin.roleAdmin",
  finance: "admin.roleFinance",
  ops: "admin.roleOps",
};

const emptyForm = { name: "", email: "", phone: "", role: "ops" as MemberRole };

export function PenggunaClient({
  members,
  seat,
}: {
  members: Member[];
  seat: SeatInfo;
}) {
  const t = useT();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Member | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const full = seat.max !== null && seat.used >= seat.max;

  const seatLabel =
    seat.max === null
      ? `${seat.used} / ∞`
      : `${seat.used} / ${seat.max}`;

  const submitAdd = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const res = await createMemberAction(form);
    setSaving(false);
    if (res.ok) {
      toast.success(t("admin.saved"));
      setAdding(false);
      setForm(emptyForm);
      router.refresh();
    } else {
      toast.error(
        res.error === "seat_limit"
          ? t("admin.errSeatLimit")
          : t("admin.errFailed"),
      );
    }
  };

  const changeRole = async (m: Member, role: string) => {
    setBusyId(m.id);
    const res = await updateMemberRoleAction(m.id, role);
    setBusyId(null);
    if (res.ok) {
      toast.success(t("admin.saved"));
      router.refresh();
    } else {
      toast.error(t("admin.errFailed"));
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusyId(deleting.id);
    const res = await deleteMemberAction(deleting.id);
    setBusyId(null);
    if (res.ok) {
      toast.success(t("admin.deleted"));
      setDeleting(null);
      router.refresh();
    } else {
      toast.error(t("admin.errFailed"));
    }
  };

  const columns: Column<Member>[] = [
    {
      key: "name",
      header: t("admin.fName"),
      render: (m) => (
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-canvas-soft)] text-[var(--color-mute)]">
            <UserCircle size={20} weight="fill" />
          </span>
          <span className="font-semibold text-[var(--color-ink)]">
            {m.name || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "contact",
      header: t("admin.userEmail"),
      hideOnMobile: true,
      render: (m) => (
        <div className="flex flex-col text-[13px]">
          <span className="text-[var(--color-body)]">{m.email || "—"}</span>
          {m.phone && (
            <span className="tnum text-[var(--color-mute)]">{m.phone}</span>
          )}
        </div>
      ),
    },
    {
      key: "role",
      header: t("admin.userRole"),
      render: (m) => (
        <Select
          aria-label={t("admin.userRole")}
          value={m.role}
          disabled={busyId === m.id}
          onChange={(e) => changeRole(m, e.target.value)}
          className="h-9 w-[150px] text-[13px]"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {t(roleKey[r])}
            </option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="eyebrow">{t("admin.navUsers")}</span>
          <h1 className="display-sm">{t("admin.usersTitle")}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={full ? "warning" : "neutral"}>
            {seatLabel} {t("admin.seats")}
          </Badge>
          <Button
            variant="primary"
            onClick={() => setAdding(true)}
            disabled={full}
          >
            <Plus size={17} weight="bold" />
            {t("admin.addUser")}
          </Button>
        </div>
      </header>

      {full && (
        <p className="text-[13px] text-[var(--color-warning)]">
          {t("admin.seatFull")}
        </p>
      )}

      <section className="card shadow-sm">
        <DataTable
          columns={columns}
          rows={members}
          rowKey={(m) => m.id}
          empty={t("admin.usersEmpty")}
          actionsHeader={<DotsThreeVertical size={16} className="ml-auto" />}
          actions={(m) => (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-[var(--color-error)]"
              disabled={m.role === "owner"}
              onClick={() => setDeleting(m)}
              aria-label={t("admin.delete")}
            >
              <Trash size={16} />
            </Button>
          )}
        />
      </section>

      {/* Add member dialog */}
      <Dialog.Root open={adding} onOpenChange={(o) => !o && setAdding(false)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6 shadow-xl">
            <Dialog.Title className="text-[18px] font-bold tracking-[-0.01em] text-[var(--color-ink)]">
              {t("admin.addUser")}
            </Dialog.Title>
            <div className="mt-5 flex flex-col gap-4">
              <Field label={t("admin.fName")} htmlFor="m-name">
                <Input
                  id="m-name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
              </Field>
              <Field label={t("admin.userEmail")} htmlFor="m-email">
                <Input
                  id="m-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
              </Field>
              <Field label={t("admin.userPhone")} htmlFor="m-phone">
                <Input
                  id="m-phone"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </Field>
              <Field label={t("admin.userRole")} htmlFor="m-role">
                <Select
                  id="m-role"
                  value={form.role}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, role: e.target.value as MemberRole }))
                  }
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {t(roleKey[r])}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2.5">
              <Button variant="secondary" size="md" onClick={() => setAdding(false)}>
                {t("admin.cancel")}
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={saving}
                disabled={!form.name.trim()}
                onClick={submitAdd}
              >
                {t("admin.save")}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete confirm dialog */}
      <Dialog.Root open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-sm -translate-x-1/2 -translate-y-1/2 border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6 shadow-xl">
            <Dialog.Title className="text-[18px] font-bold tracking-[-0.01em] text-[var(--color-ink)]">
              {t("admin.userDeleteConfirm")}
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-[14px] text-[var(--color-body-mid)]">
              {deleting?.name ?? ""}
            </Dialog.Description>
            <div className="mt-5 flex justify-end gap-2.5">
              <Button variant="secondary" size="md" onClick={() => setDeleting(null)}>
                {t("admin.cancel")}
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={busyId === deleting?.id}
                onClick={confirmDelete}
              >
                {t("admin.delete")}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
