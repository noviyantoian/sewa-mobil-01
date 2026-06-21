"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ResolvedTenantSettings } from "./features";

/**
 * Client access to the active tenant's resolved settings. The value is read
 * server-side (root layout) and injected once, so client components like the
 * Header can gate behaviour (e.g. login visibility) without their own fetch.
 */
const TenantSettingsContext = createContext<ResolvedTenantSettings | null>(null);

export function TenantSettingsProvider({
  value,
  children,
}: {
  value: ResolvedTenantSettings;
  children: ReactNode;
}) {
  return (
    <TenantSettingsContext.Provider value={value}>
      {children}
    </TenantSettingsContext.Provider>
  );
}

export function useTenantSettings(): ResolvedTenantSettings {
  const ctx = useContext(TenantSettingsContext);
  if (!ctx) {
    throw new Error("useTenantSettings must be used within TenantSettingsProvider");
  }
  return ctx;
}
