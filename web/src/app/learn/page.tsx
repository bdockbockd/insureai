import { Metadata } from "next";
import { LearnContent } from "./learn-content";

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
    ? "เรียนรู้เกี่ยวกับประกัน | คู่มือประกันภัยฉบับสมบูรณ์"
    : "Learn About Insurance | Complete Insurance Guide";

  const description = isThai
    ? "เรียนรู้ทุกอย่างเกี่ยวกับประกันสุขภาพ ประกันชีวิต ประกันออมทรัพย์ และประกันบำนาญ พร้อมคำแนะนำจากผู้เชี่ยวชาญ"
    : "Learn everything about health insurance, life insurance, savings insurance, and pension plans. Expert guidance for making informed decisions.";

  const canonicalUrl = isThai
    ? `${baseUrl}/learn?lang=th`
    : `${baseUrl}/learn`;

  return {
    title,
    description,
    keywords: isThai
      ? [
          "เรียนรู้ประกัน",
          "คู่มือประกันสุขภาพ",
          "ประกันชีวิตคืออะไร",
          "ประกันออมทรัพย์",
          "ประกันบำนาญ",
          "InsureAI",
        ]
      : [
          "insurance education",
          "health insurance guide",
          "life insurance explained",
          "savings insurance Thailand",
          "pension plans",
          "InsureAI",
        ],
    openGraph: {
      title: isThai
        ? "เรียนรู้เกี่ยวกับประกัน - InsureAI"
        : "Learn About Insurance - InsureAI",
      description,
      url: canonicalUrl,
      locale: isThai ? "th_TH" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/learn`,
        th: `${baseUrl}/learn?lang=th`,
        "x-default": `${baseUrl}/learn`,
      },
    },
  };
}

export default function LearnPage() {
  return <LearnContent />;
}
