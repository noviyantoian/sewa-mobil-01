import { count, desc, eq, sql } from "drizzle-orm";
import { withTenant, type Tx } from "@/lib/db";
import {
  bookings,
  cars,
  drivers,
  locations,
  documents,
  type BookingChannel,
  type BookingMode,
  type BookingStatus,
  type PickupType,
  type VerifyStatus,
} from "@/lib/db/schema";
import { availableUnitCount, isCarAvailable } from "@/lib/availability";

export type BookingRow = typeof bookings.$inferSelect;

export interface CreateBookingInput {
  carId: string;
  mode: BookingMode;
  from: Date;
  to: Date;
  customerName: string;
  customerPhone: string;
  total: number;
  deposit: number;
  pickupLocationId?: string;
  returnLocationId?: string;
  pickupAddress?: string;
  returnAddress?: string;
  pickupType?: PickupType;
  channel?: BookingChannel;
  driverId?: string;
  userId?: string;
}

/** Thrown when no unit is free for the requested window (count-based). */
export class DoubleBookingError extends Error {
  constructor(public readonly carId: string) {
    super("Car is already booked for the selected dates");
    this.name = "DoubleBookingError";
  }
}

/** Thrown when a driver-mandatory car is booked in self-drive mode. */
export class DriverRequiredError extends Error {
  constructor(public readonly carId: string) {
    super("This car can only be booked with a driver");
    this.name = "DriverRequiredError";
  }
}

export async function listBookings(tenantId: string): Promise<BookingRow[]> {
  return withTenant(tenantId, (tx) =>
    tx.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(200),
  );
}

export async function listBookingsForDriver(
  tenantId: string,
  driverId: string,
): Promise<BookingRow[]> {
  return withTenant(tenantId, (tx) =>
    tx
      .select()
      .from(bookings)
      .where(eq(bookings.driverId, driverId))
      .orderBy(desc(bookings.createdAt))
      .limit(50),
  );
}

export async function updateBookingStatus(
  tenantId: string,
  bookingId: string,
  status: BookingStatus,
): Promise<BookingRow | null> {
  return withTenant(tenantId, async (tx) => {
    const [row] = await tx
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, bookingId))
      .returning();
    return row ?? null;
  });
}

export async function assignDriver(
  tenantId: string,
  bookingId: string,
  driverId: string,
): Promise<BookingRow | null> {
  return withTenant(tenantId, async (tx) => {
    const [row] = await tx
      .update(bookings)
      .set({ driverId })
      .where(eq(bookings.id, bookingId))
      .returning();
    return row ?? null;
  });
}

/**
 * Tie a booking to a specific physical unit (plate), or clear it with `null`.
 * Lets admin track which exact car went out with which driver.
 */
export async function assignUnit(
  tenantId: string,
  bookingId: string,
  carUnitId: string | null,
): Promise<BookingRow | null> {
  return withTenant(tenantId, async (tx) => {
    const [row] = await tx
      .update(bookings)
      .set({ carUnitId })
      .where(eq(bookings.id, bookingId))
      .returning();
    return row ?? null;
  });
}

export async function getBookingByCode(
  tenantId: string,
  code: string,
): Promise<BookingRow | null> {
  return withTenant(tenantId, async (tx) => {
    const [row] = await tx
      .select()
      .from(bookings)
      .where(eq(bookings.code, code))
      .limit(1);
    return row ?? null;
  });
}

export interface BookingDocument {
  id: string;
  type: string;
  url: string;
  verifyStatus: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
}

export interface BookingDetail {
  booking: BookingRow;
  car: { id: string; slug: string; name: string; brand: string } | null;
  driver: { id: string; name: string } | null;
  pickup: { city: string; area: string } | null;
  ret: { city: string; area: string } | null;
  documents: BookingDocument[];
}

