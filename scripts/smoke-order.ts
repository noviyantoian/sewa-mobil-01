// Smoke test for booking status updates (repo layer, no auth).
// Run: pnpm exec tsx scripts/smoke-order.ts
import "dotenv/config";
import { eq } from "drizzle-orm";
import { withTenant } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { getActiveTenantId } from "@/lib/tenant/current";
import {
  getCarBySlug,
  createBooking,
  updateBookingStatus,
  getBookingByCode,
} from "@/lib/repo";

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error("FAIL: " + msg);
  console.log("ok  -", msg);
}

async function main(): Promise<void> {
  const tid = await getActiveTenantId();
  const car = await getCarBySlug(tid, "avanza-silver");
  assert(car, "demo car exists");

  const b = await createBooking(tid, {
    carId: car!.id,
    mode: "selfDrive",
    from: new Date("2026-09-01T08:00:00+07:00"),
    to: new Date("2026-09-03T08:00:00+07:00"),
    customerName: "Order Status Test",
    customerPhone: "+62800-0000-0009",
    total: 700000,
    deposit: 1500000,
  });
  assert(b.status === "pending", "created pending");

  const confirmed = await updateBookingStatus(tid, b.id, "confirmed");
  assert(confirmed?.status === "confirmed", "updateBookingStatus -> confirmed");
  assert((await getBookingByCode(tid, b.code))?.status === "confirmed", "persisted confirmed");

  const cancelled = await updateBookingStatus(tid, b.id, "cancelled");
  assert(cancelled?.status === "cancelled", "updateBookingStatus -> cancelled");

  await withTenant(tid, (tx) => tx.delete(bookings).where(eq(bookings.id, b.id)));
  assert((await getBookingByCode(tid, b.code)) === null, "cleanup deleted");

  console.log("\nALL PASS");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("\n" + (e instanceof Error ? e.message : String(e)));
    process.exit(1);
  });
