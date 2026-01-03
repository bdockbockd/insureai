import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { Providers } from "@/components/providers";
import { LanguageHtmlUpdater } from "@/components/seo/language-html-updater";
import { HreflangLinks } from "@/components/seo/hreflang-links";
import {
  OrganizationSchema,
  WebsiteSchema,
} from "@/components/seo/organization-schema";
import { GoogleAnalytics } from "@/components/seo/google-analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.xn--q3cxxb8a4e.life"),
  title: {
    default:
      "InsureAI - ค้นหาประกันที่ใช่ใน 60 วินาที | Find Your Perfect Insurance",
    template: "%s | InsureAI",
  },
  description:
    "AI-powered insurance recommendations. Compare health insurance, life insurance plans in Thailand. ค้นหาประกันสุขภาพ ประกันชีวิต เปรียบเทียบแผนประกันที่เหมาะกับคุณ",
  keywords: [
    // English keywords
    "insurance",
    "health insurance",
    "life insurance",
    "Thailand insurance",
    "insurance comparison",
    "AI insurance",
    "best health insurance Thailand",
    "expat health insurance Thailand",
    // Thai keywords
    "ประกันภัย",
    "ประกันสุขภาพ",
    "ประกันชีวิต",
    "เปรียบเทียบประกัน",
    "ประกันออมทรัพย์",
    "ประกันบำนาญ",
    "ประกันอุบัติเหตุ",
    "ประกันโรคร้ายแรง",
    "ประกันสุขภาพที่ดีที่สุด",
  ],
  authors: [{ name: "InsureAI", url: "https://www.xn--q3cxxb8a4e.life" }],
  creator: "InsureAI",
  publisher: "InsureAI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "th_TH",
    url: "https://www.xn--q3cxxb8a4e.life",
    siteName: "InsureAI",
    title: "InsureAI - AI-Powered Insurance Comparison Thailand",
    description:
      "Find your perfect insurance plan in 60 seconds with AI recommendations. Compare health, life, and savings insurance.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "InsureAI - Smart Insurance Comparison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InsureAI - AI-Powered Insurance Comparison",
    description: "Find your perfect insurance plan in 60 seconds",
    images: ["/og-image.jpg"],
    creator: "@insureai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.xn--q3cxxb8a4e.life",
    languages: {
      en: "https://www.xn--q3cxxb8a4e.life?lang=en",
      th: "https://www.xn--q3cxxb8a4e.life?lang=th",
      "x-default": "https://www.xn--q3cxxb8a4e.life",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* SEO Components */}
        <HreflangLinks />
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansThai.variable} antialiased`}
      >
        <GoogleAnalytics />
        <Providers>
          <LanguageHtmlUpdater />
          <Header />
          <main className="pt-16 pb-24 sm:pb-0 min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
