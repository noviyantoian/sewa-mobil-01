import { headers } from "next/headers";
import type { ReactNode } from "react";
import { requireAdminPage } from "@/lib/auth/guard";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Server layout — the single auth gate for /admin. Validates the better-auth
 * session + ADMIN_EMAILS before rendering ANY admin page, so no individual page
 * can forget the check. The login page is excluded (it must render for
 * unauthenticated users); we detect it via the `x-pathname` header that
 * middleware sets on every /admin request.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (pathname === "/admin/login") return <>{children}</>;

  await requireAdminPage();
  return <AdminShell>{children}</AdminShell>;
}
