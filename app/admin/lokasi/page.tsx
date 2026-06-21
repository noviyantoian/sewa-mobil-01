import { getActiveTenantId } from "@/lib/tenant/current";
import { listLocations } from "@/lib/repo";
import { LokasiClient } from "./LokasiClient";

export const dynamic = "force-dynamic";

export default async function AdminLocationsPage() {
  const tenantId = await getActiveTenantId();
  const locations = await listLocations(tenantId);
  return <LokasiClient locations={locations} />;
}
