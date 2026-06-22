import {
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, pk } from "./_shared";
import { tenants } from "./tenancy";
import { carUnits, cars, drivers, locations } from "./fleet";
import { users } from "./auth";

export type BookingMode = "selfDrive" | "withDriver";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";
export type BookingChannel = "web_wa" | "online";
export type PickupType = "office" | "delivery";
export type DocType = "ktp" | "sim" | "passport";
export type VerifyStatus = "pending" | "approved" | "rejected";
export type PaymentGateway = "midtrans" | "manual";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

/**
 * Bookings. `code` is the human-facing id (e.g. FK-26-0001), unique per tenant.
 * `channel` web_wa = order routed to WhatsApp (all tiers); online = Enterprise
 * checkout + gateway. No double-booking enforced in lib/availability.ts.
 */
export const bookings = pgTable(
  "bookings",
  {
    id: pk(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    carId: uuid("car_id").references(() => cars.id),
    /** Specific physical unit (plate) assigned by admin. Null until assigned. */
    carUnitId: uuid("car_unit_id").references(() => carUnits.id),
    userId: uuid("user_id").references(() => users.id),
    driverId: uuid("driver_id").references(() => drivers.id),
    customerName: text("customer_name"),
    customerPhone: text("customer_phone"),
    pickupLocationId: uuid("pickup_location_id").references(() => locations.id),
    returnLocationId: uuid("return_location_id").references(() => locations.id),
    /** Free-text customer address for delivery/pickup (PRD §7 jemput/antar). */
    pickupAddress: text("pickup_address"),
    returnAddress: text("return_address"),
    mode: text("mode").$type<BookingMode>().notNull().default("selfDrive"),
    pickupType: text("pickup_type").$type<PickupType>().notNull().default("office"),
    fromAt: timestamp("from_at", { withTimezone: true }).notNull(),
    toAt: timestamp("to_at", { withTimezone: true }).notNull(),
    total: integer("total").notNull().default(0),
    deposit: integer("deposit").notNull().default(0),
    status: text("status").$type<BookingStatus>().notNull().default("pending"),
    channel: text("channel").$type<BookingChannel>().notNull().default("web_wa"),
    createdAt: createdAt(),
  },
  (t) => [unique("bookings_tenant_code_uq").on(t.tenantId, t.code)],
);

/** Uploaded identity docs (KTP/SIM/passport). Manual admin verification (MVP). */
export const documents = pgTable("documents", {
  id: pk(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  type: text("type").$type<DocType>().notNull(),
  url: text("url").notNull(),
  verifyStatus: text("verify_status")
    .$type<VerifyStatus>()
    .notNull()
    .default("pending"),
  /** Audit trail for manual verification: which admin decided, and when. */
  verifiedBy: text("verified_by"),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: createdAt(),
});

/** Payments — only populated for online channel (Enterprise). amount in IDR. */
export const payments = pgTable("payments", {
  id: pk(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  gateway: text("gateway").$type<PaymentGateway>().notNull().default("manual"),
  amount: integer("amount").notNull().default(0),
  status: text("status").$type<PaymentStatus>().notNull().default("pending"),
  ref: text("ref"),
  createdAt: createdAt(),
});
