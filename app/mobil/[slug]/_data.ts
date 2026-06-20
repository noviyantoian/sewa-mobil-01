import { cache } from "react";
import { getActiveTenantId } from "@/lib/tenant/current";
import { getCarBySlug } from "@/lib/repo";

/**
 * Request-deduped car lookup. layout (metadata + JSON-LD) and page all need the
 * same car; `cache()` collapses them into one DB round-trip per request.
 */
export const getCarForRequest = cache(async (slug: string) => {
  const tenantId = await getActiveTenantId();
  return getCarBySlug(tenantId, slug);
});
