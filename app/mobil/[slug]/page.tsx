import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getActiveTenantId } from "@/lib/tenant/current";
import { listCars } from "@/lib/repo";
import { getCarForRequest } from "./_data";
import { CarDetailClient } from "./CarDetailClient";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export default async function CarDetailPage({ params }: Params) {
  const { slug } = await params;
  const car = await getCarForRequest(slug);
  if (!car) notFound();

  const tenantId = await getActiveTenantId();
  const sameCategory = await listCars(tenantId, { category: car.category });
  const similar = sameCategory.filter((c) => c.slug !== car.slug).slice(0, 3);

  return (
    <>
      <Header />
      {/* CarDetailClient reads useSearchParams → needs a Suspense boundary. */}
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <CarDetailClient car={car} similar={similar} />
      </Suspense>
      <Footer />
    </>
  );
}
