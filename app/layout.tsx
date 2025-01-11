import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SupplierProvider } from "@/context/SupplierContext";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/header";

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
  title: "Ketzal app - Conoce México",
  description: "Red social de viajeros para viajeros.",
  keywords: ["viajes", "méxico", "red social", "viajeros"],
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
        <UserProvider>
          <SupplierProvider>
            <div className="layout">
              <Header />

                <main className="main-content">
                {children}
                </main>
            </div>
          </SupplierProvider>
        </UserProvider>
      </body>
    </html>
  );
}
