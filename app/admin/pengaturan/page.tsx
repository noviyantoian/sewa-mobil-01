import { getActiveTenantSettings } from "@/lib/tenant/features";
import { PengaturanClient } from "./PengaturanClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getActiveTenantSettings();
  return <PengaturanClient guestCheckout={settings.guestCheckout} />;
}
