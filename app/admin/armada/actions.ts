"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { getActiveTenantId } from "@/lib/tenant/current";
import {
  createCar,
  updateCar,
  deleteCar,
  createUnit,
  updateUnit,
  deleteUnit,
} from "@/lib/repo";

// Allow local /images/* (seed) or our own storage origins (Supabase / R2).
// Blocks javascript:/data: and arbitrary external URLs.
const SUPA_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const R2_BASE = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");

function isAllowedImageUrl(u: string): boolean {
  // Local seed paths — reject any `..` traversal segment.
  if (/^\/images\/[a-zA-Z0-9._-]+(?:\/[a-zA-Z0-9._-]+)*$/.test(u) && !u.includes(".."))
    return true;
  // Remote: parse + normalise (collapses `..`, drops query/fragment) before prefix check.
  try {
    const parsed = new URL(u);
    const normalized = parsed.origin + parsed.pathname;
    if (SUPA_BASE && normalized.startsWith(`${SUPA_BASE}/storage/v1/object/public/assets/`))
      return true;
    if (R2_BASE && normalized.startsWith(`${R2_BASE}/`)) return true;
  } catch {
    // not a valid absolute URL
  }
  return false;
}

const idSchema = z.string().uuid();

const imageUrl = z
  .string()
  .max(500)
  .refine(isAllowedImageUrl, "image url not allowed")
  .optional();

const imageSchema = z
  .object({ exterior: imageUrl, side: imageUrl, interior: imageUrl })
  .optional();

const carSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers, dashes"),
  name: z.string().min(1).max(120),
  brand: z.string().min(1).max(80),
  category: z.enum(["mpv", "suv", "citycar", "premium", "ev"]),
  color: z.string().max(40).optional(),
  capacity: z.number().int().min(1).max(60),
  transmission: z.enum(["auto", "manual"]),
  fuel: z.string().max(40).optional(),
  year: z.number().int().min(1990).max(2100).optional(),
  rateSelfDrive: z.number().int().min(0).max(1_000_000_000),
  rateWithDriver: z.number().int().min(0).max(1_000_000_000),
  deposit: z.number().int().min(0).max(1_000_000_000),
  available: z.boolean(),
  driverRequired: z.boolean().optional(),
  trackUnits: z.boolean().optional(),
  unitCount: z.number().int().min(1).max(1000).optional(),
  features: z.array(z.string().min(1).max(40)).max(30).optional(),
  doors: z.number().int().min(0).max(20).nullable().optional(),
  luggage: z.number().int().min(0).max(20).nullable().optional(),
  plate: z.string().max(20).optional(),
  images: imageSchema,
});

export type CarActionResult = { ok: true } | { ok: false; error: string };

function pgCode(e: unknown): string | undefined {
  return e && typeof e === "object" && "code" in e
    ? (e as { code?: string }).code
    : undefined;
}

export async function createCarAction(raw: unknown): Promise<CarActionResult> {
  try {
    await requireAdmin();
    const parsed = carSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "invalid" };
    const tenantId = await getActiveTenantId();
    await createCar(tenantId, parsed.data);
    revalidatePath("/admin/armada");
    revalidatePath("/cari");
    return { ok: true };
  } catch (e) {
    if (pgCode(e) === "23505") return { ok: false, error: "slug_taken" };
    console.error("[createCarAction]", e);
    return { ok: false, error: "failed" };
  }
}

export async function updateCarAction(
  id: string,
  raw: unknown,
): Promise<CarActionResult> {
  try {
    await requireAdmin();
    if (!idSchema.safeParse(id).success) return { ok: false, error: "invalid" };
    const parsed = carSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "invalid" };
    const tenantId = await getActiveTenantId();
    const car = await updateCar(tenantId, id, parsed.data);
    if (!car) return { ok: false, error: "not_found" };
    revalidatePath("/admin/armada");
    revalidatePath("/cari");
    revalidatePath(`/mobil/${parsed.data.slug}`);
    return { ok: true };
  } catch (e) {
    if (pgCode(e) === "23505") return { ok: false, error: "slug_taken" };
    console.error("[updateCarAction]", e);
    return { ok: false, error: "failed" };
  }
}

export async function deleteCarAction(id: string): Promise<CarActionResult> {
  try {
    await requireAdmin();
    if (!idSchema.safeParse(id).success) return { ok: false, error: "invalid" };
    const tenantId = await getActiveTenantId();
    await deleteCar(tenantId, id);
    revalidatePath("/admin/armada");
    revalidatePath("/cari");
    return { ok: true };
  } catch (e) {
    if (pgCode(e) === "23503") return { ok: false, error: "car_in_use" };
    console.error("[deleteCarAction]", e);
    return { ok: false, error: "failed" };
  }
}

// ── Physical units (plates) per car ────────────────────────────────────────

const unitSchema = z.object({
  plate: z.string().min(1).max(20),
  label: z.string().max(60).optional(),
  status: z.enum(["available", "maintenance"]).optional(),
});

function revalidateFleet(): void {
  for (const p of ["/admin/armada", "/admin"]) revalidatePath(p);
}

export async function createUnitAction(
  carId: string,
  raw: unknown,
): Promise<CarActionResult> {
  try {
    await requireAdmin();
    if (!idSchema.safeParse(carId).success) return { ok: false, error: "invalid" };
    const parsed = unitSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "invalid" };
    const tenantId = await getActiveTenantId();
    await createUnit(tenantId, carId, parsed.data);
    revalidateFleet();
    return { ok: true };
  } catch (e) {
    if (pgCode(e) === "23505") return { ok: false, error: "plate_taken" };
    console.error("[createUnitAction]", e);
    return { ok: false, error: "failed" };
  }
}

export async function updateUnitAction(
  id: string,
  raw: unknown,
): Promise<CarActionResult> {
  try {
    await requireAdmin();
    if (!idSchema.safeParse(id).success) return { ok: false, error: "invalid" };
    const parsed = unitSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "invalid" };
    const tenantId = await getActiveTenantId();
    const row = await updateUnit(tenantId, id, parsed.data);
    if (!row) return { ok: false, error: "not_found" };
    revalidateFleet();
    return { ok: true };
  } catch (e) {
    if (pgCode(e) === "23505") return { ok: false, error: "plate_taken" };
    console.error("[updateUnitAction]", e);
    return { ok: false, error: "failed" };
  }
}

export async function deleteUnitAction(id: string): Promise<CarActionResult> {
  try {
    await requireAdmin();
    if (!idSchema.safeParse(id).success) return { ok: false, error: "invalid" };
    const tenantId = await getActiveTenantId();
    await deleteUnit(tenantId, id);
    revalidateFleet();
    return { ok: true };
  } catch (e) {
    if (pgCode(e) === "23503") return { ok: false, error: "unit_in_use" };
    console.error("[deleteUnitAction]", e);
    return { ok: false, error: "failed" };
  }
}
