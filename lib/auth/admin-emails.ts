/**
 * Admin allow-list. A valid Supabase session is NOT enough to be an admin —
 * the email must be in ADMIN_EMAILS (comma-separated). Pure (no server deps) so
 * both the middleware gate and Server Action guard can use it. Deny-by-default:
 * if ADMIN_EMAILS is unset/empty, nobody is admin.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allow.length > 0 && allow.includes(email.toLowerCase());
}
