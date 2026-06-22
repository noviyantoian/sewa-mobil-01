// Provision (or reset) an admin login account for this instance.
//   ADMIN_EMAIL=owner@klien.com ADMIN_PASSWORD='...' \
//     node --env-file=.env scripts/create-admin.mjs
// or: node --env-file=.env scripts/create-admin.mjs <email> <password> [name]
//
// The password is supplied by the operator — never invented here. It is hashed
// with better-auth's own scrypt (so the login endpoint verifies it) and written
// directly to auth_user + auth_account, which works even with public sign-up
// disabled. Idempotent: re-running for an existing email resets the password.
//
// Reminder: the email must also be listed in ADMIN_EMAILS for /admin access.
import { hashPassword } from "better-auth/crypto";
import { randomUUID } from "node:crypto";
import postgres from "postgres";

const email = (process.env.ADMIN_EMAIL ?? process.argv[2] ?? "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? process.argv[3] ?? "";
const name = (process.env.ADMIN_NAME ?? process.argv[4] ?? email).trim();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing — copy .env.example to .env");
  process.exit(1);
}
if (!email || !email.includes("@")) {
  console.error("Provide a valid ADMIN_EMAIL (env) or first argument.");
  process.exit(1);
}
if (password.length < 8) {
  console.error("ADMIN_PASSWORD (env) or second argument must be at least 8 characters.");
  process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 1 });

try {
  const hash = await hashPassword(password);

  const action = await sql.begin(async (tx) => {
    const [existing] = await tx`select id from auth_user where email = ${email} limit 1`;
    if (existing) {
      const userId = existing.id;
      const [cred] = await tx`
        select id from auth_account
        where user_id = ${userId} and provider_id = 'credential' limit 1`;
      if (cred) {
        await tx`update auth_account set password = ${hash}, updated_at = now() where id = ${cred.id}`;
      } else {
        await tx`insert into auth_account (id, account_id, provider_id, user_id, password)
                 values (${randomUUID()}, ${userId}, 'credential', ${userId}, ${hash})`;
      }
      return "reset";
    }

    const userId = randomUUID();
    await tx`insert into auth_user (id, name, email, email_verified)
             values (${userId}, ${name}, ${email}, true)`;
    await tx`insert into auth_account (id, account_id, provider_id, user_id, password)
             values (${randomUUID()}, ${userId}, 'credential', ${userId}, ${hash})`;
    return "created";
  });

  console.log(`${action === "created" ? "Created" : "Reset password for"} admin: ${email}`);
  console.log("Make sure this email is in ADMIN_EMAILS for /admin access.");
} catch (err) {
  console.error("ERROR:", err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
