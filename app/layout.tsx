import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";



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
        {/* <div className="flex justify-between items-center">
          <h1
            className="text-4xl font-bold"
          >
            Ketzal app
          </h1>
          <Link
            href='/products/new'
            className={buttonVariants()}
          >
            Create Producto
          </Link>

        </div>

        <nav>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/suppliers">Suppliers</Link>
          </li>
        </nav> */}
        <main className="container mx-auto pt-4">
          {children}
        </main>

      </body>
    </html>
  );
}
