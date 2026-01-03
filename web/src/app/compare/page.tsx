import { Metadata } from "next";
import { CompareContent } from "./compare-content";

const baseUrl = "https://insureai-nine.vercel.app";

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { lang = "en" } = await searchParams;
  const isThai = lang === "th";

  const title = isThai
    ? "เปรียบเทียบประกัน | เปรียบเทียบแผนประกันของคุณกับแผนที่แนะนำ"
    : "Compare Insurance | Compare Your Plan vs Recommended Plans";

  const description = isThai
    ? "อัปโหลดแผนประกันปัจจุบันของคุณ และเปรียบเทียบกับแผนที่เราแนะนำ ดูว่าคุณประหยัดได้เท่าไหร่และได้ความคุ้มครองที่ดีกว่า"
    : "Upload your current insurance plan and compare it with our recommended plans. See how much you can save while getting better coverage.";

  const canonicalUrl = isThai
    ? `${baseUrl}/compare?lang=th`
    : `${baseUrl}/compare`;

  return {
    title,
    description,
    keywords: isThai
      ? [
          "เปรียบเทียบประกัน",
          "เปรียบเทียบประกันสุขภาพ",
          "ประกันไหนดีกว่า",
          "ประกันที่คุ้มค่า",
          "InsureAI",
        ]
      : [
          "insurance comparison",
          "compare health insurance",
          "best insurance plan",
          "insurance value comparison",
          "InsureAI",
        ],
    openGraph: {
      title: isThai
        ? "เปรียบเทียบประกัน - InsureAI"
        : "Compare Insurance - InsureAI",
      description,
      url: canonicalUrl,
      locale: isThai ? "th_TH" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/compare`,
        th: `${baseUrl}/compare?lang=th`,
        "x-default": `${baseUrl}/compare`,
      },
    },
  };
}

export default function ComparePage() {
  return <CompareContent />;
}
