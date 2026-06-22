"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { getActiveTenantId } from "@/lib/tenant/current";
import { updateTenantSettings } from "@/lib/repo";

const settingsSchema = z.object({
  guestCheckout: z.boolean(),
});

export type SettingsActionResult = { ok: true } | { ok: false; error: string };

export async function updateTenantSettingsAction(
  raw: unknown,
): Promise<SettingsActionResult> {
  try {
    await requireAdmin();
    const parsed = settingsSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, error: "invalid" };
    await updateTenantSettings(await getActiveTenantId(), parsed.data);
    // Settings feed the root layout (Header gating) on every route.
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    console.error("[updateTenantSettingsAction]", e);
    return { ok: false, error: "failed" };
  }
}
