import { createClient } from "@/lib/supabase/server";

/**
 * Guard for admin Server Actions. Server Actions are POST endpoints reachable
 * directly (the middleware only gates page navigations), so every mutation must
 * verify the caller is an authenticated admin. Throws on failure; callers catch
 * and return a structured error.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Not authenticated");
    this.name = "UnauthorizedError";
  }
}
