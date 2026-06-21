import { and, asc, eq, gte, inArray, type SQL } from "drizzle-orm";
import { withTenant, type Tx } from "@/lib/db";
import {
  carImages,
  cars,
  drivers,
  locations,
  type BookingMode,
  type CarCategory,
  type CarTransmission,
} from "@/lib/db/schema";

export type CarRow = typeof cars.$inferSelect;
export type LocationRow = typeof locations.$inferSelect;
export type DriverRow = typeof drivers.$inferSelect;
export type CarImage = { carId: string; url: string; kind: string; sort: number };

/**
 * UI-facing car: non-null fields + exterior/side/interior image URLs. Shaped to
 * be a drop-in for the old `lib/mock/cars` `Car` type so view components are
 * untouched.
 */
export interface UiCar {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CarCategory;
  color: string;
  capacity: number;
  transmission: CarTransmission;
  fuel: string;
  year: number;
  rateSelfDrive: number;
  rateWithDriver: number;
  deposit: number;
  available: boolean;
  features: string[];
  doors: number | null;
  luggage: number | null;
  exterior: string;
  side: string;
  interior: string;
  images: { url: string; kind: string; sort: number }[];
}

const IMAGE_FALLBACK = "/images/placeholder.webp";

function toUiCar(row: CarRow, imgs: CarImage[]): UiCar {
  const byKind = (k: string) => imgs.find((i) => i.kind === k)?.url;
  const exterior = byKind("exterior") ?? imgs[0]?.url ?? IMAGE_FALLBACK;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category,
    color: row.color ?? "",
    capacity: row.capacity,
    transmission: row.transmission,
    fuel: row.fuel ?? "",
    year: row.year ?? 0,
    rateSelfDrive: row.rateSelfDrive,
    rateWithDriver: row.rateWithDriver,
    deposit: row.deposit,
    available: row.available,
    features: row.features ?? [],
    doors: row.doors,
    luggage: row.luggage,
    exterior,
    side: byKind("side") ?? exterior,
    interior: byKind("interior") ?? exterior,
    images: imgs.map(({ url, kind, sort }) => ({ url, kind, sort })),
  };
}

/** One query for all images of the given cars, grouped by car id. */
async function imagesByCar(
  tx: Tx,
  carIds: string[],
): Promise<Map<string, CarImage[]>> {
  const map = new Map<string, CarImage[]>();
  if (carIds.length === 0) return map;
  const rows = await tx
    .select({
      carId: carImages.carId,
      url: carImages.url,
      kind: carImages.kind,
      sort: carImages.sort,
    })
    .from(carImages)
    .where(inArray(carImages.carId, carIds))
    .orderBy(asc(carImages.sort));
  for (const im of rows) {
    const list = map.get(im.carId) ?? [];
    list.push(im);
    map.set(im.carId, list);
  }
  return map;
}

export interface CarFilters {
  category?: CarCategory | "all";
  transmission?: CarTransmission | "all";
  capacityMin?: number;
  priceMin?: number;
  priceMax?: number;
  mode?: BookingMode;
}

/** Price filter depends on mode (rate column varies) — applied after fetch. */
function applyPriceFilter(rows: UiCar[], f: CarFilters): UiCar[] {
  if (!f.priceMin && !f.priceMax) return rows;
  const rateOf = (c: UiCar) =>
    f.mode === "withDriver" ? c.rateWithDriver : c.rateSelfDrive;
  return rows.filter((c) => {
    const r = rateOf(c);
    if (f.priceMin && r < f.priceMin) return false;
    if (f.priceMax && r > f.priceMax) return false;
    return true;
  });
}

