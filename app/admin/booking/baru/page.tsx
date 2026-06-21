import { getActiveTenantId } from "@/lib/tenant/current";
import { listCars, listDrivers, listLocations } from "@/lib/repo";
import {
  ManualBookingForm,
  type ManualCar,
  type ManualOption,
} from "../ManualBookingForm";

export const dynamic = "force-dynamic";

export default async function NewBookingPage() {
  const tenantId = await getActiveTenantId();
  const [cars, drivers, locations] = await Promise.all([
    listCars(tenantId),
    listDrivers(tenantId),
    listLocations(tenantId),
  ]);
  const carOpts: ManualCar[] = cars.map((c) => ({
    id: c.id,
    name: c.name,
    brand: c.brand,
    rateSelfDrive: c.rateSelfDrive,
    rateWithDriver: c.rateWithDriver,
    deposit: c.deposit,
    driverRequired: c.driverRequired,
    trackUnits: c.trackUnits,
  }));
  const driverOpts: ManualOption[] = drivers.map((d) => ({ id: d.id, label: d.name }));
  const locOpts: ManualOption[] = locations.map((l) => ({
    id: l.id,
    label: `${l.city} — ${l.area}`,
  }));
  return <ManualBookingForm cars={carOpts} drivers={driverOpts} locations={locOpts} />;
}
