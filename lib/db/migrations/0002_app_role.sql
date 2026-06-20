-- Runtime role that RLS can enforce against.
--
-- WHY: on Supabase the `postgres` role (used by the app's connection string)
-- has BYPASSRLS, so connecting as it would silently skip every policy. The app
-- connects as `postgres` but does `SET LOCAL ROLE app_user` per transaction
-- (see lib/db/index.ts withTenant) — `app_user` is NOBYPASSRLS and non-owner,
-- so the tenant_isolation policies actually apply.
--
-- Applied via Supabase, outside drizzle's _journal (same as 0001_rls.sql).

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user NOLOGIN NOBYPASSRLS;
  END IF;
END $$;

-- Let the connection role assume app_user via SET ROLE.
GRANT app_user TO postgres;

-- Privileges for the runtime role (current + future tables/sequences).
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO app_user;

-- plans: global catalog (RLS auto-enabled by Supabase, no tenant_id). Allow
-- read for everyone; writes stay owner-only (no write policy).
DROP POLICY IF EXISTS "plans_read_all" ON plans;
CREATE POLICY "plans_read_all" ON plans FOR SELECT USING (true);
