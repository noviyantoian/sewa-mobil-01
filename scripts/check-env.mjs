// Verify required env before build/start. Run: node --env-file=.env scripts/check-env.mjs
// Catches the #1 live bug: admin login bounces back because ADMIN_EMAILS or the
// Supabase public env are missing in the runtime (PM2) environment.
const REQUIRED = {
  DATABASE_URL: "Postgres connection (Supabase pooler).",
  NEXT_PUBLIC_SUPABASE_URL: "Supabase project URL — needed at BUILD (client) AND RUNTIME (middleware).",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "Supabase publishable/anon key — BUILD + RUNTIME.",
  ADMIN_EMAILS: "Comma-separated admin allow-list. If unset at RUNTIME, every admin login bounces back to /admin/login.",
};
const OPTIONAL = {
  NEXT_PUBLIC_ASSET_BASE_URL: "R2/CDN base for images (BUILD). Empty = serve from /public.",
  R2_ACCOUNT_ID: "R2 upload (else falls back to Supabase Storage).",
  R2_ACCESS_KEY_ID: "R2 upload.",
  R2_SECRET_ACCESS_KEY: "R2 upload.",
  R2_BUCKET: "R2 upload.",
  R2_PUBLIC_BASE_URL: "R2 public URL base.",
};

let missing = 0;
console.log("Required:");
for (const [k, why] of Object.entries(REQUIRED)) {
  const ok = Boolean(process.env[k]);
  console.log(`  ${ok ? "✓" : "✗"} ${k}${ok ? "" : "  — MISSING: " + why}`);
  if (!ok) missing++;
}
console.log("Optional:");
for (const [k, why] of Object.entries(OPTIONAL)) {
  console.log(`  ${process.env[k] ? "✓" : "·"} ${k}${process.env[k] ? "" : "  (" + why + ")"}`);
}

if (missing > 0) {
  console.error(`\n✗ ${missing} required env var(s) missing. Login/CSS will break on live. Set them, then rebuild + restart.`);
  process.exit(1);
}
console.log("\n✓ All required env present.");
