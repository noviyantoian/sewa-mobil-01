-- One-time role bootstrap for a NATIVE Postgres cluster (run as a superuser).
--   psql -U postgres -f scripts/db/bootstrap-roles.sql
--
-- Roles are cluster-wide, so this runs ONCE per Postgres server — not per client
-- database. It recreates the two-role model FolkaDrive relied on under Supabase:
--
--   * app_user  — the RLS-bound runtime role. NOLOGIN, NOBYPASSRLS. withTenant()
--                 does `SET LOCAL ROLE app_user` per transaction so the
--                 tenant_isolation policies actually enforce.
--   * folkadrive — the LOGIN role the app + migrate runner connect as
--                 (DATABASE_URL). BYPASSRLS mirrors Supabase's `postgres`: it
--                 owns the tables, runs migrations, and lets the unscoped `db`
--                 handle do host→tenant bootstrap reads before any tenant
--                 context exists. Tenant data always drops to app_user.
--
-- Per client afterwards (as superuser), then run the migrate script:
--   CREATE DATABASE klien_a OWNER folkadrive;
--   DATABASE_URL=postgres://folkadrive:***@localhost:5432/klien_a \
--     node --env-file=.env scripts/migrate.mjs

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user NOLOGIN NOBYPASSRLS;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'folkadrive') THEN
    -- Set a strong password before running, or ALTER ROLE ... PASSWORD after.
    CREATE ROLE folkadrive LOGIN BYPASSRLS PASSWORD 'CHANGE_ME_STRONG';
  END IF;
END $$;

-- folkadrive may assume app_user (SET LOCAL ROLE) and re-grant it inside
-- migration 0002 (which also grants table privileges to app_user per database).
GRANT app_user TO folkadrive WITH ADMIN OPTION;
