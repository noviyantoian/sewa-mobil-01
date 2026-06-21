"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { getActiveTenantId } from "@/lib/tenant/current";
import {
  updateBookingStatus,
  updateDocumentStatus,
  getCarById,
  createBooking,
  getAvailableUnits,
  assignUnit,
  DoubleBookingError,
  DriverRequiredError,
} from "@/lib/repo";
import { calcPrice } from "@/lib/pricing";

const statusSchema = z.enum([
  "pending",
  "confirmed",
  "active",
  "completed",
  "cancelled",
]);

const verifySchema = z.enum(["pending", "approved", "rejected"]);
const idSchema = z.string().uuid();

const DAY_START = "T08:00:00+07:00";

const manualSchema = z.object({
  carId: z.string().uuid(),
  mode: z.enum(["selfDrive", "withDriver"]),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  customerName: z.string().min(2).max(120),
  customerPhone: z.string().min(6).max(24),
  pickupLocationId: z.string().uuid().optional(),
  returnLocationId: z.string().uuid().optional(),
  pickupAddress: z.string().max(300).optional(),
  returnAddress: z.string().max(300).optional(),
  driverId: z.string().uuid().optional(),
});

export type ManualBookingResult =
  | { ok: true; code: string }
  | {
      ok: false;
      error:
        | "invalid"
        | "car_not_found"
        | "double_booking"
        | "driver_required"
        | "failed";
    };

export type BookingActionResult = { ok: true } | { ok: false; error: string };

export async function updateBookingStatusAction(
  bookingId: string,
  status: string,
): Promise<BookingActionResult> {
  try {
    await requireAdmin();
    if (!idSchema.safeParse(bookingId).success) return { ok: false, error: "invalid" };
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

export type VerifyActionResult =
  | { ok: true; by: string | null }
  | { ok: false; error: string };

export async function verifyDocumentAction(
  docId: string,
  status: string,
): Promise<VerifyActionResult> {
  try {
    const user = await requireAdmin();
    if (!idSchema.safeParse(docId).success) return { ok: false, error: "invalid" };
    const parsed = verifySchema.safeParse(status);
    if (!parsed.success) return { ok: false, error: "invalid" };
    const tenantId = await getActiveTenantId();
    const by = user.email ?? null;
    const ok = await updateDocumentStatus(tenantId, docId, parsed.data, by);
    if (!ok) return { ok: false, error: "not_found" };
    revalidatePath("/admin/booking");
    revalidatePath("/admin/verifikasi");
    return { ok: true, by };
  } catch (e) {
    console.error("[verifyDocumentAction]", e);
    return { ok: false, error: "failed" };
  }
}

/**
 * Assign (or clear) the physical unit (plate) that goes out for this booking.
 * Empty string clears it. The unit's running/available state is derived from
 * the booking ledger, so no extra status write is needed.
 */
export async function assignUnitAction(
  bookingId: string,
  carUnitId: string,
): Promise<BookingActionResult> {
  try {
    await requireAdmin();
    if (!idSchema.safeParse(bookingId).success) return { ok: false, error: "invalid" };
    const unitId = carUnitId.trim();
    if (unitId && !idSchema.safeParse(unitId).success) return { ok: false, error: "invalid" };
    const tenantId = await getActiveTenantId();
    const row = await assignUnit(tenantId, bookingId, unitId || null);
    if (!row) return { ok: false, error: "not_found" };
    for (const p of ["/admin/booking", "/admin", "/admin/armada"]) {
      revalidatePath(p);
    }
    return { ok: true };
  } catch (e) {
    console.error("[assignUnitAction]", e);
    return { ok: false, error: "failed" };
  }
}

/**
 * Admin-created booking. Price/deposit recomputed server-side from the DB car;
 * availability checked atomically inside createBooking (no double-booking).
 */
export async function createManualBookingAction(
  raw: unknown,
): Promise<ManualBookingResult> {
  try {
    await requireAdmin();
    const parsed = manualSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "invalid" };
    const d = parsed.data;
    const tenantId = await getActiveTenantId();
    const car = await getCarById(tenantId, d.carId);
    if (!car) return { ok: false, error: "car_not_found" };

    const fromAt = new Date(`${d.from}${DAY_START}`);
    const toAt = new Date(`${d.to}${DAY_START}`);
    if (
      Number.isNaN(fromAt.getTime()) ||
      Number.isNaN(toAt.getTime()) ||
      toAt <= fromAt
    ) {
      return { ok: false, error: "invalid" };
    }

    // Driver-mandatory cars can never be self-driven, and the admin must pick
    // the driver manually (availability is checked by a human — never auto).
    const mode = car.driverRequired ? "withDriver" : d.mode;
    if (car.driverRequired && !d.driverId) {
      return { ok: false, error: "driver_required" };
    }

    const price = calcPrice(car, mode, fromAt, toAt);
    const booking = await createBooking(tenantId, {
      carId: car.id,
      mode,
      from: fromAt,
      to: toAt,
      customerName: d.customerName,
      customerPhone: d.customerPhone,
      total: price.subtotal,
      deposit: price.deposit,
      pickupLocationId: d.pickupLocationId,
      returnLocationId: d.returnLocationId,
      pickupAddress: d.pickupAddress,
      returnAddress: d.returnAddress,
      driverId: d.driverId,
      channel: "web_wa",
    });
    for (const p of ["/admin/booking", "/admin", "/admin/kalender"]) {
      revalidatePath(p);
    }
    return { ok: true, code: booking.code };
  } catch (e) {
    if (e instanceof DoubleBookingError) {
      return { ok: false, error: "double_booking" };
    }
    if (e instanceof DriverRequiredError) {
      return { ok: false, error: "driver_required" };
    }
    console.error("[createManualBookingAction]", e);
    return { ok: false, error: "failed" };
  }
}

/**
 * Live availability lookup for the manual booking form. Returns the units still
 * free for the window, or `null` when the car does not track units (always
 * bookable — the form should hide the stock badge).
 */
export async function manualAvailabilityAction(
  carId: string,
  from: string,
  to: string,
): Promise<{ units: number | null }> {
  try {
    await requireAdmin();
    if (
      !idSchema.safeParse(carId).success ||
      !/^\d{4}-\d{2}-\d{2}$/.test(from) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(to)
    ) {
      return { units: null };
    }
    const fromAt = new Date(`${from}${DAY_START}`);
    const toAt = new Date(`${to}${DAY_START}`);
    if (
      Number.isNaN(fromAt.getTime()) ||
      Number.isNaN(toAt.getTime()) ||
      toAt <= fromAt
    ) {
      return { units: null };
    }
    const tenantId = await getActiveTenantId();
    const units = await getAvailableUnits(tenantId, carId, fromAt, toAt);
    return { units };
  } catch (e) {
    console.error("[manualAvailabilityAction]", e);
    return { units: null };
  }
}
