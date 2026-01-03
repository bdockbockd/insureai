import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "@/data/blog-posts";
import { BlogPostContent } from "./blog-post-content";

const baseUrl = "https://insureai-nine.vercel.app";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

// Thai-specific keywords to add for Thai content
const thaiKeywords = [
  "ประกันภัย",
  "ประกันสุขภาพ",
  "ประกันชีวิต",
  "เปรียบเทียบประกัน",
  "ประกันออมทรัพย์",
  "ประกันบำนาญ",
  "ประเทศไทย",
];

// Generate metadata for SEO and social sharing
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { lang = "en" } = await searchParams;

  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title:
        lang === "th"
          ? "ไม่พบบทความ | InsureAI"
          : "Post Not Found | InsureAI",
      description:
        lang === "th"
          ? "ไม่พบบทความที่คุณต้องการ กรุณาลองใหม่อีกครั้ง"
          : "The requested blog post could not be found.",
    };
  }

  const isThai = lang === "th";
  const title = isThai && post.titleTh ? post.titleTh : post.title;
  const description =
    isThai && post.excerptTh ? post.excerptTh : post.excerpt;

  // IMPORTANT: Canonical URL should include language param to avoid duplicate content
  const canonicalUrl = isThai
    ? `${baseUrl}/blog/${slug}?lang=th`
    : `${baseUrl}/blog/${slug}`;

  // Enhanced Thai description with local context
  const enhancedThaiDescription = isThai
    ? `${description} | อ่านบทความประกันภัยจาก InsureAI`
    : description;

  // Combine original tags with language-specific keywords
  const keywords = isThai
    ? [...post.tags, ...thaiKeywords]
    : post.tags;

  return {
    title: isThai ? `${title} | InsureAI ประเทศไทย` : `${title} | InsureAI`,
    description: enhancedThaiDescription,
    keywords,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: isThai ? `${title} - บทความประกันภัย` : title,
      description: enhancedThaiDescription,
      type: "article",
      url: canonicalUrl,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: [post.author.name],
      locale: isThai ? "th_TH" : "en_US",
      siteName: isThai ? "InsureAI ประเทศไทย" : "InsureAI",
      section: post.category,
      tags: keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: isThai ? `${title} | InsureAI` : title,
      description: enhancedThaiDescription,
      images: [post.coverImage],
      creator: "@insureai",
    },
    alternates: {
      // Canonical points to the current language version
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/blog/${slug}`,
        th: `${baseUrl}/blog/${slug}?lang=th`,
        "x-default": `${baseUrl}/blog/${slug}`,
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

// Generate static params for all blog posts (SSG)
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// JSON-LD Schema for BlogPosting
function BlogPostSchema({ slug, lang }: { slug: string; lang: string }) {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const title = lang === "th" && post.titleTh ? post.titleTh : post.title;
  const description = lang === "th" && post.excerptTh ? post.excerptTh : post.excerpt;
  const content = lang === "th" && post.contentTh ? post.contentTh : post.content;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role || "Insurance Specialist",
    },
    publisher: {
      "@type": "Organization",
      name: "InsureAI",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`,
    },
    keywords: post.tags.join(", "),
    inLanguage: lang === "th" ? "th-TH" : "en-US",
    articleSection: post.category,
    wordCount: content.split(/\s+/).length,
    timeRequired: `PT${post.readTime}M`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb Schema
function BreadcrumbSchema({ slug, lang }: { slug: string; lang: string }) {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const title = lang === "th" && post.titleTh ? post.titleTh : post.title;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: lang === "th" ? "หน้าแรก" : "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: lang === "th" ? "บทความ" : "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${baseUrl}/blog/${slug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function BlogPostPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lang = "en" } = await searchParams;

  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <BlogPostSchema slug={slug} lang={lang} />
      <BreadcrumbSchema slug={slug} lang={lang} />
      <BlogPostContent post={post} />
    </>
  );
}
