import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "GmailIt",
  description: "Easy mail option with no cost",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.className} dark`}>
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
