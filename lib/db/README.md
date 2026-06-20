# lib/db — Data layer (Fase 0)

Multi-tenant Postgres on **Supabase** (project `sewa-mobil` / `nuraugjawzlrlflaqkwk`,
region ap-southeast-1). Drizzle ORM. See [`docs/SAAS-PLAN.md`](../../docs/SAAS-PLAN.md) §6 for the ER model.

## Layout

```
schema/        Drizzle table defs (source of truth for types)
  tenancy.ts   plans, tenants, subscriptions, domains
  auth.ts      users, memberships
  fleet.ts     cars, car_images, locations, drivers
  booking.ts   bookings, documents, payments
  _shared.ts   pk() + createdAt() column builders
index.ts       db (unscoped) + withTenant() (RLS-scoped)
migrations/    0000_*.sql (drizzle), 0001_rls.sql, 0002_app_role.sql (manual)
```

## Tenant isolation (RLS) — how it actually works

1. Every domain table has `tenant_id` + a `tenant_isolation` policy filtering on
   `current_setting('app.tenant_id', true)::uuid`. RLS is **ENABLE + FORCE**.
2. On Supabase the `postgres` connection role has **BYPASSRLS** — connecting as
   it skips every policy. So `withTenant()` does `SET LOCAL ROLE app_user`
   (NOBYPASSRLS) per transaction, then sets `app.tenant_id`. Only then do
   policies bite.
3. `db` (unscoped, runs as `postgres`/bypass) is for platform work with no
   tenant yet — e.g. resolving host → tenant_id from `domains` (Fase 1).
   Tenant data ALWAYS goes through `withTenant()`.

```ts
import { withTenant } from "@/lib/db";
const cars = await withTenant(tenantId, (tx) => tx.select().from(carsTable));
```

`tenantId` comes from the resolved request host, **never** from user input.

## Migration workflow ⚠️

DDL is applied to Supabase via the Supabase MCP `apply_migration` (recorded in
`supabase_migrations`). Drizzle's own migrate tracker is therefore NOT in sync.

- ✅ Edit `schema/*.ts` → `pnpm db:generate` (writes SQL for review) → apply the
  generated SQL to Supabase (MCP) **or** `pnpm db:push` (diff-applies, no-op if
  already in sync).
- ✅ RLS / roles / policies: hand-written SQL (`0001_rls.sql`, `0002_app_role.sql`),
  applied via Supabase. Drizzle does not manage these.
- ❌ Do **not** run `pnpm db:migrate` — it would try to re-apply `0000` (already
  live) and fail on "relation already exists".

`.env`: copy `.env.example` → `.env`, fill `DATABASE_URL` (password from the
Supabase dashboard). Runtime uses the transaction pooler; `db:studio`/`db:push`
use the direct/session connection.

## Next (Fase 0 remainder)

- `lib/repo/*` — repository per aggregate (same shape as `lib/mock/*`, sourced
  from DB via `withTenant`).
- `lib/db/seed.ts` — seed 1 demo tenant from `lib/mock/*` (set `app.tenant_id`
  to the new tenant id before inserting; RLS WITH CHECK enforces it).
- `lib/pricing.ts`, `lib/availability.ts` — domain logic the UI assumes but that
  doesn't exist yet.
