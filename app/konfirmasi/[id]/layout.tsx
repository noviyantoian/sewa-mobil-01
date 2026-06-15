import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Konfirmasi Booking",
  description: "Detail konfirmasi pemesanan sewa mobil FolkaDrive Anda.",
  robots: { index: false, follow: false },
};

export default function KonfirmasiLayout({ children }: { children: ReactNode }) {
  return children;
}
