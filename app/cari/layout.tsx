import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumb, webPageSchema } from "@/lib/seo";

const TITLE = "Sewa Mobil Tersedia di Jakarta, Bandung & Bali";
const DESCRIPTION =
  "Cari mobil yang tersedia untuk lepas kunci atau dengan sopir di Jakarta, Bandung, dan Bali. Filter kategori dan harga, total transparan tanpa biaya tersembunyi.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/cari" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/cari" },
};

export default function CariLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema(TITLE, DESCRIPTION, "/cari"),
          breadcrumb([
            { name: "Beranda", path: "/" },
            { name: "Armada", path: "/cari" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
