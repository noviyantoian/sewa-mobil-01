import id from "@/messages/id.json";
import en from "@/messages/en.json";
import type { Messages } from "./t";
import type { Locale } from "./config";

export const dictionaries: Record<Locale, Messages> = {
  id: id as Messages,
  en: en as Messages,
};
