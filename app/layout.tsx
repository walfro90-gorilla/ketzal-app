import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Dashboard } from "./dashboard/page";

import { SupplierProvider } from "@/context/SupplierContext";



// FONTS  -  Geist and Geist Mono
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO metadata
export const metadata: Metadata = {
  title: "Ketzal app - Conoce Mexico",
  description: "Red social de viajeros para vijeros.",
  keywords: ["viajes", "mexico", "red social", "viajeros"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="container mx-auto pt-4">
          <SupplierProvider>
            {/* <Dashboard children={children} /> */}
            
          {children}
          </SupplierProvider>
        </main>

      </body>
    </html>
  );
}
