import { eq } from "drizzle-orm";
import { withTenant } from "@/lib/db";
import { tenants, type TenantSettings } from "@/lib/db/schema";

/**
 * Merge a patch into the active tenant's `settings` jsonb (RLS-scoped via
 * `withTenant`). Read-modify-write keeps unrelated flags intact when a single
 * toggle changes. Returns the merged settings.
 */
export async function updateTenantSettings(
  tenantId: string,
  patch: Partial<TenantSettings>,
): Promise<TenantSettings> {
  return withTenant(tenantId, async (tx) => {
    const [row] = await tx
      .select({ settings: tenants.settings })
      .from(tenants)
      .where(eq(tenants.id, tenantId))
      .limit(1);
    const next: TenantSettings = { ...(row?.settings ?? {}), ...patch };
    await tx.update(tenants).set({ settings: next }).where(eq(tenants.id, tenantId));
    return next;
  });
}
