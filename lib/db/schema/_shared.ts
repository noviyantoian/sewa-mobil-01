import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Shared column builders for multi-tenant tables.
 *
 * Every domain table carries a `tenant_id` (added inline per table so the
 * foreign key + cascade are explicit) and is protected by RLS — see
 * `lib/db/migrations/*_rls.sql`. `tenant_id` is always derived server-side
 * from the request host, never from user input.
 */

/** UUID primary key defaulting to `gen_random_uuid()` (built-in since PG13). */
export const pk = () => uuid("id").primaryKey().default(sql`gen_random_uuid()`);

/** `created_at timestamptz not null default now()`. */
export const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
