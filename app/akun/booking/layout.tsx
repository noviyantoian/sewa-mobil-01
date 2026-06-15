import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Booking Saya",
  description: "Lihat dan kelola riwayat booking sewa mobil Anda di FolkaDrive.",
  robots: { index: false, follow: false },
};

export default function AkunBookingLayout({ children }: { children: ReactNode }) {
  return children;
}
