import { getAdminData } from "../_data";
import { ArmadaClient } from "./ArmadaClient";

export const dynamic = "force-dynamic";

export default async function AdminFleetPage() {
  const { cars } = await getAdminData();
  return <ArmadaClient cars={cars} />;
}
