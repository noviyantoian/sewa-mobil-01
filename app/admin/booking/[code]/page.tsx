import { notFound } from "next/navigation";
import { getActiveTenantId } from "@/lib/tenant/current";
import { getBookingDetail, listDrivers, listUnitsByCar } from "@/lib/repo";
import type { BookingDetailVM } from "../../types";
import { BookingDetail } from "./BookingDetail";

export const dynamic = "force-dynamic";

const loc = (l: { city: string; area: string } | null) =>
  l ? `${l.city} — ${l.area}` : null;

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const tenantId = await getActiveTenantId();
  const [detail, drivers] = await Promise.all([
    getBookingDetail(tenantId, decodeURIComponent(code)),
    listDrivers(tenantId),
  ]);
  if (!detail) notFound();

  const { booking: b } = detail;
  // Units of this car the admin can assign as the physical plate that goes out.
  const units = detail.car
    ? await listUnitsByCar(tenantId, detail.car.id)
    : [];
  const vm: BookingDetailVM = {
    code: b.code,
    bookingId: b.id,
    status: b.status,
    mode: b.mode,
    channel: b.channel,
    customerName: b.customerName ?? "",
    customerPhone: b.customerPhone ?? "",
    fromAt: b.fromAt.toISOString(),
    toAt: b.toAt.toISOString(),
    createdAt: b.createdAt.toISOString(),
    total: b.total,
    deposit: b.deposit,
    car: detail.car,
    driverId: b.driverId,
    carUnitId: b.carUnitId ?? null,
    units: units.map((u) => ({
      id: u.id,
      plate: u.plate,
      label: u.label,
      running: u.running,
    })),
    pickup: loc(detail.pickup),
    ret: loc(detail.ret),
    pickupAddress: b.pickupAddress ?? null,
    returnAddress: b.returnAddress ?? null,
    documents: detail.documents,
    drivers: drivers.map((d) => ({ id: d.id, name: d.name })),
  };
  return <BookingDetail vm={vm} />;
}
