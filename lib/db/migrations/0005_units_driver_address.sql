-- Multi-unit inventory + driver-required cars + customer pickup/return address.
-- Additive, all defaulted/nullable so existing rows and inserts keep working.
-- Applied via Supabase MCP (mirrors 0004 style).

-- cars: a model is now an inventory of N identical units. Customers never see
-- plates; availability (when track_units) = unit_count − overlapping bookings.
alter table cars add column if not exists unit_count integer not null default 1;
alter table cars add column if not exists track_units boolean not null default false;
alter table cars add column if not exists driver_required boolean not null default false;

-- bookings: free-text customer pickup / return address (jemput-antar).
alter table bookings add column if not exists pickup_address text;
alter table bookings add column if not exists return_address text;
