import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Market Stalker — Indian Market AI News Intelligence Platform",
  description:
    "AI-powered financial news intelligence, sentiment analysis, and market event synthesis across 10 leading Indian business publishers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex antialiased`}>
        {/* Persistent Desktop Sidebar */}
        <Sidebar />

        {/* Main Application Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-gradient-to-b from-background via-background/95 to-black/60">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
