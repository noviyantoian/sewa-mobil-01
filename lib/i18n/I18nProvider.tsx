"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale } from "./config";
import { createTranslator, type Messages, type Translator } from "./t";

type I18nValue = {
  locale: Locale;
  messages: Messages;
  t: Translator;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({ locale, messages, t: createTranslator(messages, locale) }),
    [locale, messages]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useT(): Translator {
  return useI18n().t;
}
