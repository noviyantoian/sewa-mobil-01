import { count, desc, eq } from "drizzle-orm";
import { withTenant, type Tx } from "@/lib/db";
import {
  bookings,
  type BookingChannel,
  type BookingMode,
  type PickupType,
} from "@/lib/db/schema";
import { isCarAvailable } from "@/lib/availability";

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
  pickupType?: PickupType;
  channel?: BookingChannel;
  driverId?: string;
  userId?: string;
}

/** Thrown when the requested window overlaps an existing blocking booking. */
export class DoubleBookingError extends Error {
  constructor(public readonly carId: string) {
    super("Car is already booked for the selected dates");
    this.name = "DoubleBookingError";
  }
}

export async function listBookings(tenantId: string): Promise<BookingRow[]> {
  return withTenant(tenantId, (tx) =>
    tx.select().from(bookings).orderBy(desc(bookings.createdAt)),
  );
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
