import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumb, carSchema } from "@/lib/seo";
import { getCarBySlug } from "@/lib/mock/cars";
import { formatIDR } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarBySlug(slug);

  if (!car) {
    return {
      title: "Mobil Tidak Ditemukan",
      robots: { index: false, follow: true },
    };
  }

  const full = `${car.brand} ${car.name}`;
  const title = `Sewa ${full} — Lepas Kunci & Sopir`;
  const description = `Sewa ${full} mulai ${formatIDR(
    car.rateSelfDrive,
  )}/hari di Jakarta, Bandung & Bali. Deposit ${formatIDR(
    car.deposit,
  )}, batal gratis H-2, harga transparan tanpa biaya tersembunyi.`;
  const path = `/mobil/${car.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      images: [car.exterior],
    },
  };
}

export default async function CarLayout({ children, params }: { children: ReactNode } & Params) {
  const { slug } = await params;
  const car = getCarBySlug(slug);

  return (
    <>
      {car ? (
        <JsonLd
          data={[
            carSchema(car),
            breadcrumb([
              { name: "Beranda", path: "/" },
              { name: "Armada", path: "/cari" },
              { name: `${car.brand} ${car.name}`, path: `/mobil/${car.slug}` },
            ]),
          ]}
        />
      ) : null}
      {children}
    </>
  );
}
