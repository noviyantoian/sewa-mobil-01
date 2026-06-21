"use server";

import { z } from "zod";
import { getActiveTenantId } from "@/lib/tenant/current";
import { createBooking, DoubleBookingError, getCarBySlug } from "@/lib/repo";
import { calcPrice } from "@/lib/pricing";

const inputSchema = z.object({
  slug: z.string().min(1),
  mode: z.enum(["selfDrive", "withDriver"]),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fullName: z.string().min(3).max(120),
  phone: z.string().min(8).max(24),
  email: z.string().email().optional(),
  addonsTotal: z.number().int().min(0).max(50_000_000).default(0),
  pickupAddress: z.string().max(300).optional(),
  returnAddress: z.string().max(300).optional(),
});

export type CreateBookingInput = z.infer<typeof inputSchema>;
export type CreateBookingResult =
  | { ok: true; code: string }
  | { ok: false; error: "invalid" | "car_not_found" | "double_booking" | "failed" };

/** Pickup time of day used when only a calendar date is provided (WIB). */
const DAY_START = "T08:00:00+07:00";

/**
 * Place a booking. Price + deposit are recomputed server-side from the DB car
 * (never trust client totals); availability is checked atomically inside
 * createBooking. Returns the booking code for the confirmation route.
 */
export async function createBookingAction(
  raw: unknown,
): Promise<CreateBookingResult> {
  const parsed = inputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const { slug, mode, from, to, fullName, phone, addonsTotal, pickupAddress, returnAddress } =
    parsed.data;

  const tenantId = await getActiveTenantId();
  const car = await getCarBySlug(tenantId, slug);
  if (!car) return { ok: false, error: "car_not_found" };

  const fromAt = new Date(`${from}${DAY_START}`);
  const toAt = new Date(`${to}${DAY_START}`);
  if (Number.isNaN(fromAt.getTime()) || Number.isNaN(toAt.getTime()) || toAt <= fromAt) {
    return { ok: false, error: "invalid" };
  }

  const price = calcPrice(car, mode, fromAt, toAt);

  try {
    const booking = await createBooking(tenantId, {
      carId: car.id,
      mode,
      from: fromAt,
      to: toAt,
      customerName: fullName,
      customerPhone: phone,
      total: price.subtotal + addonsTotal,
      deposit: price.deposit,
      pickupAddress,
      returnAddress,
      channel: "web_wa",
    });
    return { ok: true, code: booking.code };
  } catch (err) {
    if (err instanceof DoubleBookingError) return { ok: false, error: "double_booking" };
    console.error("[createBookingAction] booking failed", err);
    return { ok: false, error: "failed" };
  }
}
