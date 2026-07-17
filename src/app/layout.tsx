import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TickerTape from "@/components/layout/TickerTape";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Market Catalyst AI — Understand the News. Discover the Opportunity.",
  description:
    "AI-powered investment research that connects breaking news, legislation, and geopolitics to the industries, sectors, and companies they may affect. Research and education only — not investment advice.",
};

// Fallback cache-refresh window, inherited by any page under this layout that
// doesn't export its own `revalidate`. Without this, a page with no explicit
// value defaults to fully static (revalidate: false) — cached forever at
// build time — which silently froze the shared TickerTape (and anything else
// in this layout) on Dashboard, Sectors index, History, and Assistant. Pages
// that need a different window (e.g. news pages at 600s) still override this.
export const revalidate = 300;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <TickerTape />
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
