import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { isAdminEmail } from "@/lib/auth/admin-emails";

/**
 * Guard for admin Server Actions. Server Actions are POST endpoints reachable
 * directly (the middleware only gates page navigations), so every mutation must
 * verify the caller is an authenticated admin. Throws on failure; callers catch
 * and return a structured error.
 *
 * A valid better-auth session is NOT enough — the email must be in ADMIN_EMAILS.
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user || !isAdminEmail(user.email)) throw new UnauthorizedError();
  return user;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Not authenticated");
    this.name = "UnauthorizedError";
  }
}

/**
 * Page-level guard for the admin server layout. Validates the session against
 * the DB (not just cookie presence) and the ADMIN_EMAILS allow-list, then
 * redirects non-admins to the login page. This is the single gate for every
 * admin page render — so no individual page can forget to check.
 */
export async function requireAdminPage(): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || !isAdminEmail(session.user.email)) {
    redirect("/admin/login");
  }
}
