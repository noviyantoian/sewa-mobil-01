import { notFound } from "next/navigation";
import { getActiveTenantId } from "@/lib/tenant/current";
import { getCarForEdit, listUnitsByCar } from "@/lib/repo";
import { CarForm, type CarFormState } from "../CarForm";
import { UnitsManager } from "./UnitsManager";

export const dynamic = "force-dynamic";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenantId = await getActiveTenantId();
  const data = await getCarForEdit(tenantId, id);
  if (!data) notFound();

  const { car, images } = data;
  // Physical units (plates) of this model — admin manages them here and sees
  // which plate is currently out and with whom.
  const units = car.trackUnits ? await listUnitsByCar(tenantId, car.id) : [];
  const byKind = (k: string) => images.find((i) => i.kind === k)?.url ?? "";
  const initial: CarFormState = {
    slug: car.slug,
    name: car.name,
    brand: car.brand,
    category: car.category,
    color: car.color ?? "",
    capacity: String(car.capacity),
    transmission: car.transmission,
    fuel: car.fuel ?? "",
    year: car.year != null ? String(car.year) : "",
    rateSelfDrive: String(car.rateSelfDrive),
    rateWithDriver: String(car.rateWithDriver),
    deposit: String(car.deposit),
    available: car.available,
    driverRequired: car.driverRequired,
    trackUnits: car.trackUnits,
    unitCount: String(car.unitCount),
    features: car.features ?? [],
    doors: car.doors != null ? String(car.doors) : "",
    luggage: car.luggage != null ? String(car.luggage) : "",
    plate: car.plate ?? "",
    exterior: byKind("exterior"),
    side: byKind("side"),
    interior: byKind("interior"),
  };
  return (
    <div className="flex flex-col gap-8">
      <CarForm carId={car.id} initial={initial} />
      {car.trackUnits && <UnitsManager carId={car.id} units={units} />}
    </div>
  );
}
