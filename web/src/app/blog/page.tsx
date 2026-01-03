import { Metadata } from "next";
import { BlogListContent } from "./blog-list-content";
import { blogPosts } from "@/data/blog-posts";

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
    ? "บทความประกันภัย | InsureAI ประเทศไทย"
    : "Insurance Blog | InsureAI";

  const description = isThai
    ? `อ่านบทความประกันภัยมากกว่า ${blogPosts.length} บทความ ครอบคลุมประกันสุขภาพ ประกันชีวิต ประกันออมทรัพย์ และอื่นๆ พร้อมคำแนะนำจากผู้เชี่ยวชาญ`
    : `Read ${blogPosts.length}+ insurance articles covering health insurance, life insurance, savings plans, and more. Expert advice for Thailand.`;

  const canonicalUrl = isThai ? `${baseUrl}/blog?lang=th` : `${baseUrl}/blog`;

  const keywords = isThai
    ? [
        "บทความประกันภัย",
        "ประกันสุขภาพ",
        "ประกันชีวิต",
        "ประกันออมทรัพย์",
        "คู่มือประกัน",
        "เปรียบเทียบประกัน",
        "ประกันภัยไทย",
        "InsureAI",
      ]
    : [
        "insurance blog",
        "health insurance Thailand",
        "life insurance guide",
        "insurance comparison",
        "expat insurance",
        "Thailand insurance articles",
        "InsureAI",
      ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: isThai
        ? "บทความประกันภัย - InsureAI"
        : "Insurance Blog - InsureAI",
      description,
      type: "website",
      url: canonicalUrl,
      locale: isThai ? "th_TH" : "en_US",
      siteName: isThai ? "InsureAI ประเทศไทย" : "InsureAI",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: isThai
            ? "บทความประกันภัย InsureAI"
            : "InsureAI Insurance Blog",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isThai
        ? "บทความประกันภัย | InsureAI"
        : "Insurance Blog | InsureAI",
      description,
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/blog`,
        th: `${baseUrl}/blog?lang=th`,
        "x-default": `${baseUrl}/blog`,
      },
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
  };
}

// CollectionPage Schema for blog listing
function BlogCollectionSchema({ lang }: { lang: string }) {
  const isThai = lang === "th";

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: isThai ? "บทความประกันภัย" : "Insurance Blog",
    description: isThai
      ? "รวมบทความประกันภัยทั้งหมดจาก InsureAI"
      : "All insurance articles from InsureAI",
    url: `${baseUrl}/blog`,
    inLanguage: isThai ? "th-TH" : "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "InsureAI",
      url: baseUrl,
    },
    about: {
      "@type": "Thing",
      name: isThai ? "ประกันภัย" : "Insurance",
    },
    numberOfItems: blogPosts.length,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: blogPosts.length,
      itemListElement: blogPosts.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/blog/${post.slug}`,
        name: isThai && post.titleTh ? post.titleTh : post.title,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function BlogPage({ searchParams }: Props) {
  const { lang = "en" } = await searchParams;

  return (
    <>
      <BlogCollectionSchema lang={lang} />
      <BlogListContent />
    </>
  );
}
