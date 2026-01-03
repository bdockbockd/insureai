import { Metadata } from "next";
import { HomeContent } from "./home-content";
import { FAQSchema, insuranceFAQs } from "@/components/seo/faq-schema";

const baseUrl = "https://www.xn--q3cxxb8a4e.life";

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { lang = "en" } = await searchParams;
  const isThai = lang === "th";

  const title = isThai
    ? "InsureAI - ค้นหาประกันที่ใช่ใน 60 วินาที | AI แนะนำประกัน"
    : "InsureAI - Find Your Perfect Insurance in 60 Seconds";

  const description = isThai
    ? "ค้นหาประกันสุขภาพ ประกันชีวิต ประกันออมทรัพย์ที่เหมาะกับคุณด้วย AI เปรียบเทียบแผนประกันจากบริษัทชั้นนำในประเทศไทย ฟรี!"
    : "Find the perfect health insurance, life insurance, and savings plans with AI recommendations. Compare plans from Thailand's leading insurers for free!";

  const canonicalUrl = isThai ? `${baseUrl}?lang=th` : baseUrl;

  return {
    title,
    description,
    keywords: isThai
      ? [
          "ประกันภัย",
          "ประกันสุขภาพ",
          "ประกันชีวิต",
          "เปรียบเทียบประกัน",
          "AI แนะนำประกัน",
          "ประกันออมทรัพย์",
          "ประกันโรคร้ายแรง",
          "InsureAI",
        ]
      : [
          "insurance",
          "health insurance Thailand",
          "life insurance",
          "insurance comparison",
          "AI insurance recommendation",
          "best insurance Thailand",
        ],
    openGraph: {
      title: isThai
        ? "InsureAI - AI แนะนำประกันที่ใช่สำหรับคุณ"
        : "InsureAI - AI-Powered Insurance Recommendations",
      description,
      url: canonicalUrl,
      locale: isThai ? "th_TH" : "en_US",
      type: "website",
      siteName: isThai ? "InsureAI ประเทศไทย" : "InsureAI",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: baseUrl,
        th: `${baseUrl}?lang=th`,
        "x-default": baseUrl,
      },
    },
  };
}

export default async function Home({ searchParams }: Props) {
  const { lang = "en" } = await searchParams;

  return (
    <>
      <FAQSchema faqs={insuranceFAQs} lang={lang} />
      <HomeContent />
    </>
  );
}
