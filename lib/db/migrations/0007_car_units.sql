-- Per-unit plate registry. A car model is an inventory of N physical units, each
-- with a distinct plate (nomor polisi). Admin can see which specific unit went
-- out with which driver by tying a booking to a unit.
--
-- Additive: existing cars keep working (unit registry optional). `bookings.car_unit_id`
-- is nullable — only set when admin assigns a specific unit at the detail page.
--
-- Applied via Supabase MCP (mirrors 0005 style). RLS pattern from 0001; grants for
-- app_user come from ALTER DEFAULT PRIVILEGES in 0002 (postgres owns new tables).

create table if not exists car_units (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  car_id uuid not null references cars(id) on delete cascade,
  plate text not null,
  label text,
  -- 'available' (bookable) | 'maintenance' (manually parked). "out/running" is
  -- derived live from an active/confirmed booking that points at this unit.
  status text not null default 'available',
  created_at timestamptz not null default now()
);

create index if not exists car_units_car_idx on car_units (car_id);

alter table bookings add column if not exists car_unit_id uuid references car_units(id);

-- Tenant isolation (FORCE so the owner connection is subject to it too).
alter table car_units enable row level security;
alter table car_units force row level security;
drop policy if exists "tenant_isolation" on car_units;
create policy "tenant_isolation" on car_units
  using (tenant_id = current_setting('app.tenant_id', true)::uuid)
  with check (tenant_id = current_setting('app.tenant_id', true)::uuid);
