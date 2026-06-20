import { getAdminData } from "../_data";
import { BookingClient } from "./BookingClient";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const { bookings } = await getAdminData();
  return <BookingClient bookings={bookings} />;
}
