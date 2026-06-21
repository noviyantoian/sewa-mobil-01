-- Per-tenant operational settings (jsonb bag, extensible without future migrations).
-- First flag: guestCheckout — allow booking without a customer account.
-- Additive + defaulted so existing rows and inserts keep working.
-- Applied via Supabase MCP (mirrors 0005 style).

alter table tenants add column if not exists settings jsonb not null default '{}'::jsonb;
