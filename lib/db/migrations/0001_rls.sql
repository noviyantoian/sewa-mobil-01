-- Row Level Security — tenant isolation.
--
-- Applied via Supabase (recorded in supabase_migrations), NOT via
-- `drizzle-kit migrate` — it is intentionally outside drizzle's _journal so the
-- two never double-apply. This file is the reproducible source of record.
--
-- Model: every tenant-scoped table is filtered by `app.tenant_id`, a per-request
-- GUC set transaction-locally in lib/db/index.ts `withTenant()`. The 2-arg
-- `current_setting(..., true)` returns NULL when unset, so an unscoped
-- connection sees ZERO rows (deny-by-default) instead of erroring.
--
-- FORCE is required because the runtime connects as the table owner (postgres),
-- and owners bypass plain RLS. FORCE subjects the owner to policies too.
--
-- `plans` is a global catalog (no tenant_id) and is deliberately left without RLS.

-- tenants: a tenant sees only its own row (keyed on id, not tenant_id).
ALTER TABLE "tenants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tenants" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "tenants"
  USING (id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (id = current_setting('app.tenant_id', true)::uuid);

-- All other tenant-scoped tables: keyed on tenant_id.
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subscriptions" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "subscriptions"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

ALTER TABLE "domains" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "domains" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "domains"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "users"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

ALTER TABLE "memberships" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "memberships" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "memberships"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

ALTER TABLE "cars" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cars" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "cars"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

ALTER TABLE "car_images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "car_images" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "car_images"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

ALTER TABLE "locations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "locations" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "locations"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

ALTER TABLE "drivers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "drivers" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "drivers"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bookings" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "bookings"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "documents" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "documents"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "payments"
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
