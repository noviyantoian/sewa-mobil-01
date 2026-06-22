import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { TenantSettingsProvider } from "@/lib/tenant/TenantProvider";
import { getActiveTenantSettings } from "@/lib/tenant/features";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE, organizationSchema, websiteSchema } from "@/lib/seo";

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
  metadataBase: new URL(SITE.url),
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
    images: [
      {
        url: SITE.ogImage, // absolute (R2 CDN) JPG — renders on FB/IG/WhatsApp/Telegram
        width: 1376,
        height: 768,
        type: "image/jpeg",
        alt: "FolkaDrive — sewa mobil Jakarta, Bandung, Bali",
      },
    ],
    type: "website",
    siteName: "FolkaDrive",
    locale: "id_ID",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "FolkaDrive — Sewa mobil tanpa drama",
    description: "Mobil tepercaya, harga jelas, kapan saja.",
    images: [SITE.ogImage],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tenantSettings = await getActiveTenantSettings();

  return (
    <html lang="id" className={inter.variable}>
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <TenantSettingsProvider value={tenantSettings}>
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
        </TenantSettingsProvider>
      </body>
    </html>
  );
}
