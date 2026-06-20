import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getActiveTenantId } from "@/lib/tenant/current";
import { listCars } from "@/lib/repo";
import { SearchClient } from "./SearchClient";

// Tenant-scoped DB read → dynamic render.
export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const tenantId = await getActiveTenantId();
  const cars = await listCars(tenantId);

  return (
    <>
      <Header />
      {/* SearchClient reads useSearchParams → needs a Suspense boundary. */}
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <SearchClient cars={cars} />
      </Suspense>
      <Footer />
    </>
  );
}
