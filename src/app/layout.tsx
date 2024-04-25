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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.className} dark antialiased`}>
      <head>
        <meta
          name="google-site-verification"
          content="1Rr8mfLCZQaB9ggACszgCUpiZSGikGifESieH19HRNk"
        />
      </head>
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
