import { TRPCReactProvider } from "@/trpc/react-client";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

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
      <body className="min-h-svh">
        <TRPCReactProvider>
          {children}
          <Toaster />
          <Analytics />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
