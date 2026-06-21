// Smoke test for location CRUD (repo layer, no auth).
// Run: pnpm exec tsx scripts/smoke-location.ts
import "dotenv/config";
import { getActiveTenantId } from "@/lib/tenant/current";
import {
  createLocation,
  updateLocation,
  deleteLocation,
  listLocations,
} from "@/lib/repo";

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error("FAIL: " + msg);
  console.log("ok  -", msg);
}

async function main(): Promise<void> {
  const tid = await getActiveTenantId();
  const before = (await listLocations(tid)).length;

  const l = await createLocation(tid, {
    city: "Surabaya",
    area: "Test Area",
    type: "office",
  });
  assert(l.city === "Surabaya", "createLocation city");
  assert((await listLocations(tid)).length === before + 1, "listLocations +1");

  const u = await updateLocation(tid, l.id, {
    city: "Surabaya",
    area: "Updated Area",
    type: "airport",
  });
  assert(u?.area === "Updated Area", "updateLocation area");
  assert(u?.type === "airport", "updateLocation type");

  await deleteLocation(tid, l.id);
  assert((await listLocations(tid)).length === before, "deleteLocation baseline");

  console.log("\nALL PASS");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("\n" + (e instanceof Error ? e.message : String(e)));
    process.exit(1);
  });
