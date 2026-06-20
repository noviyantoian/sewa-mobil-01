// Runtime smoke test for the repository + pricing + availability layer.
// Run: pnpm exec tsx scripts/smoke-repo.ts   (loads .env via dotenv/config)
//
// Creates one booking to exercise createBooking + the double-booking guard,
// then deletes it so the demo tenant stays clean.
import "dotenv/config";
import { eq } from "drizzle-orm";
import { withTenant } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { getActiveTenantId } from "@/lib/tenant/current";
import {
  createBooking,
  DoubleBookingError,
  getBookingByCode,
  getCarBySlug,
  listCars,
  listDrivers,
  listLocations,
} from "@/lib/repo";
import { calcPrice } from "@/lib/pricing";

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error("FAIL: " + msg);
  console.log("ok  -", msg);
}

async function main(): Promise<void> {
  const tid = await getActiveTenantId();
  console.log("tenant:", tid, "\n");

  const cars = await listCars(tid);
  assert(cars.length === 10, `listCars -> 10 (got ${cars.length})`);
  assert(
    (await listCars(tid, { category: "ev" })).length === 2,
    "listCars{category:ev} -> 2",
  );

  const car = await getCarBySlug(tid, "avanza-silver");
  assert(!!car, "getCarBySlug avanza-silver");
  assert(!!car?.exterior && !!car?.interior, "image shortcuts present");
  assert((await listLocations(tid)).length === 6, "listLocations -> 6");
  assert((await listDrivers(tid)).length === 4, "listDrivers -> 4");

  const from = new Date("2026-07-10T08:00:00+07:00");
  const to = new Date("2026-07-13T08:00:00+07:00");
  const price = calcPrice(car!, "selfDrive", from, to);
  assert(price.days === 3, `price.days -> 3 (got ${price.days})`);
  assert(price.subtotal === 3 * car!.rateSelfDrive, "subtotal = days × rate");
  assert(
    price.grandTotal === price.subtotal + car!.deposit,
    "grandTotal = subtotal + deposit",
  );

  let createdId: string | undefined;
  try {
    const b = await createBooking(tid, {
      carId: car!.id,
      mode: "selfDrive",
      from,
      to,
      customerName: "Smoke Test",
      customerPhone: "+62800-0000-0000",
      total: price.subtotal,
      deposit: price.deposit,
    });
    createdId = b.id;
    assert(b.status === "pending", "booking created (pending)");
    assert(/^FK-\d{2}-\d{4}$/.test(b.code), `code format -> ${b.code}`);
    assert((await getBookingByCode(tid, b.code))?.id === b.id, "getByCode roundtrip");

    let rejected = false;
    try {
      await createBooking(tid, {
        carId: car!.id,
        mode: "selfDrive",
        from: new Date("2026-07-11T08:00:00+07:00"),
        to: new Date("2026-07-12T08:00:00+07:00"),
        customerName: "Overlap",
        customerPhone: "+62800-0000-0001",
        total: 1,
        deposit: 1,
      });
    } catch (e) {
      rejected = e instanceof DoubleBookingError;
    }
    assert(rejected, "overlapping booking rejected (DoubleBookingError)");
  } finally {
    if (createdId) {
      await withTenant(tid, (tx) =>
        tx.delete(bookings).where(eq(bookings.id, createdId!)),
      );
      console.log("cleanup - deleted test booking");
    }
  }

  console.log("\nALL PASS");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("\n" + (e instanceof Error ? e.message : String(e)));
    process.exit(1);
  });
