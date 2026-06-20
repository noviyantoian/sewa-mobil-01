import { and, asc, eq, gte, type SQL } from "drizzle-orm";
import { withTenant } from "@/lib/db";
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

export type CarImage = { url: string; kind: string; sort: number };
/** A car plus its images, with exterior/side/interior shortcuts (mock-compatible). */
export type CarWithImages = CarRow & {
  images: CarImage[];
  exterior?: string;
  side?: string;
  interior?: string;
};

export interface CarFilters {
  category?: CarCategory | "all";
  transmission?: CarTransmission | "all";
  capacityMin?: number;
  priceMin?: number;
  priceMax?: number;
  mode?: BookingMode;
}

function withImageShortcuts(car: CarRow, imgs: CarImage[]): CarWithImages {
  const byKind = (k: string) => imgs.find((i) => i.kind === k)?.url;
  return {
    ...car,
    images: imgs,
    exterior: byKind("exterior"),
    side: byKind("side"),
    interior: byKind("interior"),
  };
}

/** Price filter depends on mode (rate column varies) — applied after fetch. */
function applyPriceFilter(rows: CarRow[], f: CarFilters): CarRow[] {
  if (!f.priceMin && !f.priceMax) return rows;
  const rateOf = (c: CarRow) =>
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
): Promise<CarRow[]> {
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
    return applyPriceFilter(rows, filters);
  });
}

export async function getCarBySlug(
  tenantId: string,
  slug: string,
): Promise<CarWithImages | null> {
  return withTenant(tenantId, async (tx) => {
    const [car] = await tx
      .select()
      .from(cars)
      .where(eq(cars.slug, slug))
      .limit(1);
    if (!car) return null;
    const imgs = await tx
      .select({ url: carImages.url, kind: carImages.kind, sort: carImages.sort })
      .from(carImages)
      .where(eq(carImages.carId, car.id))
      .orderBy(asc(carImages.sort));
    return withImageShortcuts(car, imgs);
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
