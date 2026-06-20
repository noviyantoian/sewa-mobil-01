import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getActiveTenantId } from "@/lib/tenant/current";
import { getCarBySlug } from "@/lib/repo";
import { CheckoutClient } from "./CheckoutClient";

export const dynamic = "force-dynamic";

type SearchParams = { searchParams: Promise<{ slug?: string }> };

export default async function CheckoutPage({ searchParams }: SearchParams) {
  const { slug } = await searchParams;
  if (!slug) redirect("/cari");

  const tenantId = await getActiveTenantId();
  const car = await getCarBySlug(tenantId, slug);
  if (!car) redirect("/cari");

  return (
    <>
      <Header />
      {/* CheckoutClient reads useSearchParams → needs a Suspense boundary. */}
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <CheckoutClient car={car} />
      </Suspense>
      <Footer />
    </>
  );
}
