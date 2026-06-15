import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, breadcrumb, SITE } from "@/lib/seo";

const TITLE = "Kontak & Bantuan FolkaDrive";
const DESCRIPTION =
  "Hubungi FolkaDrive via WhatsApp atau telepon untuk bantuan sewa mobil. Jam operasional 06.00–23.00 setiap hari. Tersedia layanan sewa korporat untuk kebutuhan perusahaan.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/kontak" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/kontak" },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: absoluteUrl("/kontak"),
  name: TITLE,
  description: DESCRIPTION,
  inLanguage: "id-ID",
  isPartOf: { "@type": "WebSite", "@id": `${SITE.url}/#website` },
  mainEntity: { "@type": "Organization", "@id": `${SITE.url}/#organization` },
};

export default function KontakLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          contactPageSchema,
          breadcrumb([
            { name: "Beranda", path: "/" },
            { name: "Kontak", path: "/kontak" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
