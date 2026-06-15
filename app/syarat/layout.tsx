import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumb, webPageSchema } from "@/lib/seo";

const TITLE = "Syarat & Ketentuan Sewa Mobil";
const DESCRIPTION =
  "Syarat dan ketentuan sewa mobil FolkaDrive: persyaratan dokumen, deposit, kebijakan pembatalan berjenjang, tanggung jawab penyewa, serta ketentuan mode lepas kunci dan sopir.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/syarat" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/syarat" },
};

export default function SyaratLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema(TITLE, DESCRIPTION, "/syarat"),
          breadcrumb([
            { name: "Beranda", path: "/" },
            { name: "Syarat & Ketentuan", path: "/syarat" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
