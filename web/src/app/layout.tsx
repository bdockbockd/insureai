import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InsureAI - Find Your Perfect Insurance Plan in 60 Seconds",
  description: "AI-powered insurance recommendations backed by Allianz. Compare plans, find better coverage, and protect your family today.",
  keywords: ["insurance", "health insurance", "life insurance", "Allianz", "Thailand", "insurance comparison"],
  authors: [{ name: "InsureAI" }],
  openGraph: {
    title: "InsureAI - Find Your Perfect Insurance Plan",
    description: "AI-powered insurance recommendations backed by Allianz",
    type: "website",
    locale: "en_US",
    siteName: "InsureAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "InsureAI - Find Your Perfect Insurance Plan",
    description: "AI-powered insurance recommendations backed by Allianz",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main className="pt-16 pb-24 sm:pb-0 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
