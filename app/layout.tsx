import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { SupplierProvider } from "@/context/SupplierContext";
import { UserProvider } from "@/context/UserContext";
import { ServiceProvider } from "@/context/ServiceContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WalletProvider } from "@/context/WalletContext";
import { TravelPlannerProvider } from "@/context/TravelPlannerContext";
import { PlannerCartProvider } from "@/context/PlannerCartContext";

import Header from "@/components/header";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import AppWithLoader from '@/components/AppWithLoader'
import { LoadingProvider } from '@/components/LoadingContext'
import { CartProvider } from "@/context/CartContext";
// TOOLS DE DEBUGGING (disponibles para activar si es necesario):
// import SessionDebugger from "@/components/SessionDebugger";

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

  // AUTHENTICATION - Solo sesión para header, no se pasa al cliente
  const session = await auth()

  // DEBUGGING: Descomentar para logs de session en layout
  // console.log("session layout", session);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <ThemeProvider>
            <SessionProvider>
              <UserProvider>
                <WalletProvider>
                  <TravelPlannerProvider>
                    <PlannerCartProvider>
                      <SupplierProvider>
                        <ServiceProvider>
                          <LoadingProvider>
                            <AppWithLoader>
                              <div className="layout">
                                <Header session={session} />
                                <main className="main-content">
                                  {children}
                                </main>
                                <Toaster 
                                  position="top-right" 
                                  richColors 
                                  closeButton
                                  duration={4000}
                                />
                                {/* DEBUGGING: Descomentar la línea siguiente para activar debug visual */}
                                {/* <SessionDebugger /> */}
                              </div>
                            </AppWithLoader>
                          </LoadingProvider>
                        </ServiceProvider>
                      </SupplierProvider>
                    </PlannerCartProvider>
                  </TravelPlannerProvider>
                </WalletProvider>
              </UserProvider>
            </SessionProvider>
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
