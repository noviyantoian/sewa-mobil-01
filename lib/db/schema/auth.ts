import { uuid, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, pk } from "./_shared";
import { tenants } from "./tenancy";

/** Roles within a tenant. `owner` is the business owner; staff get scoped roles. */
export type MemberRole = "owner" | "admin" | "finance" | "ops";

/**
 * Tenant-scoped users (both renters and staff). Auth itself (better-auth, OTP)
 * lands in Fase 1; this table is the identity record RLS keys off of.
 */
export const users = pgTable("users", {
  id: pk(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  phone: text("phone"),
  email: text("email"),
  name: text("name"),
  createdAt: createdAt(),
});

/** Staff role assignment (RBAC, Fase 1+). A renter has no membership row. */
export const memberships = pgTable("memberships", {
  id: pk(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  role: text("role").$type<MemberRole>().notNull().default("ops"),
});
