import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "FolkaDrive — Sewa mobil tanpa drama",
    template: "%s · FolkaDrive",
  },
  description:
    "Armada terawat di Jakarta, Bandung & Bali. Lepas kunci atau dengan sopir. Harga transparan tanpa biaya tersembunyi, batal gratis H-2, booking 2 menit.",
  metadataBase: new URL("https://folkadrive.local"),
  applicationName: "FolkaDrive",
  authors: [{ name: "FolkaDrive" }],
  publisher: "FolkaDrive",
  category: "travel",
  keywords: [
    "sewa mobil jakarta",
    "rental mobil bandung",
    "sewa mobil bali",
    "rental mobil lepas kunci",
    "sewa mobil dengan sopir",
    "rental mobil murah",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    title: "FolkaDrive — Sewa mobil tanpa drama",
    description: "Mobil tepercaya, harga jelas, kapan saja.",
    images: ["/images/og-default.webp"],
    type: "website",
    siteName: "FolkaDrive",
    locale: "id_ID",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "FolkaDrive — Sewa mobil tanpa drama",
    description: "Mobil tepercaya, harga jelas, kapan saja.",
    images: ["/images/og-default.webp"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <I18nProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                borderRadius: "10px",
                border: "1px solid var(--color-hairline)",
                fontFamily: "var(--font-sans)",
              },
            }}
          />
        </I18nProvider>
      </body>
    </html>
  );
}
