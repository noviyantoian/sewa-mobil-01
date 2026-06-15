import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumb, webPageSchema } from "@/lib/seo";

const TITLE = "FAQ — Pertanyaan Umum Sewa Mobil";
const DESCRIPTION =
  "Jawaban pertanyaan umum seputar sewa mobil FolkaDrive: syarat lepas kunci, deposit, asuransi, mode dengan sopir, pembatalan, dan pembayaran. Semua dijelaskan jelas.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/faq" },
  robots: { index: true, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/faq" },
};

export default function FaqLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema(TITLE, DESCRIPTION, "/faq"),
          breadcrumb([
            { name: "Beranda", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
