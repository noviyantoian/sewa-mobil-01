import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Masuk ke Akun FolkaDrive",
  description: "Masuk ke akun FolkaDrive untuk mengelola booking sewa mobil Anda.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
