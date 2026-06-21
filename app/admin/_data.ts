import { cache } from "react";
import { getActiveTenantId } from "@/lib/tenant/current";
import {
  listBookings,
  listCars,
  listDrivers,
  listUnitViews,
  type UiCar,
} from "@/lib/repo";
import type { AdminBooking, AdminDriver, AdminUnit } from "./types";

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** A booking actively ties up its car/driver/unit while in these states. */
const OCCUPYING: ReadonlySet<string> = new Set(["confirmed", "active"]);

export interface AdminData {
  cars: UiCar[];
  drivers: AdminDriver[];
  bookings: AdminBooking[];
  units: AdminUnit[];
}

/**
 * Fetch + assemble everything the admin surfaces need, tenant-scoped.
 * `cache()` dedupes the queries across admin pages within one request.
 */
export const getAdminData = cache(async (): Promise<AdminData> => {
  const tenantId = await getActiveTenantId();
  const [bookings, cars, drivers, units] = await Promise.all([
    listBookings(tenantId),
    listCars(tenantId),
    listDrivers(tenantId),
    listUnitViews(tenantId),
  ]);

  const carById = new Map(cars.map((c) => [c.id, c]));
  const plateByUnit = new Map(units.map((u) => [u.id, u.plate]));

  const adminBookings: AdminBooking[] = bookings.map((b) => {
    const car = b.carId ? carById.get(b.carId) ?? null : null;
    return {
      id: b.code,
      bookingId: b.id,
      carSlug: car?.slug ?? "",
      car,
      customerName: b.customerName ?? "",
      customerPhone: b.customerPhone ?? "",
      pickupAt: toDateStr(b.fromAt),
      returnAt: toDateStr(b.toAt),
      mode: b.mode,
      total: b.total,
      deposit: b.deposit,
      status: b.status,
      createdAt: b.createdAt.toISOString(),
      driverId: b.driverId,
      carUnitId: b.carUnitId,
      carUnitPlate: b.carUnitId ? plateByUnit.get(b.carUnitId) ?? null : null,
    };
  });

  // Derive each driver's effective status from the booking ledger — `assignDriver`
  // doesn't write drivers.status, so a stored 'idle' would otherwise stay stale
  // after a driver goes out on a job. Manual 'off' (parked) is preserved.
  const busyDriverIds = new Set(
    bookings
      .filter((b) => b.driverId && OCCUPYING.has(b.status))
      .map((b) => b.driverId as string),
  );

  const adminDrivers: AdminDriver[] = drivers.map((d) => ({
    id: d.id,
    name: d.name,
    status:
      d.status === "off" ? "off" : busyDriverIds.has(d.id) ? "assigned" : "idle",
    rating: Number(d.rating ?? 0),
    city: d.city ?? "",
    experienceYears: d.experienceYears,
  }));

  return { cars, drivers: adminDrivers, bookings: adminBookings, units };
});
