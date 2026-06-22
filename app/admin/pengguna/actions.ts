"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { getActiveTenantId } from "@/lib/tenant/current";
import {
  createMember,
  updateMemberRole,
  deleteMember,
  SeatLimitError,
} from "@/lib/repo";

export type MemberActionResult = { ok: true } | { ok: false; error: string };

const roleSchema = z.enum(["owner", "admin", "finance", "ops"]);
const idSchema = z.string().uuid();

const createSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160).optional().or(z.literal("")),
  phone: z.string().min(6).max(24).optional().or(z.literal("")),
  role: roleSchema,
});

export async function createMemberAction(
  raw: unknown,
): Promise<MemberActionResult> {
  try {
    await requireAdmin();
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "invalid" };
    const tenantId = await getActiveTenantId();
    await createMember(tenantId, {
      name: parsed.data.name,
      email: parsed.data.email || undefined,
      phone: parsed.data.phone || undefined,
      role: parsed.data.role,
    });
    revalidatePath("/admin/pengguna");
    return { ok: true };
  } catch (e) {
    if (e instanceof SeatLimitError) return { ok: false, error: "seat_limit" };
    console.error("[createMemberAction]", e);
    return { ok: false, error: "failed" };
  }
}

export async function updateMemberRoleAction(
  membershipId: string,
  role: string,
): Promise<MemberActionResult> {
  try {
    await requireAdmin();
    if (!idSchema.safeParse(membershipId).success) return { ok: false, error: "invalid" };
    const parsedRole = roleSchema.safeParse(role);
    if (!parsedRole.success) return { ok: false, error: "invalid" };
    const tenantId = await getActiveTenantId();
    const ok = await updateMemberRole(tenantId, membershipId, parsedRole.data);
    if (!ok) return { ok: false, error: "not_found" };
    revalidatePath("/admin/pengguna");
    return { ok: true };
  } catch (e) {
    console.error("[updateMemberRoleAction]", e);
    return { ok: false, error: "failed" };
  }
}

export async function deleteMemberAction(
  membershipId: string,
): Promise<MemberActionResult> {
  try {
    await requireAdmin();
    if (!idSchema.safeParse(membershipId).success) return { ok: false, error: "invalid" };
    const tenantId = await getActiveTenantId();
    const ok = await deleteMember(tenantId, membershipId);
    if (!ok) return { ok: false, error: "not_found" };
    revalidatePath("/admin/pengguna");
    return { ok: true };
  } catch (e) {
    console.error("[deleteMemberAction]", e);
    return { ok: false, error: "failed" };
  }
}
