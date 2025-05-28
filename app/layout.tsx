import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SupplierProvider } from "@/context/SupplierContext";
import { UserProvider } from "@/context/UserContext";
import { ServiceProvider } from "@/context/ServiceContext";
import { ThemeProvider } from "@/context/ThemeContext";

import Header from "@/components/header";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import AppWithLoader from '@/components/AppWithLoader'
import { LoadingProvider } from '@/components/LoadingContext'
import { CartProvider } from "@/context/CartContext";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // AUTHENTICATION
  const session = await auth()

  console.log("session layout", session);
  console.log("LAyout after session")

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <ThemeProvider>
            <SessionProvider session={session}>
              <UserProvider>
                <SupplierProvider>
                  <ServiceProvider>
                    <LoadingProvider>
                      <AppWithLoader>
                        <div className="layout">
                          <Header session={session} />
                          <main className="main-content">
                            {children}
                          </main>
                        </div>
                      </AppWithLoader>
                    </LoadingProvider>
                  </ServiceProvider>
                </SupplierProvider>
              </UserProvider>
            </SessionProvider>
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
