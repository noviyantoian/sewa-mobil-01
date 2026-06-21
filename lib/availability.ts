import { and, eq, gt, inArray, lt, ne } from "drizzle-orm";
import type { Tx } from "@/lib/db";
import { bookings, cars, type BookingStatus } from "@/lib/db/schema";

/**
 * Availability / double-booking guard (PRD §6.2, booking domain rule §7).
 *
 * A car row is a *model* that owns `unit_count` identical physical units —
 * customers never see plate numbers. Availability is count-based:
 *
 *   availableUnits(window) = unit_count − overlapping blocking bookings
 *
 * The check is only enforced when the model opts in via `track_units`. When
 * `track_units` is false (legacy default) the model is always bookable and the
 * customer confirms manually — `availableUnitCount` returns `Infinity`.
 *
 * These run inside an existing tenant-scoped transaction (`withTenant`), so the
 * caller can check-then-insert atomically and RLS already scopes the rows.
 */

/** Statuses that occupy a unit. `completed`/`cancelled` free it. */
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

/** Per-model stock settings, fetched once so callers can reuse them. */
interface UnitSettings {
  unitCount: number;
  trackUnits: boolean;
}

async function carUnitSettings(
  tx: Tx,
  carId: string,
): Promise<UnitSettings | null> {
  const [row] = await tx
    .select({ unitCount: cars.unitCount, trackUnits: cars.trackUnits })
    .from(cars)
    .where(eq(cars.id, carId))
    .limit(1);
  return row ?? null;
}

/**
 * Units still free for the window.
 * - `Infinity` when the model does not track units (always bookable).
 * - `unit_count − overlapping` (never below 0) when it does.
 * - `0` when the car id is unknown.
 */
export async function availableUnitCount(
  tx: Tx,
  carId: string,
  from: Date,
  to: Date,
  excludeBookingId?: string,
): Promise<number> {
  const settings = await carUnitSettings(tx, carId);
  if (!settings) return 0;
  if (!settings.trackUnits) return Number.POSITIVE_INFINITY;

  const overlap = await overlappingBookings(tx, carId, from, to, excludeBookingId);
  return Math.max(0, settings.unitCount - overlap.length);
}

/** True when at least one unit is free (or the model does not track units). */
export async function isCarAvailable(
  tx: Tx,
  carId: string,
  from: Date,
  to: Date,
  excludeBookingId?: string,
): Promise<boolean> {
  return (await availableUnitCount(tx, carId, from, to, excludeBookingId)) > 0;
}
