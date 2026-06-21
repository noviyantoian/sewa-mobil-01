import { notFound } from "next/navigation";
import { getActiveTenantId } from "@/lib/tenant/current";
import { getDriverById, listBookingsForDriver, listCars } from "@/lib/repo";
import type { DriverFormState } from "../DriverForm";
import { DriverDetail, type DriverBookingVM } from "./DriverDetail";

export const dynamic = "force-dynamic";

export default async function EditDriverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenantId = await getActiveTenantId();
  const driver = await getDriverById(tenantId, id);
  if (!driver) notFound();

  const [bookings, cars] = await Promise.all([
    listBookingsForDriver(tenantId, id),
    listCars(tenantId),
  ]);
  const carName = new Map(cars.map((c) => [c.id, `${c.brand} ${c.name}`]));

  const initial: DriverFormState = {
    name: driver.name,
    experienceYears: String(driver.experienceYears),
    rating: driver.rating ?? "0",
    city: driver.city ?? "",
    status: driver.status,
  };
  const vmBookings: DriverBookingVM[] = bookings.map((b) => ({
    code: b.code,
    customerName: b.customerName ?? "",
    carName: b.carId ? (carName.get(b.carId) ?? "") : "",
    fromAt: b.fromAt.toISOString(),
    toAt: b.toAt.toISOString(),
    status: b.status,
  }));

  return <DriverDetail driverId={id} initial={initial} bookings={vmBookings} />;
}
