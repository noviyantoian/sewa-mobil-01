/**
 * Resolve a static asset path to its public URL. When NEXT_PUBLIC_ASSET_BASE_URL
 * is set (R2 custom domain), local `/images/...` paths are served from the CDN;
 * absolute URLs (admin uploads) and data: URIs pass through unchanged. With no
 * base configured, paths resolve from /public as before.
 */
const BASE = (process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "").replace(/\/$/, "");

export function asset(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path) || path.startsWith("data:")) return path;
  if (!BASE) return path;
  return `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}
