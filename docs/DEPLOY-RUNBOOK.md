# FolkaDrive — Deploy Runbook (per-client, shared VPS)

One VPS hosts many projects. FolkaDrive runs **one instance per client**
(instance-per-tenant): NGINX (TLS) → PM2 Node app → its own native Postgres
database. Everything FolkaDrive creates is namespaced so it never collides with
other projects on the box.

## Conflict-avoidance (what keeps us off other projects' toes)

| Resource | FolkaDrive convention | Why it's safe |
|---|---|---|
| Ports | `39001–39099`, one per client | Uncommon range; `new-client.sh` auto-picks a **free** port (`ss -ltn`) |
| PM2 app name | `folkadrive-<slug>` | Namespaced; script aborts if the name exists |
| Postgres DB | `folkadrive_<slug>` | Per-client database; script aborts if it exists |
| nginx vhost | `folkadrive-<domain>.conf`, exact `server_name`, **no** `default_server` | Only ever serves its own host |
| App bind | `127.0.0.1:<port>` (loopback) | Not exposed publicly; nginx is the only edge |
| Deploy dir | `/var/www/folkadrive/<slug>` | Isolated per client |

**Shared Postgres caveat:** the RLS roles `app_user` (NOBYPASSRLS) and `folkadrive`
(BYPASSRLS owner) are **cluster-wide**. Grants and RLS are per-database, so
sharing the role names across FolkaDrive client DBs is fine. But if **another
project** on the same cluster already defines a role named `app_user` with
different attributes, run FolkaDrive's Postgres on a **dedicated cluster/port**
(e.g. 5433) to avoid surprises. `new-client.sh` re-asserts the correct
attributes each run.

## Prerequisites (once per VPS)

- Node 20.18+ (`--env-file` support), pnpm, PM2, nginx, certbot (`python3-certbot-nginx`), Postgres 16.
- Open ports 80 + 443 (Let's Encrypt HTTP-01 + HTTPS).
- Create the FolkaDrive roles once per Postgres cluster:
  ```bash
  sudo -u postgres psql -f scripts/db/bootstrap-roles.sql
  # then set a real password for the role:
  sudo -u postgres psql -c "ALTER ROLE folkadrive PASSWORD 'A_STRONG_PASSWORD';"
  ```

## Build (once per release)

Build the standalone bundle in the repo on the VPS (or build elsewhere and copy):
```bash
pnpm install
pnpm build
bash scripts/deploy-standalone.sh   # copies static + public into .next/standalone
```
The same build is reused for every client; only the per-client `.env` differs.

## Add a client

```bash
export FOLKADRIVE_DB_PASSWORD='the folkadrive role password'
export ADMIN_EMAIL='owner@klien.com'
export ADMIN_PASSWORD='at-least-8-chars'      # operator-chosen
# storage (required) + optional CDN:
export R2_ACCOUNT_ID=... R2_ACCESS_KEY_ID=... R2_SECRET_ACCESS_KEY=...
export R2_BUCKET=folkadrive-assets R2_PUBLIC_BASE_URL=https://cdn.example.com
export CERTBOT_EMAIL='you@folkastudio.com'    # optional: auto-issue TLS

scripts/new-client.sh <slug> <domain> [port]
```
The script: picks a free port → creates `folkadrive_<slug>` → migrates → seeds
the plan catalog + tenant → creates the admin login → copies the build → writes
`.env` (chmod 600) → starts PM2 → writes + reloads the nginx vhost → (optionally)
issues TLS.

`BETTER_AUTH_SECRET` is generated automatically if you don't export one.

---

## Worked example — folkadrive.folkastudio.com

**1. DNS first** (so Let's Encrypt can validate). In the folkastudio.com DNS, add:
```
Type  Name         Value
A     folkadrive   <VPS_PUBLIC_IP>
```
Wait until `dig +short folkadrive.folkastudio.com` returns the VPS IP.

**2. Build** (if not already done this release):
```bash
cd /path/to/sewa-mobil-01
pnpm build && bash scripts/deploy-standalone.sh
```

**3. Provision the instance:**
```bash
export FOLKADRIVE_DB_PASSWORD='…'             # folkadrive role pw
export ADMIN_EMAIL='admin@folkastudio.com'
export ADMIN_PASSWORD='…'                     # min 8 chars, you choose
export R2_ACCOUNT_ID='…' R2_ACCESS_KEY_ID='…' R2_SECRET_ACCESS_KEY='…'
export R2_BUCKET='folkadrive-assets' R2_PUBLIC_BASE_URL='https://cdn-folkadrive.folkastudio.com'
export CERTBOT_EMAIL='you@folkastudio.com'

scripts/new-client.sh folkastudio folkadrive.folkastudio.com 39001
```

**4. Verify:**
```bash
pm2 status folkadrive-folkastudio
curl -I https://folkadrive.folkastudio.com            # 200/3xx, valid cert
curl -I https://folkadrive.folkastudio.com/admin      # 307 → /admin/login
```
Then open `https://folkadrive.folkastudio.com/admin`, log in with
`admin@folkastudio.com` + your password.

Resulting layout: app `folkadrive-folkastudio` on `127.0.0.1:39001`, DB
`folkadrive_folkastudio`, dir `/var/www/folkadrive/folkastudio`, vhost
`/etc/nginx/sites-available/folkadrive-folkastudio.conf`.

---

## Update / redeploy a release

```bash
pnpm build && bash scripts/deploy-standalone.sh
cp -r .next/standalone/. /var/www/folkadrive/<slug>/.next/standalone/   # per client
# apply any new DB migrations:
DATABASE_URL='postgres://folkadrive:***@localhost:5432/folkadrive_<slug>' \
  node scripts/migrate.mjs
pm2 reload folkadrive-<slug> --update-env
```

## Reset an admin password

```bash
DATABASE_URL='postgres://folkadrive:***@localhost:5432/folkadrive_<slug>' \
  ADMIN_EMAIL='owner@klien.com' ADMIN_PASSWORD='new-pass' \
  node scripts/create-admin.mjs
```

## Remove a client

```bash
pm2 delete folkadrive-<slug> && pm2 save
sudo rm /etc/nginx/sites-enabled/folkadrive-<slug>.conf
sudo rm /etc/nginx/sites-available/folkadrive-<slug>.conf
sudo systemctl reload nginx
sudo -u postgres dropdb folkadrive_<slug>          # irreversible — back up first
sudo rm -rf /var/www/folkadrive/<slug>
```

## Notes

- Certbot auto-renews via its systemd timer; nothing else to do for TLS.
- Each instance binds loopback only — never expose the Node port publicly.
- `.env` files are `chmod 600` and hold DB + auth + R2 secrets — never commit them.
