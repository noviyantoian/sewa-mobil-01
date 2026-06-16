"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultLocale, isLocale, type Locale } from "./config";
import { dictionaries } from "./dictionaries";
import { createTranslator, type Messages, type Translator } from "./t";

const LOCALE_STORAGE_KEY = "folkadrive_locale";

type I18nValue = {
  locale: Locale;
  messages: Messages;
  t: Translator;
  setLocale: (next: Locale) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored) && stored !== locale) {
      setLocaleState(stored);
      if (typeof document !== "undefined") {
        document.documentElement.lang = stored;
      }
    }
    // Only read storage on mount; subsequent changes go through setLocale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  }, []);

  const value = useMemo<I18nValue>(() => {
    const messages = dictionaries[locale];
    return { locale, messages, t: createTranslator(messages, locale), setLocale };
  }, [locale, setLocale]);

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
