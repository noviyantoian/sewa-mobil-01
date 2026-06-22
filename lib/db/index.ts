import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set — copy .env.example to .env and fill it");
}

/**
 * Reuse one postgres.js client across HMR reloads in dev so we don't exhaust
 * the connection pool. `prepare: false` is harmless on a direct native Postgres
 * connection (and was required for the legacy Supabase transaction pooler).
 */
const globalForDb = globalThis as unknown as {
  __sqlClient?: ReturnType<typeof postgres>;
};
const client = globalForDb.__sqlClient ?? postgres(url, { prepare: false });
if (process.env.NODE_ENV !== "production") globalForDb.__sqlClient = client;

/**
 * Unscoped handle, connected as the owner role (`folkadrive`, BYPASSRLS — the
 * native mirror of Supabase's `postgres`). Use ONLY for bootstrap work that has
 * no tenant context yet — e.g. `getActiveTenantId` reading `tenants` by slug.
 * NOT for tenant data (that goes through withTenant → app_user).
 */
export const db = drizzle(client, { schema });
export type Db = typeof db;

/** The transaction handle drizzle hands to `db.transaction`'s callback. */
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

/**
 * Run `fn` inside a transaction scoped to one tenant. Two transaction-local
 * settings make RLS actually bite:
 *  - `SET LOCAL ROLE app_user` — drops BYPASSRLS (the `postgres` connection
 *    role bypasses RLS; `app_user` does not), so policies are enforced.
 *  - `app.tenant_id` GUC — what every `tenant_isolation` policy filters on.
 *
 * `tenantId` MUST be derived server-side from the resolved request host —
 * never from user input. All tenant-scoped reads/writes go through here.
 */
export async function withTenant<T>(
  tenantId: string,
  fn: (tx: Tx) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`set local role app_user`);
    await tx.execute(sql`select set_config('app.tenant_id', ${tenantId}, true)`);
    return fn(tx);
  });
}
