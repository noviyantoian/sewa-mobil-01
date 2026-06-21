import { and, asc, eq, inArray, isNotNull } from "drizzle-orm";
import { withTenant } from "@/lib/db";
import {
  bookings,
  carUnits,
  cars,
  drivers,
  type CarUnitStatus,
} from "@/lib/db/schema";

export type CarUnitRow = typeof carUnits.$inferSelect;

/** A unit's live booking, when one is currently out (confirmed/active). */
export interface UnitBooking {
  code: string;
  customerName: string | null;
  driverName: string | null;
  toAt: string;
}

/**
 * A physical unit enriched with its model name and live runtime status. `running`
 * is derived from an active/confirmed booking pointing at this unit — never a
 * stored flag, so it can never drift from the booking ledger.
 */
export interface UnitView {
  id: string;
  carId: string;
  carName: string;
  plate: string;
  label: string | null;
  status: CarUnitStatus;
  running: boolean;
  booking: UnitBooking | null;
}

/** Bookings that occupy a unit right now (admin assigned a plate to them). */
const OCCUPYING_STATUSES = ["confirmed", "active"] as const;

/**
 * All units for the tenant, each with model name + whether it is currently out
 * (and with whom). Two RLS-scoped queries, joined in memory to avoid an N+1.
 */
export async function listUnitViews(tenantId: string): Promise<UnitView[]> {
  return withTenant(tenantId, async (tx) => {
    const rows = await tx
      .select({
        id: carUnits.id,
        carId: carUnits.carId,
        carName: cars.name,
        plate: carUnits.plate,
        label: carUnits.label,
        status: carUnits.status,
      })
      .from(carUnits)
      .innerJoin(cars, eq(carUnits.carId, cars.id))
      .orderBy(asc(cars.name), asc(carUnits.plate));

    const active = await tx
      .select({
        carUnitId: bookings.carUnitId,
        code: bookings.code,
        customerName: bookings.customerName,
        toAt: bookings.toAt,
        driverName: drivers.name,
      })
      .from(bookings)
      .leftJoin(drivers, eq(bookings.driverId, drivers.id))
      .where(
        and(
          isNotNull(bookings.carUnitId),
          inArray(bookings.status, [...OCCUPYING_STATUSES]),
        ),
      );

    const byUnit = new Map(active.map((a) => [a.carUnitId as string, a]));

    return rows.map((r) => {
      const a = byUnit.get(r.id);
      return {
        ...r,
        running: !!a,
        booking: a
          ? {
              code: a.code,
              customerName: a.customerName,
              driverName: a.driverName,
              toAt: a.toAt.toISOString(),
            }
          : null,
      };
    });
  });
}

/** Units of a single car — for the booking detail plate picker + armada dropdown. */
export async function listUnitsByCar(
  tenantId: string,
  carId: string,
): Promise<UnitView[]> {
  const all = await listUnitViews(tenantId);
  return all.filter((u) => u.carId === carId);
}

// ── Writes (admin CMS) ───────────────────────────────────────────────────────

export interface UnitInput {
  plate: string;
  label?: string;
  status?: CarUnitStatus;
}

function unitColumns(input: UnitInput) {
  return {
    plate: input.plate.trim(),
    label: input.label?.trim() || null,
    status: input.status ?? "available",
  };
}

export async function createUnit(
  tenantId: string,
  carId: string,
  input: UnitInput,
): Promise<CarUnitRow> {
  return withTenant(tenantId, async (tx) => {
    const [u] = await tx
      .insert(carUnits)
      .values({ tenantId, carId, ...unitColumns(input) })
      .returning();
    return u;
  });
}

export async function updateUnit(
  tenantId: string,
  id: string,
  input: UnitInput,
): Promise<CarUnitRow | null> {
  return withTenant(tenantId, async (tx) => {
    const [u] = await tx
      .update(carUnits)
      .set(unitColumns(input))
      .where(eq(carUnits.id, id))
      .returning();
    return u ?? null;
  });
}

export async function deleteUnit(tenantId: string, id: string): Promise<void> {
  await withTenant(tenantId, (tx) => tx.delete(carUnits).where(eq(carUnits.id, id)));
}
