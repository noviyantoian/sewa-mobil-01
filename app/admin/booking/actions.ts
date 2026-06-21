"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { getActiveTenantId } from "@/lib/tenant/current";
import { updateBookingStatus } from "@/lib/repo";

const statusSchema = z.enum([
  "pending",
  "confirmed",
  "active",
  "completed",
  "cancelled",
]);

export type BookingActionResult = { ok: true } | { ok: false; error: string };

export async function updateBookingStatusAction(
  bookingId: string,
  status: string,
): Promise<BookingActionResult> {
  try {
    await requireAdmin();
    if (!bookingId) return { ok: false, error: "invalid" };
    const parsed = statusSchema.safeParse(status);
    if (!parsed.success) return { ok: false, error: "invalid" };
    const tenantId = await getActiveTenantId();
    const row = await updateBookingStatus(tenantId, bookingId, parsed.data);
    if (!row) return { ok: false, error: "not_found" };
    // Refresh every surface that shows booking state.
    for (const p of [
      "/admin/booking",
      "/admin",
      "/admin/verifikasi",
      "/admin/kalender",
      "/akun/booking",
    ]) {
      revalidatePath(p);
    }
    return { ok: true };
  } catch (e) {
    console.error("[updateBookingStatusAction]", e);
    return { ok: false, error: "failed" };
  }
}
