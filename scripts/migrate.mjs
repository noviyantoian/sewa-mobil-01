// Deterministic migration runner for a NATIVE Postgres database.
// Run: node --env-file=.env scripts/migrate.mjs
//
// Why this exists: migrations 0001–0009 were hand-applied through the Supabase
// MCP and are NOT in drizzle's `_journal.json` (only 0000 is), so
// `drizzle-kit migrate` would apply just 0000. This runner applies every
// `lib/db/migrations/*.sql` in filename order against DATABASE_URL, tracking
// what ran in a `__migrations` table so re-runs are safe.
//
// Supabase-only migrations are skipped (see DENYLIST) — on a native deploy
// storage is Cloudflare R2, so the `storage.*` bucket/policy migration does not
// apply.
//
// Prerequisite: scripts/db/bootstrap-roles.sql must have run once (as a
// superuser) to create the `app_user` + owner roles and make the owner a member
// of app_user, so the app's `SET LOCAL ROLE app_user` works. This runner only
// applies schema.
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing — copy .env.example to .env");
  process.exit(1);
}

// Supabase-specific migrations that must NOT run on a native Postgres DB.
// 0003 provisions a Supabase Storage bucket (storage.buckets / storage.objects,
// role `authenticated`) — native deploys use R2 instead.
const DENYLIST = new Set(["0003_storage_assets.sql"]);

const MIGRATIONS_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "lib",
  "db",
  "migrations",
);

// Quiet the expected `DROP ... IF EXISTS` NOTICEs (first run on a fresh DB) so
// the apply log stays readable; real errors still throw.
const sql = postgres(url, { prepare: false, max: 1, onnotice: () => {} });

async function appliedSet() {
  await sql`create table if not exists __migrations (
    name text primary key,
    applied_at timestamptz not null default now()
  )`;
  const rows = await sql`select name from __migrations`;
  return new Set(rows.map((r) => r.name));
}

try {
  const all = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith(".sql"))
    .sort();
  const done = await appliedSet();

  let applied = 0;
  for (const file of all) {
    if (DENYLIST.has(file)) {
      console.log(`skip   ${file}  (Supabase-only — storage is R2 on native)`);
      continue;
    }
    if (done.has(file)) {
      console.log(`ok     ${file}  (already applied)`);
      continue;
    }
    const body = await readFile(join(MIGRATIONS_DIR, file), "utf8");
    await sql.begin(async (tx) => {
      await tx.unsafe(body);
      await tx`insert into __migrations (name) values (${file})`;
    });
    console.log(`apply  ${file}`);
    applied += 1;
  }

  console.log(
    applied === 0
      ? "PASS — schema already up to date"
      : `PASS — applied ${applied} migration(s)`,
  );
} catch (err) {
  console.error("ERROR:", err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
