import { getAdminData } from "./_data";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const { cars, bookings, units } = await getAdminData();
  return <DashboardClient cars={cars} bookings={bookings} units={units} />;
}
