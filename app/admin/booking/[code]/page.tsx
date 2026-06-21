import { notFound } from "next/navigation";
import { getActiveTenantId } from "@/lib/tenant/current";
import { getBookingDetail, listDrivers } from "@/lib/repo";
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
    pickup: loc(detail.pickup),
    ret: loc(detail.ret),
    documents: detail.documents,
    drivers: drivers.map((d) => ({ id: d.id, name: d.name })),
  };
  return <BookingDetail vm={vm} />;
}
