import { Metadata } from "next";
import { WizardContent } from "./wizard-content";

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
    ? "ค้นหาประกันที่ใช่ | เครื่องมือแนะนำประกัน InsureAI"
    : "Find Your Insurance | InsureAI Recommendation Wizard";

  const description = isThai
    ? "ตอบคำถามง่ายๆ ไม่กี่ข้อ รับคำแนะนำประกันสุขภาพ ประกันชีวิต ที่เหมาะกับคุณภายใน 60 วินาที"
    : "Answer a few simple questions and get personalized health insurance and life insurance recommendations in just 60 seconds.";

  const canonicalUrl = isThai
    ? `${baseUrl}/wizard?lang=th`
    : `${baseUrl}/wizard`;

  return {
    title,
    description,
    keywords: isThai
      ? [
          "เลือกประกัน",
          "แนะนำประกัน",
          "ประกันสุขภาพ",
          "ประกันชีวิต",
          "เปรียบเทียบประกัน",
          "InsureAI",
        ]
      : [
          "insurance wizard",
          "insurance recommendation",
          "health insurance comparison",
          "life insurance Thailand",
          "InsureAI",
        ],
    openGraph: {
      title: isThai
        ? "ค้นหาประกันที่ใช่ - InsureAI"
        : "Find Your Insurance - InsureAI",
      description,
      url: canonicalUrl,
      locale: isThai ? "th_TH" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/wizard`,
        th: `${baseUrl}/wizard?lang=th`,
        "x-default": `${baseUrl}/wizard`,
      },
    },
  };
}

export default function WizardPage() {
  return <WizardContent />;
}
