"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { getActiveTenantId } from "@/lib/tenant/current";
import {
  createDriver,
  updateDriver,
  deleteDriver,
  assignDriver,
} from "@/lib/repo";

const driverSchema = z.object({
  name: z.string().min(1).max(120),
  experienceYears: z.number().int().min(0).max(80),
  rating: z.number().min(0).max(5),
  city: z.string().max(80).optional(),
  status: z.enum(["idle", "assigned", "off"]),
});

export type DriverActionResult = { ok: true } | { ok: false; error: string };

function pgCode(e: unknown): string | undefined {
  return e && typeof e === "object" && "code" in e
    ? (e as { code?: string }).code
    : undefined;
}

function revalidate() {
  revalidatePath("/admin/sopir");
  revalidatePath("/admin/booking");
}

export async function createDriverAction(raw: unknown): Promise<DriverActionResult> {
  try {
    await requireAdmin();
    const parsed = driverSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "invalid" };
    await createDriver(await getActiveTenantId(), parsed.data);
    revalidate();
    return { ok: true };
  } catch (e) {
    console.error("[createDriverAction]", e);
    return { ok: false, error: "failed" };
  }
}

export async function updateDriverAction(
  id: string,
  raw: unknown,
): Promise<DriverActionResult> {
  try {
    await requireAdmin();
    if (!id) return { ok: false, error: "invalid" };
    const parsed = driverSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "invalid" };
    const d = await updateDriver(await getActiveTenantId(), id, parsed.data);
    if (!d) return { ok: false, error: "not_found" };
    revalidate();
    return { ok: true };
  } catch (e) {
    console.error("[updateDriverAction]", e);
    return { ok: false, error: "failed" };
  }
}

export async function deleteDriverAction(id: string): Promise<DriverActionResult> {
  try {
    await requireAdmin();
    if (!id) return { ok: false, error: "invalid" };
    await deleteDriver(await getActiveTenantId(), id);
    revalidate();
    return { ok: true };
  } catch (e) {
    if (pgCode(e) === "23503") return { ok: false, error: "driver_in_use" };
    console.error("[deleteDriverAction]", e);
    return { ok: false, error: "failed" };
  }
}

export async function assignDriverAction(
  bookingId: string,
  driverId: string,
): Promise<DriverActionResult> {
  try {
    await requireAdmin();
    if (!bookingId || !driverId) return { ok: false, error: "invalid" };
    const row = await assignDriver(await getActiveTenantId(), bookingId, driverId);
    if (!row) return { ok: false, error: "not_found" };
    revalidate();
    return { ok: true };
  } catch (e) {
    console.error("[assignDriverAction]", e);
    return { ok: false, error: "failed" };
  }
}
