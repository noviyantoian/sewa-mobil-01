import { getAdminData } from "../_data";
import { SopirClient } from "./SopirClient";

export const dynamic = "force-dynamic";

export default async function AdminDriversPage() {
  const { drivers, bookings } = await getAdminData();
  return <SopirClient drivers={drivers} bookings={bookings} />;
}
