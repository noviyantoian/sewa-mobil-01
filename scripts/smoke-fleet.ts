// Smoke test for fleet CRUD repo functions (no auth — repo layer only).
// Run: pnpm exec tsx scripts/smoke-fleet.ts
import "dotenv/config";
import { getActiveTenantId } from "@/lib/tenant/current";
import {
  createCar,
  updateCar,
  deleteCar,
  getCarBySlug,
  listCars,
} from "@/lib/repo";

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error("FAIL: " + msg);
  console.log("ok  -", msg);
}

const SLUG = "zz-test-crud";

async function main(): Promise<void> {
  const tid = await getActiveTenantId();

  // Clean any leftover from a prior failed run.
  const leftover = await getCarBySlug(tid, SLUG);
  if (leftover) await deleteCar(tid, leftover.id);

  const before = (await listCars(tid)).length;

  const created = await createCar(tid, {
    slug: SLUG,
    name: "Test Car",
    brand: "TestBrand",
    category: "suv",
    color: "Black",
    capacity: 7,
    transmission: "auto",
    fuel: "Diesel",
    year: 2025,
    rateSelfDrive: 500000,
    rateWithDriver: 800000,
    deposit: 2000000,
    available: true,
    images: {
      exterior: "/images/x-ext.webp",
      side: "/images/x-side.webp",
      interior: "/images/x-int.webp",
    },
  });
  assert(created.slug === SLUG, "createCar returns slug");
  assert(created.exterior === "/images/x-ext.webp", "createCar writes exterior image");
  assert(created.interior === "/images/x-int.webp", "createCar writes interior image");
  assert(created.rateSelfDrive === 500000, "createCar rate");
  assert((await listCars(tid)).length === before + 1, "listCars count +1");

  const updated = await updateCar(tid, created.id, {
    slug: SLUG,
    name: "Test Car Updated",
    brand: "TestBrand",
    category: "suv",
    color: "White",
    capacity: 7,
    transmission: "auto",
    fuel: "Diesel",
    year: 2025,
    rateSelfDrive: 550000,
    rateWithDriver: 800000,
    deposit: 2000000,
    available: false,
    images: { exterior: "/images/x-ext2.webp" },
  });
  assert(updated?.name === "Test Car Updated", "updateCar name");
  assert(updated?.rateSelfDrive === 550000, "updateCar rate");
  assert(updated?.available === false, "updateCar available=false");
  assert(updated?.exterior === "/images/x-ext2.webp", "updateCar replaced images");
  assert(updated?.side === "/images/x-ext2.webp", "updateCar old side image gone (falls back)");

  await deleteCar(tid, created.id);
  assert((await getCarBySlug(tid, SLUG)) === null, "deleteCar removed");
  assert((await listCars(tid)).length === before, "listCars count back to baseline");

  console.log("\nALL PASS");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("\n" + (e instanceof Error ? e.message : String(e)));
    process.exit(1);
  });
