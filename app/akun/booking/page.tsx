import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getActiveTenantId } from "@/lib/tenant/current";
import { listBookings, listCars, listLocations } from "@/lib/repo";
import { AccountBookingClient, type BookingView } from "./AccountBookingClient";

export const dynamic = "force-dynamic";

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function AccountBookingPage() {
  const tenantId = await getActiveTenantId();
  const [bookings, cars, locations] = await Promise.all([
    listBookings(tenantId),
    listCars(tenantId),
    listLocations(tenantId),
  ]);

  const carById = new Map(cars.map((c) => [c.id, c]));
  const locById = new Map(locations.map((l) => [l.id, l]));
  const locLabel = (id: string | null): string => {
    if (!id) return "—";
    const l = locById.get(id);
    return l ? `${l.city} · ${l.area}` : "—";
  };

  const views: BookingView[] = bookings
    .map((b): BookingView => {
      const car = b.carId ? carById.get(b.carId) : undefined;
      return {
        code: b.code,
        status: b.status,
        mode: b.mode,
        from: toDateStr(b.fromAt),
        to: toDateStr(b.toAt),
        total: b.total,
        car: car
          ? { slug: car.slug, name: car.name, brand: car.brand, exterior: car.exterior }
          : null,
        pickupLabel: locLabel(b.pickupLocationId),
        returnLabel: locLabel(b.returnLocationId),
      };
    })
    .sort((a, b) => (a.from < b.from ? 1 : -1));

  return (
    <>
      <Header />
      <AccountBookingClient bookings={views} />
      <Footer />
    </>
  );
}
