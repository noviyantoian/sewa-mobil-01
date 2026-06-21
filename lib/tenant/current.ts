import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";

/**
 * Resolve the active tenant id.
 *
 * STAND-IN until Fase 1 host-based resolution (middleware reads the request
 * Host → tenant). For now it returns the demo tenant. Uses the unscoped `db`
 * handle on purpose: a host→tenant lookup has no tenant context yet.
 *
 * Override the target with the DEMO_TENANT_SLUG env var.
 */
const DEV_TENANT_SLUG = process.env.DEMO_TENANT_SLUG ?? "demo";

// SINGLE-TENANT ONLY. Module-level cache persists across requests in a worker —
// safe because the demo tenant id never changes. TODO(Fase 1): delete this whole
// module and resolve host → tenant per request (a stale id here would misroute
// RLS across tenants).
let cached: string | undefined;

export async function getActiveTenantId(): Promise<string> {
  if (cached) return cached;
  const [row] = await db
    .select({ id: tenants.id })
    .from(tenants)
    .where(eq(tenants.slug, DEV_TENANT_SLUG))
    .limit(1);
  if (!row) {
    throw new Error(
      `No tenant for slug "${DEV_TENANT_SLUG}" — seed one first (see lib/db/README.md)`,
    );
  }
  cached = row.id;
  return cached;
}
