import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getActiveTenantId } from "@/lib/tenant/current";
import { getBookingByCode, getCarById } from "@/lib/repo";
import { ConfirmationClient } from "./ConfirmationClient";

export const dynamic = "force-dynamic";

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // id is the human booking code (e.g. FK-26-0001)
  const tenantId = await getActiveTenantId();
  const booking = await getBookingByCode(tenantId, id);
  if (!booking) notFound();

  const car = booking.carId ? await getCarById(tenantId, booking.carId) : null;

  return (
    <>
      <Header />
      <ConfirmationClient
        code={booking.code}
        status={booking.status}
        from={toDateStr(booking.fromAt)}
        to={toDateStr(booking.toAt)}
        total={booking.total}
        mode={booking.mode}
        customerName={booking.customerName ?? ""}
        car={car ? { brand: car.brand, name: car.name, exterior: car.exterior } : null}
      />
      <Footer />
    </>
  );
}
