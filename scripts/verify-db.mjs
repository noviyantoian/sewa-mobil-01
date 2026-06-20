// Smoke test the real runtime DB path with the local DATABASE_URL.
// Run: node --env-file=.env scripts/verify-db.mjs
//
// Proves: connection works, `SET LOCAL ROLE app_user` drops BYPASSRLS, and the
// tenant_isolation policies scope reads to app.tenant_id.
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing — copy .env.example to .env");
  process.exit(1);
}

const sql = postgres(url, { prepare: false });

const scopedCarCount = (tenantId) =>
  sql.begin(async (tx) => {
    await tx`set local role app_user`;
    await tx`select set_config('app.tenant_id', ${tenantId}, true)`;
    const [{ n }] = await tx`select count(*)::int as n from cars`;
    return n;
  });

try {
  const [{ who }] = await sql`select current_user as who`;
  const [{ id: demoId }] =
    await sql`select id from tenants where slug = 'demo' limit 1`;

  const demoCars = await scopedCarCount(demoId);
  const otherCars = await scopedCarCount("00000000-0000-4000-8000-000000000000");

  console.log(`connected as        : ${who}`);
  console.log(`demo tenant id      : ${demoId}`);
  console.log(`cars (demo ctx)     : ${demoCars}  (expect 10)`);
  console.log(`cars (other ctx)    : ${otherCars}  (expect 0)`);
  console.log(
    demoCars === 10 && otherCars === 0
      ? "PASS — RLS scopes reads to the active tenant"
      : "FAIL — unexpected counts",
  );
} catch (err) {
  console.error("ERROR:", err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
