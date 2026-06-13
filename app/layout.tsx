import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getLocale, getMessages } from "@/lib/i18n/getLocale";
import { I18nProvider } from "@/lib/i18n/I18nProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FolkaDrive - Rental mobil profesional",
  description:
    "Armada premium di Jakarta, Bandung, dan Bali. Self-drive atau dengan sopir. Booking 2 menit, harga transparan.",
  metadataBase: new URL("https://folkadrive.local"),
  openGraph: {
    title: "FolkaDrive",
    description: "Mobil tepercaya, kapan saja.",
    images: ["/images/og-default.webp"],
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages(locale);

  return (
    <html lang={locale} className={inter.variable}>
      <body style={{ fontFamily: "var(--font-inter), var(--font-sans)" }}>
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
