import { and, eq, sql } from "drizzle-orm";
import { withTenant } from "@/lib/db";
import {
  memberships,
  plans,
  tenants,
  users,
  type MemberRole,
} from "@/lib/db/schema";

/** A staff member = a membership row joined to its identity (users) row. */
export interface Member {
  id: string; // membership id
  userId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: MemberRole;
}

/** Seat usage for the active tenant's plan. `max` null = unlimited (enterprise). */
export interface SeatInfo {
  used: number;
  max: number | null;
}

export interface MemberInput {
  name: string;
  email?: string;
  phone?: string;
  role: MemberRole;
}

/** Raised when a tenant is already at its plan's seat limit. */
export class SeatLimitError extends Error {
  constructor() {
    super("Seat limit reached for the current plan");
    this.name = "SeatLimitError";
  }
}

/** All staff members for the tenant (RLS-scoped), ordered owner-first then name. */
export async function listMembers(tenantId: string): Promise<Member[]> {
  return withTenant(tenantId, async (tx) => {
    const rows = await tx
      .select({
        id: memberships.id,
        userId: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: memberships.role,
      })
      .from(memberships)
      .innerJoin(users, eq(memberships.userId, users.id));
    // Owner first, then alphabetical — stable order for the table.
    return [...rows].sort((a, b) => {
      if (a.role === "owner" && b.role !== "owner") return -1;
      if (b.role === "owner" && a.role !== "owner") return 1;
      return (a.name ?? "").localeCompare(b.name ?? "");
    });
  });
}

/** Seat usage (used vs plan cap) for the active tenant. */
export async function getSeatInfo(tenantId: string): Promise<SeatInfo> {
  return withTenant(tenantId, async (tx) => {
    const [used] = await tx
      .select({ n: sql<number>`count(*)::int` })
      .from(memberships);
    const [plan] = await tx
      .select({ max: plans.maxUsers })
      .from(tenants)
      .innerJoin(plans, eq(tenants.planId, plans.id))
      .where(eq(tenants.id, tenantId))
      .limit(1);
    return { used: Number(used?.n ?? 0), max: plan?.max ?? null };
  });
}

function memberColumns(input: MemberInput) {
  return {
    name: input.name.trim(),
    email: input.email?.trim() || null,
    phone: input.phone?.trim() || null,
  };
}

/**
 * Add a staff member: creates the identity (users) row + membership in one
 * transaction. Enforces the plan seat cap — throws `SeatLimitError` when full.
 */
export async function createMember(
  tenantId: string,
  input: MemberInput,
): Promise<Member> {
  const seat = await getSeatInfo(tenantId);
  if (seat.max !== null && seat.used >= seat.max) throw new SeatLimitError();

  return withTenant(tenantId, async (tx) => {
    const cols = memberColumns(input);
    const [u] = await tx
      .insert(users)
      .values({ tenantId, ...cols })
      .returning({ id: users.id });
    const [m] = await tx
      .insert(memberships)
      .values({ tenantId, userId: u.id, role: input.role })
      .returning({ id: memberships.id, role: memberships.role });
    return { id: m.id, userId: u.id, ...cols, role: m.role };
  });
}

/** Change a member's role. Returns false when the membership isn't found. */
export async function updateMemberRole(
  tenantId: string,
  membershipId: string,
  role: MemberRole,
): Promise<boolean> {
  return withTenant(tenantId, async (tx) => {
    const [row] = await tx
      .update(memberships)
      .set({ role })
      .where(eq(memberships.id, membershipId))
      .returning({ id: memberships.id });
    return !!row;
  });
}

/** Remove a member: deletes the membership and its identity row. */
export async function deleteMember(
  tenantId: string,
  membershipId: string,
): Promise<boolean> {
  return withTenant(tenantId, async (tx) => {
    const [m] = await tx
      .delete(memberships)
      .where(eq(memberships.id, membershipId))
      .returning({ userId: memberships.userId });
    if (!m) return false;
    await tx
      .delete(users)
      .where(and(eq(users.id, m.userId), eq(users.tenantId, tenantId)));
    return true;
  });
}
