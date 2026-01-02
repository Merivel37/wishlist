import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wishlist 2.0",
  description: "A premium wishlist experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground flex min-h-screen`}
      >
        <Sidebar className="hidden md:flex w-64 border-r border-border h-screen sticky top-0" />

        <div className="flex-1 flex flex-col min-h-screen relative">
          <Header className="md:hidden" /> {/* Mobile Header */}
          <main className="flex-1 px-4 pt-16 md:pt-8 md:px-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
          <BottomNav className="md:hidden" />
        </div>
      </body>
    </html>
  );
}
