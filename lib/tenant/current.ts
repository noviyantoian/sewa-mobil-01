import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";

/**
 * Resolve the active tenant id.
 *
 * Deploy model: ONE app instance per client (instance-per-tenant). Each instance
 * is pinned to a single tenant via the `TENANT_SLUG` env, and its database holds
 * exactly that one tenant — so there is no per-request host→tenant resolution to
 * do. Uses the unscoped `db` handle (owner role, BYPASSRLS) because this lookup
 * runs before any tenant context / RLS scope exists.
 *
 * `DEMO_TENANT_SLUG` is kept as a fallback for backward compatibility with
 * existing `.env` files; defaults to "demo".
 */
const TENANT_SLUG =
  process.env.TENANT_SLUG ?? process.env.DEMO_TENANT_SLUG ?? "demo";

// One tenant per instance → the id never changes for the life of the worker, so
// caching it module-level is correct (not a multi-tenant footgun here).
let cached: string | undefined;

export async function getActiveTenantId(): Promise<string> {
  if (cached) return cached;
  const [row] = await db
    .select({ id: tenants.id })
    .from(tenants)
    .where(eq(tenants.slug, TENANT_SLUG))
    .limit(1);
  if (!row) {
    throw new Error(
      `No tenant for slug "${TENANT_SLUG}" — seed one first (see lib/db/README.md)`,
    );
  }
  cached = row.id;
  return cached;
}