export async function listCars(
  tenantId: string,
  filters: CarFilters = {},
): Promise<UiCar[]> {
  return withTenant(tenantId, async (tx) => {
    const conds: SQL[] = [];
    if (filters.category && filters.category !== "all") {
      conds.push(eq(cars.category, filters.category));
    }
    if (filters.transmission && filters.transmission !== "all") {
      conds.push(eq(cars.transmission, filters.transmission));
    }
    if (filters.capacityMin) {
      conds.push(gte(cars.capacity, filters.capacityMin));
    }
    const rows = await tx
      .select()
      .from(cars)
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(asc(cars.rateSelfDrive));
    const imgMap = await imagesByCar(
      tx,
      rows.map((r) => r.id),
    );
    const ui = rows.map((r) => toUiCar(r, imgMap.get(r.id) ?? []));
    return applyPriceFilter(ui, filters);
  });
}

export async function getCarBySlug(
  tenantId: string,
  slug: string,
): Promise<UiCar | null> {
  return withTenant(tenantId, async (tx) => {
    const [car] = await tx
      .select()
      .from(cars)
      .where(eq(cars.slug, slug))
      .limit(1);
    if (!car) return null;
    const imgMap = await imagesByCar(tx, [car.id]);
    return toUiCar(car, imgMap.get(car.id) ?? []);
  });
}

export async function getCarById(
  tenantId: string,
  id: string,
): Promise<UiCar | null> {
  return withTenant(tenantId, async (tx) => {
    const [car] = await tx.select().from(cars).where(eq(cars.id, id)).limit(1);
    if (!car) return null;
    const imgMap = await imagesByCar(tx, [car.id]);
    return toUiCar(car, imgMap.get(car.id) ?? []);
  });
}

/** Raw car row + images for the admin edit form (includes internal `plate`). */
export async function getCarForEdit(
  tenantId: string,
  id: string,
): Promise<{ car: CarRow; images: CarImage[] } | null> {
  return withTenant(tenantId, async (tx) => {
    const [car] = await tx.select().from(cars).where(eq(cars.id, id)).limit(1);
    if (!car) return null;
    const imgMap = await imagesByCar(tx, [car.id]);
    return { car, images: imgMap.get(car.id) ?? [] };
  });
}

export async function listLocations(tenantId: string): Promise<LocationRow[]> {
  return withTenant(tenantId, (tx) =>
    tx.select().from(locations).orderBy(asc(locations.city), asc(locations.area)),
  );
}

export async function listDrivers(tenantId: string): Promise<DriverRow[]> {
  return withTenant(tenantId, (tx) =>
    tx.select().from(drivers).orderBy(asc(drivers.name)),
  );
}

// ── Writes (admin CMS) ───────────────────────────────────────────────────────

export interface CarImageInput {
  exterior?: string;
  side?: string;
  interior?: string;
}

export interface CarInput {
  slug: string;
  name: string;
  brand: string;
  category: CarCategory;
  color?: string;
  capacity: number;
  transmission: CarTransmission;
  fuel?: string;
  year?: number;
  rateSelfDrive: number;
  rateWithDriver: number;
  deposit: number;
  available: boolean;
  features?: string[];
  doors?: number | null;
  luggage?: number | null;
  plate?: string;
  images?: CarImageInput;
}

/** Insert exterior/side/interior image rows for a car (skips blanks). */
async function writeCarImages(
  tx: Tx,
  tenantId: string,
  carId: string,
  images?: CarImageInput,
): Promise<void> {
  if (!images) return;
  const kinds = ["exterior", "side", "interior"] as const;
  const rows = kinds
    .map((kind) => ({ kind, url: images[kind]?.trim() }))
    .filter((r): r is { kind: (typeof kinds)[number]; url: string } => !!r.url)
    .map((r, sort) => ({ tenantId, carId, url: r.url, kind: r.kind, sort }));
  if (rows.length > 0) await tx.insert(carImages).values(rows);
}

