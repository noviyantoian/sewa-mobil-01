import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Edge gate for `/admin`:
 *  - Optimistic redirect to /admin/login when no session cookie is present
 *    (fast UX; the real session + ADMIN_EMAILS check runs in the server layout
 *    via requireAdminPage — see app/admin/layout.tsx).
 *  - Sets `x-pathname` so the server layout can tell the login route apart.
 *  - Keeps admin surfaces out of search indexes.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = getSessionCookie(req);
    if (!sessionCookie) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  if (pathname.startsWith("/admin")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  matcher: "/admin/:path*",
};
