import { cookies } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./config";

export const LOCALE_COOKIE = "folkadrive_locale";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(raw) ? raw : defaultLocale;
}

export async function getMessages(locale: Locale) {
  return (await import(`@/messages/${locale}.json`)).default;
}
