import type { Locale } from "./config";

export type Messages = Record<string, unknown>;

export type Translator = (key: string, vars?: Record<string, string | number>) => string;

function pickByPath(obj: Messages, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return typeof cur === "string" ? cur : undefined;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`
  );
}

export function createTranslator(messages: Messages, _locale: Locale): Translator {
  return (key, vars) => {
    const raw = pickByPath(messages, key);
    if (raw === undefined) return key;
    return interpolate(raw, vars);
  };
}
