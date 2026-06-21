-- 0009: unit activity log (audit trail, anti-fraud)
--
-- Every manual unit status change (e.g. send to service, mark service done) is
-- appended here with the deciding admin (`actor`), a note (what service / result),
-- and the from→to states. Append-only — rows are never updated or deleted, so the
-- history can be trusted as evidence. RLS pattern from 0001/0007; grants for
-- app_user come from ALTER DEFAULT PRIVILEGES in 0002.
create table if not exists unit_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  car_unit_id uuid not null references car_units(id) on delete cascade,
  action text not null default 'status_change',
  from_status text,
  to_status text not null,
  note text,
  actor text,
  created_at timestamptz not null default now()
);

create index if not exists unit_events_unit_idx on unit_events (car_unit_id, created_at desc);

alter table unit_events enable row level security;
alter table unit_events force row level security;
drop policy if exists "tenant_isolation" on unit_events;
create policy "tenant_isolation" on unit_events
  using (tenant_id = current_setting('app.tenant_id', true)::uuid)
  with check (tenant_id = current_setting('app.tenant_id', true)::uuid);
