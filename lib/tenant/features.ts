import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tenants, type TenantSettings } from "@/lib/db/schema";
import { getActiveTenantId } from "./current";

/**
 * Resolved tenant settings with every flag defaulted — callers never deal with
 * `undefined`. Absent `guestCheckout` means booking-without-account is allowed
 * (the friction-free default most owners want).
 */
export type ResolvedTenantSettings = {
  guestCheckout: boolean;
};

const DEFAULTS: ResolvedTenantSettings = {
  guestCheckout: true,
};

function resolve(raw: TenantSettings | null | undefined): ResolvedTenantSettings {
  return {
    guestCheckout: raw?.guestCheckout ?? DEFAULTS.guestCheckout,
  };
}

/** Read + default a tenant's settings by id. Uses the unscoped `db` handle on
 * purpose: settings are read in contexts (root layout) before RLS role setup. */
export async function getTenantSettings(
  tenantId: string,
): Promise<ResolvedTenantSettings> {
  const [row] = await db
    .select({ settings: tenants.settings })
    .from(tenants)
    .where(eq(tenants.id, tenantId))
    .limit(1);
  return resolve(row?.settings);
}

/** Settings for the active (host-resolved) tenant. */
export async function getActiveTenantSettings(): Promise<ResolvedTenantSettings> {
  const tenantId = await getActiveTenantId();
  return getTenantSettings(tenantId);
}
