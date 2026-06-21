import { getActiveTenantId } from "@/lib/tenant/current";
import { listMembers, getSeatInfo } from "@/lib/repo";
import { PenggunaClient } from "./PenggunaClient";

export const dynamic = "force-dynamic";

export default async function PenggunaPage() {
  const tenantId = await getActiveTenantId();
  const [members, seat] = await Promise.all([
    listMembers(tenantId),
    getSeatInfo(tenantId),
  ]);
  return <PenggunaClient members={members} seat={seat} />;
}
