-- Supabase Storage bucket for uploaded images (cars, marketing).
-- Applied via Supabase MCP. Public read; authenticated (admin) can write.
-- The app uploads through the upload route as the logged-in admin session;
-- when R2_* env is set, uploads go to Cloudflare R2 instead and this is unused.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('assets', 'assets', true, 5242880,
  array['image/png','image/jpeg','image/webp','image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "assets_insert_authenticated" on storage.objects;
create policy "assets_insert_authenticated" on storage.objects
  for insert to authenticated with check (bucket_id = 'assets');

drop policy if exists "assets_update_authenticated" on storage.objects;
create policy "assets_update_authenticated" on storage.objects
  for update to authenticated using (bucket_id = 'assets') with check (bucket_id = 'assets');

drop policy if exists "assets_delete_authenticated" on storage.objects;
create policy "assets_delete_authenticated" on storage.objects
  for delete to authenticated using (bucket_id = 'assets');
