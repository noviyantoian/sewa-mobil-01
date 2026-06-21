import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, pk } from "./_shared";

/** SaaS plan tiers — see docs/PRICING.md. */
export type PlanId = "starter" | "growth" | "business" | "enterprise";
export type TenantStatus = "active" | "trial" | "suspended";
export type SubCycle = "monthly" | "yearly";
export type SubStatus = "trialing" | "active" | "past_due" | "cancelled";
export type DomainType = "subdomain" | "byod" | "managed";
export type SslStatus = "pending" | "active" | "failed";

/**
 * Global plan catalog (not tenant-scoped, no RLS). `features` is the flag set
 * that gates UI/API per tier — kept in sync with lib/tenant/features.ts (Fase 2).
 */
export const plans = pgTable("plans", {
  id: text("id").primaryKey(), // PlanId
  name: text("name").notNull(),
  priceMonth: integer("price_month").notNull().default(0),
  features: jsonb("features").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  maxCars: integer("max_cars").notNull().default(0),
});

/**
 * One rental business = one tenant. Resolved from the request Host (Fase 1).
 * `theme` (jsonb) holds white-label brand overrides injected as CSS vars.
 */
export const tenants = pgTable("tenants", {
  id: pk(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  planId: text("plan_id").references(() => plans.id),
  theme: jsonb("theme")
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  status: text("status").$type<TenantStatus>().notNull().default("active"),
  createdAt: createdAt(),
});

export const subscriptions = pgTable("subscriptions", {
  id: pk(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  planId: text("plan_id").references(() => plans.id),
  cycle: text("cycle").$type<SubCycle>().notNull().default("monthly"),
  status: text("status").$type<SubStatus>().notNull().default("trialing"),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
});

/** Hosts mapped to a tenant: subdomain, BYOD, or managed. SSL via Caddy (Fase 3). */
export const domains = pgTable("domains", {
  id: pk(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  host: text("host").notNull().unique(),
  type: text("type").$type<DomainType>().notNull().default("subdomain"),
  isPrimary: boolean("is_primary").notNull().default(false),
  sslStatus: text("ssl_status").$type<SslStatus>().notNull().default("pending"),
  createdAt: createdAt(),
});
