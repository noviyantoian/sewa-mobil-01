-- Extra car spec fields for the admin detail page. Additive, nullable
-- (features defaults to empty array). Applied via Supabase MCP.

alter table cars add column if not exists features jsonb not null default '[]'::jsonb;
alter table cars add column if not exists doors integer;
alter table cars add column if not exists luggage integer;
alter table cars add column if not exists plate text;