/** Full booking view for the admin detail page (car/driver/locations/docs). */
export async function getBookingDetail(
  tenantId: string,
  code: string,
): Promise<BookingDetail | null> {
  return withTenant(tenantId, async (tx) => {
    const [b] = await tx
      .select()
      .from(bookings)
      .where(eq(bookings.code, code))
      .limit(1);
    if (!b) return null;

    const car = b.carId
      ? ((
          await tx
            .select({ id: cars.id, slug: cars.slug, name: cars.name, brand: cars.brand })
            .from(cars)
            .where(eq(cars.id, b.carId))
            .limit(1)
        )[0] ?? null)
      : null;
    const driver = b.driverId
      ? ((
          await tx
            .select({ id: drivers.id, name: drivers.name })
            .from(drivers)
            .where(eq(drivers.id, b.driverId))
            .limit(1)
        )[0] ?? null)
      : null;
    const pickup = b.pickupLocationId
      ? ((
          await tx
            .select({ city: locations.city, area: locations.area })
            .from(locations)
            .where(eq(locations.id, b.pickupLocationId))
            .limit(1)
        )[0] ?? null)
      : null;
    const ret = b.returnLocationId
      ? ((
          await tx
            .select({ city: locations.city, area: locations.area })
            .from(locations)
            .where(eq(locations.id, b.returnLocationId))
            .limit(1)
        )[0] ?? null)
      : null;
    const docRows = await tx
      .select({
        id: documents.id,
        type: documents.type,
        url: documents.url,
        verifyStatus: documents.verifyStatus,
        verifiedBy: documents.verifiedBy,
        verifiedAt: documents.verifiedAt,
      })
      .from(documents)
      .where(eq(documents.bookingId, b.id));
    const docs: BookingDocument[] = docRows.map((d) => ({
      ...d,
      verifiedAt: d.verifiedAt ? d.verifiedAt.toISOString() : null,
    }));

    return { booking: b, car, driver, pickup, ret, documents: docs };
  });
}

/**
 * Approve/reject an uploaded identity document. Records the deciding admin
 * (`verifiedBy`) + timestamp for the audit trail; clears both when reset to
 * pending.
 */
export async function updateDocumentStatus(
  tenantId: string,
  docId: string,
  status: VerifyStatus,
  verifiedBy: string | null,
): Promise<boolean> {
  const decided = status !== "pending";
  return withTenant(tenantId, async (tx) => {
    const [row] = await tx
      .update(documents)
      .set({
        verifyStatus: status,
        verifiedBy: decided ? verifiedBy : null,
        verifiedAt: decided ? new Date() : null,
      })
      .where(eq(documents.id, docId))
      .returning({ id: documents.id });
    return !!row;
  });
}

/**
 * Units still free for a window. Returns `null` when the model does not track
 * units (admin display should hide the stock badge in that case).
 */
export async function getAvailableUnits(
  tenantId: string,
  carId: string,
  from: Date,
  to: Date,
): Promise<number | null> {
  return withTenant(tenantId, async (tx) => {
    const n = await availableUnitCount(tx, carId, from, to);
    return Number.isFinite(n) ? n : null;
  });
}

/** Per-tenant booking code: FK-YY-NNNN. count() is RLS-scoped to this tenant. */
async function nextBookingCode(tx: Tx): Promise<string> {
  const [{ n }] = await tx.select({ n: count() }).from(bookings);
  const yy = String(new Date().getFullYear()).slice(2);
  return `FK-${yy}-${String(n + 1).padStart(4, "0")}`;
}

/**
 * Create a booking, guarding against double-booking in the same transaction.
 * `tenantId` matches the RLS `app.tenant_id` set by `withTenant`, so the
 * WITH CHECK policy passes.
 */
export async function createBooking(
  tenantId: string,
  input: CreateBookingInput,
): Promise<BookingRow> {
  return withTenant(tenantId, async (tx) => {
    // Serialize concurrent booking creation per tenant so the availability
    // check + insert are atomic (READ COMMITTED otherwise lets two overlapping
    // requests both pass). Also prevents duplicate `code` from the count below.
    // Released automatically at transaction end; pgBouncer-safe (xact-scoped).
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${tenantId}))`);

    // Driver-mandatory cars can never be self-driven, whoever creates the
    // booking. The admin still assigns the actual driver manually afterwards
    // (we never auto-assign — availability must be checked by a human).
    const [carRow] = await tx
      .select({ driverRequired: cars.driverRequired })
      .from(cars)
      .where(eq(cars.id, input.carId))
      .limit(1);
    if (carRow?.driverRequired && input.mode === "selfDrive") {
      throw new DriverRequiredError(input.carId);
    }

    const available = await isCarAvailable(
      tx,
      input.carId,
      input.from,
      input.to,
    );
    if (!available) throw new DoubleBookingError(input.carId);

    const code = await nextBookingCode(tx);
    const [row] = await tx
      .insert(bookings)
      .values({
        tenantId,
        code,
        carId: input.carId,
        userId: input.userId,
        driverId: input.driverId,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        pickupLocationId: input.pickupLocationId,
        returnLocationId: input.returnLocationId,
        pickupAddress: input.pickupAddress?.trim() || null,
        returnAddress: input.returnAddress?.trim() || null,
        mode: input.mode,
        pickupType: input.pickupType ?? "office",
        channel: input.channel ?? "web_wa",
        fromAt: input.from,
        toAt: input.to,
        total: input.total,
        deposit: input.deposit,
        status: "pending",
      })
      .returning();
    return row;
  });
}
