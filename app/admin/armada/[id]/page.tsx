import { notFound } from "next/navigation";
import { getActiveTenantId } from "@/lib/tenant/current";
import { getCarForEdit } from "@/lib/repo";
import { CarForm, type CarFormState } from "../CarForm";

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
    features: car.features ?? [],
    doors: car.doors != null ? String(car.doors) : "",
    luggage: car.luggage != null ? String(car.luggage) : "",
    plate: car.plate ?? "",
    exterior: byKind("exterior"),
    side: byKind("side"),
    interior: byKind("interior"),
  };
  return <CarForm carId={car.id} initial={initial} />;
}
