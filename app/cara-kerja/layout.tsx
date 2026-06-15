import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumb, webPageSchema } from "@/lib/seo";

const TITLE = "Cara Kerja Sewa Mobil FolkaDrive";
const DESCRIPTION =
  "Tiga langkah mudah menyewa mobil di FolkaDrive: cari mobil yang tersedia, verifikasi identitas dan bayar online, lalu ambil kunci atau temui sopir. Cepat dan transparan.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/cara-kerja" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/cara-kerja" },
};

export default function CaraKerjaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema(TITLE, DESCRIPTION, "/cara-kerja"),
          breadcrumb([
            { name: "Beranda", path: "/" },
            { name: "Cara Kerja", path: "/cara-kerja" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
