import type { Locale } from "./i18n/config";

export function formatIDR(value: number, opts: { compact?: boolean } = {}): string {
  const { compact } = opts;
  if (compact) {
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}jt`;
    if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}rb`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date | string, locale: Locale = "id"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateRange(start: Date | string, end: Date | string, locale: Locale = "id"): string {
  return `${formatDate(start, locale)} - ${formatDate(end, locale)}`;
}

export function daysBetween(start: Date | string, end: Date | string): number {
  const a = typeof start === "string" ? new Date(start) : start;
  const b = typeof end === "string" ? new Date(end) : end;
  const ms = b.getTime() - a.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
