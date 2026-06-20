import { getAdminData } from "../_data";
import { KalenderClient } from "./KalenderClient";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const { cars, bookings } = await getAdminData();
  return <KalenderClient cars={cars} bookings={bookings} />;
}
