"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { getActiveTenantId } from "@/lib/tenant/current";
import { createLocation, updateLocation, deleteLocation } from "@/lib/repo";

const locationSchema = z.object({
  city: z.string().min(1).max(80),
  area: z.string().min(1).max(120),
  type: z.enum(["office", "airport", "hotel", "other"]),
});

export type LocationActionResult = { ok: true } | { ok: false; error: string };

function pgCode(e: unknown): string | undefined {
  return e && typeof e === "object" && "code" in e
    ? (e as { code?: string }).code
    : undefined;
}

function revalidate() {
  revalidatePath("/admin/lokasi");
  revalidatePath("/cari");
}

export async function createLocationAction(
  raw: unknown,
): Promise<LocationActionResult> {
  try {
    await requireAdmin();
    const parsed = locationSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "invalid" };
    await createLocation(await getActiveTenantId(), parsed.data);
    revalidate();
    return { ok: true };
  } catch (e) {
    console.error("[createLocationAction]", e);
    return { ok: false, error: "failed" };
  }
}

export async function updateLocationAction(
  id: string,
  raw: unknown,
): Promise<LocationActionResult> {
  try {
    await requireAdmin();
    if (!id) return { ok: false, error: "invalid" };
    const parsed = locationSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "invalid" };
    const l = await updateLocation(await getActiveTenantId(), id, parsed.data);
    if (!l) return { ok: false, error: "not_found" };
    revalidate();
    return { ok: true };
  } catch (e) {
    console.error("[updateLocationAction]", e);
    return { ok: false, error: "failed" };
  }
}

export async function deleteLocationAction(
  id: string,
): Promise<LocationActionResult> {
  try {
    await requireAdmin();
    if (!id) return { ok: false, error: "invalid" };
    await deleteLocation(await getActiveTenantId(), id);
    revalidate();
    return { ok: true };
  } catch (e) {
    if (pgCode(e) === "23503") return { ok: false, error: "location_in_use" };
    console.error("[deleteLocationAction]", e);
    return { ok: false, error: "failed" };
  }
}
