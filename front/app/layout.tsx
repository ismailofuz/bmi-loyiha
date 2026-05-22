import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ToastProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Amaliyot Monitoring Tizimi",
  description: "Yagona amaliyot monitoring tizimi",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" className={`${inter.variable} h-full`}>
      <body suppressHydrationWarning className="h-full bg-slate-50 font-sans antialiased"><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}
