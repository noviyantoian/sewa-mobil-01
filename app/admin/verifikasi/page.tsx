import { getAdminData } from "../_data";
import { VerifikasiClient } from "./VerifikasiClient";

export const dynamic = "force-dynamic";

export default async function AdminVerificationPage() {
  const { bookings } = await getAdminData();
  return <VerifikasiClient bookings={bookings} />;
}
