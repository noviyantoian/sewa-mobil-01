// Smoke test for driver CRUD + assignDriver (repo layer, no auth).
// Run: pnpm exec tsx scripts/smoke-driver.ts
import "dotenv/config";
import { eq } from "drizzle-orm";
import { withTenant } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { getActiveTenantId } from "@/lib/tenant/current";
import {
  createDriver,
  updateDriver,
  deleteDriver,
  listDrivers,
  getCarBySlug,
  createBooking,
  assignDriver,
  getBookingByCode,
} from "@/lib/repo";

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error("FAIL: " + msg);
  console.log("ok  -", msg);
}

async function main(): Promise<void> {
  const tid = await getActiveTenantId();
  const before = (await listDrivers(tid)).length;

  const d = await createDriver(tid, {
    name: "Test Driver",
    experienceYears: 3,
    rating: 4.7,
    city: "Jakarta",
    status: "idle",
  });
  assert(d.name === "Test Driver", "createDriver name");
  assert(Number(d.rating) === 4.7, "createDriver rating");
  assert((await listDrivers(tid)).length === before + 1, "listDrivers +1");

  const u = await updateDriver(tid, d.id, {
    name: "Test Driver 2",
    experienceYears: 5,
    rating: 4.9,
    city: "Bali",
    status: "off",
  });
  assert(u?.name === "Test Driver 2", "updateDriver name");
  assert(u?.status === "off", "updateDriver status");

  // Assign to a fresh booking.
  const car = await getCarBySlug(tid, "innova-zenix");
  const b = await createBooking(tid, {
    carId: car!.id,
    mode: "withDriver",
    from: new Date("2026-10-01T08:00:00+07:00"),
    to: new Date("2026-10-03T08:00:00+07:00"),
    customerName: "Driver Assign Test",
    customerPhone: "+62800-0000-0010",
    total: 1,
    deposit: 1,
  });
  const assigned = await assignDriver(tid, b.id, d.id);
  assert(assigned?.driverId === d.id, "assignDriver sets driverId");
  assert((await getBookingByCode(tid, b.code))?.driverId === d.id, "assignDriver persisted");

  // Cleanup booking first (FK), then driver.
  await withTenant(tid, (tx) => tx.delete(bookings).where(eq(bookings.id, b.id)));
  await deleteDriver(tid, d.id);
  assert((await listDrivers(tid)).length === before, "deleteDriver back to baseline");

  console.log("\nALL PASS");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("\n" + (e instanceof Error ? e.message : String(e)));
    process.exit(1);
  });
