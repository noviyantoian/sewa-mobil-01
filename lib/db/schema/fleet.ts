import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createdAt, pk } from "./_shared";
import { tenants } from "./tenancy";

export type CarCategory = "mpv" | "suv" | "citycar" | "premium" | "ev";
export type CarTransmission = "auto" | "manual";
export type CarImageKind = "exterior" | "side" | "interior" | "gallery";
export type LocationType = "office" | "airport" | "hotel" | "other";
export type DriverStatus = "idle" | "assigned" | "off";

/** Rental fleet. Mirrors lib/mock/cars.ts; rates/deposit in IDR (integer). */
export const cars = pgTable(
  "cars",
  {
    id: pk(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    category: text("category").$type<CarCategory>().notNull(),
    color: text("color"),
    capacity: integer("capacity").notNull().default(4),
    transmission: text("transmission")
      .$type<CarTransmission>()
      .notNull()
      .default("auto"),
    fuel: text("fuel"),
    year: integer("year"),
    rateSelfDrive: integer("rate_self_drive").notNull().default(0),
    rateWithDriver: integer("rate_with_driver").notNull().default(0),
    deposit: integer("deposit").notNull().default(0),
    available: boolean("available").notNull().default(true),
    /** Customer never sees plates — a model is an inventory of N identical units. */
    unitCount: integer("unit_count").notNull().default(1),
    /**
     * When true, availability is enforced by stock: a model is bookable for a
     * window only if `unit_count − overlapping bookings > 0`. When false (legacy
     * default) the model always shows and the customer confirms manually.
     */
    trackUnits: boolean("track_units").notNull().default(false),
    /** Cars that cannot be self-driven — booking is locked to with-driver mode. */
    driverRequired: boolean("driver_required").notNull().default(false),
    features: jsonb("features").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    doors: integer("doors"),
    luggage: integer("luggage"),
    plate: text("plate"),
    createdAt: createdAt(),
  },
  (t) => [unique("cars_tenant_slug_uq").on(t.tenantId, t.slug)],
);

/** Car photos (exterior/side/interior/gallery). tenant_id denormalized for RLS. */
export const carImages = pgTable("car_images", {
  id: pk(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  carId: uuid("car_id")
    .notNull()
    .references(() => cars.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  kind: text("kind").$type<CarImageKind>().notNull().default("gallery"),
  sort: integer("sort").notNull().default(0),
});

/** Pickup / delivery points. Mirrors lib/mock/locations.ts. */
export const locations = pgTable("locations", {
  id: pk(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  city: text("city").notNull(),
  area: text("area").notNull(),
  type: text("type").$type<LocationType>().notNull().default("office"),
});

/** Drivers for with-driver mode. Mirrors lib/mock/drivers.ts. */
export const drivers = pgTable("drivers", {
  id: pk(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  experienceYears: integer("experience_years").notNull().default(0),
  rating: numeric("rating", { precision: 3, scale: 2 }),
  city: text("city"),
  status: text("status").$type<DriverStatus>().notNull().default("idle"),
});
