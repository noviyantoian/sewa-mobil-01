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

/**
 * Normalize an Indonesian phone number to wa.me's expected international form
 * (digits only, leading `62`). Handles `08xx`, `+62 8xx`, `62 8xx`, spaces and
 * dashes. Returns "" when there is nothing dial-able.
 */
export function normalizePhoneID(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

/**
 * Build a wa.me deep link for contacting a customer, with an optional prefilled
 * message. Returns "" when the phone can't be normalized (caller hides the CTA).
 */
export function waLink(phone: string, text?: string): string {
  const num = normalizePhoneID(phone);
  if (!num) return "";
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${num}${query}`;
}
