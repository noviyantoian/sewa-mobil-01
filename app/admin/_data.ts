import { cache } from "react";
import { getActiveTenantId } from "@/lib/tenant/current";
import { listBookings, listCars, listDrivers, type UiCar } from "@/lib/repo";
import type { AdminBooking, AdminDriver } from "./types";

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export interface AdminData {
  cars: UiCar[];
  drivers: AdminDriver[];
  bookings: AdminBooking[];
}

/**
 * Fetch + assemble everything the admin surfaces need, tenant-scoped.
 * `cache()` dedupes the three queries across admin pages within one request.
 */
export const getAdminData = cache(async (): Promise<AdminData> => {
  const tenantId = await getActiveTenantId();
  const [bookings, cars, drivers] = await Promise.all([
    listBookings(tenantId),
    listCars(tenantId),
    listDrivers(tenantId),
  ]);

  const carById = new Map(cars.map((c) => [c.id, c]));

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
    };
  });

  const adminDrivers: AdminDriver[] = drivers.map((d) => ({
    id: d.id,
    name: d.name,
    status: d.status,
    rating: Number(d.rating ?? 0),
    city: d.city ?? "",
    experienceYears: d.experienceYears,
  }));

  return { cars, drivers: adminDrivers, bookings: adminBookings };
});