function carColumns(input: CarInput) {
  return {
    slug: input.slug,
    name: input.name,
    brand: input.brand,
    category: input.category,
    color: input.color?.trim() || null,
    capacity: input.capacity,
    transmission: input.transmission,
    fuel: input.fuel?.trim() || null,
    year: input.year ?? null,
    rateSelfDrive: input.rateSelfDrive,
    rateWithDriver: input.rateWithDriver,
    deposit: input.deposit,
    available: input.available,
    features: input.features ?? [],
    doors: input.doors ?? null,
    luggage: input.luggage ?? null,
    plate: input.plate?.trim() || null,
  };
}

export async function createCar(tenantId: string, input: CarInput): Promise<UiCar> {
  return withTenant(tenantId, async (tx) => {
    const [car] = await tx
      .insert(cars)
      .values({ tenantId, ...carColumns(input) })
      .returning();
    await writeCarImages(tx, tenantId, car.id, input.images);
    const imgMap = await imagesByCar(tx, [car.id]);
    return toUiCar(car, imgMap.get(car.id) ?? []);
  });
}

export async function updateCar(
  tenantId: string,
  id: string,
  input: CarInput,
): Promise<UiCar | null> {
  return withTenant(tenantId, async (tx) => {
    const [car] = await tx
      .update(cars)
      .set(carColumns(input))
      .where(eq(cars.id, id))
      .returning();
    if (!car) return null;
    if (input.images) {
      await tx.delete(carImages).where(eq(carImages.carId, id));
      await writeCarImages(tx, tenantId, id, input.images);
    }
    const imgMap = await imagesByCar(tx, [id]);
    return toUiCar(car, imgMap.get(id) ?? []);
  });
}

export async function deleteCar(tenantId: string, id: string): Promise<void> {
  await withTenant(tenantId, (tx) => tx.delete(cars).where(eq(cars.id, id)));
}

export interface DriverInput {
  name: string;
  experienceYears: number;
  rating: number;
  city?: string;
  status: "idle" | "assigned" | "off";
}

function driverColumns(input: DriverInput) {
  return {
    name: input.name,
    experienceYears: input.experienceYears,
    rating: String(input.rating),
    city: input.city?.trim() || null,
    status: input.status,
  };
}

export async function createDriver(
  tenantId: string,
  input: DriverInput,
): Promise<DriverRow> {
  return withTenant(tenantId, async (tx) => {
    const [d] = await tx
      .insert(drivers)
      .values({ tenantId, ...driverColumns(input) })
      .returning();
    return d;
  });
}

export async function updateDriver(
  tenantId: string,
  id: string,
  input: DriverInput,
): Promise<DriverRow | null> {
  return withTenant(tenantId, async (tx) => {
    const [d] = await tx
      .update(drivers)
      .set(driverColumns(input))
      .where(eq(drivers.id, id))
      .returning();
    return d ?? null;
  });
}

export async function deleteDriver(tenantId: string, id: string): Promise<void> {
  await withTenant(tenantId, (tx) => tx.delete(drivers).where(eq(drivers.id, id)));
}

export interface LocationInput {
  city: string;
  area: string;
  type: "office" | "airport" | "hotel" | "other";
}

export async function createLocation(
  tenantId: string,
  input: LocationInput,
): Promise<LocationRow> {
  return withTenant(tenantId, async (tx) => {
    const [l] = await tx
      .insert(locations)
      .values({ tenantId, city: input.city, area: input.area, type: input.type })
      .returning();
    return l;
  });
}

export async function updateLocation(
  tenantId: string,
  id: string,
  input: LocationInput,
): Promise<LocationRow | null> {
  return withTenant(tenantId, async (tx) => {
    const [l] = await tx
      .update(locations)
      .set({ city: input.city, area: input.area, type: input.type })
      .where(eq(locations.id, id))
      .returning();
    return l ?? null;
  });
}

export async function deleteLocation(tenantId: string, id: string): Promise<void> {
  await withTenant(tenantId, (tx) => tx.delete(locations).where(eq(locations.id, id)));
}
