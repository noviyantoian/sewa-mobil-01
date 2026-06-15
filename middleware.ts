import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Keep admin/ops surfaces out of search indexes via response header.
 * The admin shell is a client component and cannot export `metadata`,
 * so noindex is enforced here at the edge instead.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/admin")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  matcher: "/admin/:path*",
};
