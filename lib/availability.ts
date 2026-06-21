import { and, eq, gt, inArray, lt, ne } from "drizzle-orm";
import type { Tx } from "@/lib/db";
import { bookings, type BookingStatus } from "@/lib/db/schema";

/**
 * Availability / double-booking guard (PRD §6.2, booking domain rule §7).
 *
 * These run inside an existing tenant-scoped transaction (`withTenant`), so the
 * caller can check-then-insert atomically and RLS already scopes the rows.
 */

/** Statuses that occupy a car's calendar. `completed`/`cancelled` free it. */
const BLOCKING_STATUSES: readonly BookingStatus[] = [
  "pending",
  "confirmed",
  "active",
];

/** Bookings for `carId` whose [from_at, to_at) overlaps the requested window. */
export async function overlappingBookings(
  tx: Tx,
  carId: string,
  from: Date,
  to: Date,
  excludeBookingId?: string,
): Promise<{ id: string }[]> {
  const conds = [
    eq(bookings.carId, carId),
    inArray(bookings.status, [...BLOCKING_STATUSES]),
    lt(bookings.fromAt, to), // existing starts before requested end …
    gt(bookings.toAt, from), // … and ends after requested start ⇒ overlap
  ];
  if (excludeBookingId) conds.push(ne(bookings.id, excludeBookingId));
  return tx.select({ id: bookings.id }).from(bookings).where(and(...conds));
}

export async function isCarAvailable(
  tx: Tx,
  carId: string,
  from: Date,
  to: Date,
  excludeBookingId?: string,
): Promise<boolean> {
  const rows = await overlappingBookings(tx, carId, from, to, excludeBookingId);
  return rows.length === 0;
}
