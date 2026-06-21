import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Gate `/admin` behind Supabase Auth (redirect unauthenticated to login) and
 * keep admin surfaces out of search indexes.
 */
export async function middleware(req: NextRequest) {
  const res = await updateSession(req);
  if (req.nextUrl.pathname.startsWith("/admin")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  matcher: "/admin/:path*",
};
