# InsureAI SEO Improvement Plan

## Executive Summary

This document outlines a comprehensive SEO improvement strategy for InsureAI, covering both English and Thai markets. The plan addresses critical gaps in technical SEO, internationalization, content optimization, and keyword targeting to improve organic search visibility in Thailand's competitive insurance market.

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Technical SEO Implementation](#technical-seo-implementation)
3. [Internationalization (i18n) SEO](#internationalization-i18n-seo)
4. [Thai Keyword Strategy](#thai-keyword-strategy)
5. [English Keyword Strategy](#english-keyword-strategy)
6. [Content SEO Optimization](#content-seo-optimization)
7. [Structured Data Implementation](#structured-data-implementation)
8. [Performance & Core Web Vitals](#performance--core-web-vitals)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Monitoring & Analytics](#monitoring--analytics)

---

## Current State Analysis

### What Exists ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Root Layout Metadata | ✅ Partial | Basic title, description, keywords |
| OpenGraph Tags | ✅ Partial | Missing og:image, og:url |
| Twitter Card | ✅ Partial | Missing twitter:image |
| Language Context | ✅ Good | 300+ translation keys (EN/TH) |
| Blog Content | ✅ Excellent | 130+ bilingual blog posts |
| Robots Meta | ✅ Good | index: true, follow: true |

### Implementation Status (Updated January 4, 2026)

#### Completed ✅

| Feature | Status | Files Created/Modified |
|---------|--------|------------------------|
| robots.txt | ✅ Done | `/web/public/robots.txt` |
| sitemap.xml | ✅ Done | `/web/src/app/sitemap.ts` - Dynamic with 130+ blog posts |
| Blog Post Metadata | ✅ Done | `/web/src/app/blog/[slug]/page.tsx` - generateMetadata with Thai/English |
| Blog Listing Metadata | ✅ Done | `/web/src/app/blog/page.tsx` - Bilingual SEO metadata |
| Home Page Metadata | ✅ Done | `/web/src/app/page.tsx` - Full SEO with FAQ schema |
| Wizard Page Metadata | ✅ Done | `/web/src/app/wizard/page.tsx` - Bilingual metadata |
| Learn Page Metadata | ✅ Done | `/web/src/app/learn/page.tsx` - Bilingual metadata |
| Compare Page Metadata | ✅ Done | `/web/src/app/compare/page.tsx` - Bilingual metadata |
| generateStaticParams | ✅ Done | All blog posts pre-generated at build |
| hreflang Links | ✅ Done | `/web/src/components/seo/hreflang-links.tsx` - Client component |
| Canonical URLs | ✅ Done | Language-specific canonicals (Thai adds ?lang=th) |
| Organization Schema | ✅ Done | `/web/src/components/seo/organization-schema.tsx` |
| Website Schema | ✅ Done | `/web/src/components/seo/organization-schema.tsx` |
| BlogPosting Schema | ✅ Done | `/web/src/app/blog/[slug]/page.tsx` |
| Breadcrumb Schema | ✅ Done | `/web/src/app/blog/[slug]/page.tsx` |
| FAQ Schema | ✅ Done | `/web/src/components/seo/faq-schema.tsx` - Bilingual FAQs |
| Thai Font | ✅ Done | Noto Sans Thai added to `/web/src/app/layout.tsx` |
| Preconnect Links | ✅ Done | Google Fonts, Unsplash, GA preconnects added |
| Google Analytics Component | ✅ Done | `/web/src/components/seo/google-analytics.tsx` |
| Language HTML Updater | ✅ Done | `/web/src/components/seo/language-html-updater.tsx` |
| Root Layout Enhancement | ✅ Done | Enhanced with all schemas, fonts, preconnects |

#### Pending (Requires Manual Action) ⏳

| Feature | Status | Action Required |
|---------|--------|-----------------|
| Google Analytics ID | ⏳ Pending | Add `NEXT_PUBLIC_GA_ID` to Vercel environment variables |
| Google Search Console | ⏳ Pending | 1. Verify ownership at https://search.google.com/search-console 2. Submit sitemap URL |
| OG Image | ⏳ Partial | Create branded `/web/public/og-image.jpg` (1200x630px) |
| Logo.png | ⏳ Pending | Create `/web/public/logo.png` for Organization schema |
| Social Media Links | ⏳ Pending | Update Organization schema with real social URLs |
| Google Verification Code | ⏳ Pending | Add verification meta tag after GSC verification |

#### Optional Future Improvements 📋

| Feature | Priority | Notes |
|---------|----------|-------|
| Blog internal linking | LOW | Add 3-5 related post links per article |
| Image alt text audit | LOW | Review all blog images for Thai/English alts |
| Content gap creation | LOW | Create high-value content per keyword strategy |
| URL-based i18n | LOW | Future migration to /en/, /th/ routes |
| Core Web Vitals audit | LOW | Run Lighthouse after deployment |

---

## Technical SEO Implementation

### 1. Create robots.txt

**File:** `/web/public/robots.txt`

```txt
# InsureAI Robots.txt
User-agent: *
Allow: /

# Block admin and API routes
Disallow: /admin/
Disallow: /api/

# Sitemaps
Sitemap: https://insureai-nine.vercel.app/sitemap.xml
Sitemap: https://insureai-nine.vercel.app/sitemap-th.xml
```

### 2. Dynamic Sitemap Generation

**File:** `/web/src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://insureai-nine.vercel.app';

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/wizard`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/learn`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/ai-assist`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
  ];

  // Blog posts
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    alternates: {
      languages: {
        en: `${baseUrl}/blog/${post.slug}?lang=en`,
        th: `${baseUrl}/blog/${post.slug}?lang=th`,
      },
    },
  }));

  // Learn pages
  const learnPages = ['health', 'life', 'savings', 'pension'].map((type) => ({
    url: `${baseUrl}/learn/${type}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...learnPages];
}
```

### 3. Blog Post Dynamic Metadata

**File:** `/web/src/app/blog/[slug]/page.tsx` (update)

```typescript
import { Metadata } from 'next';
import { blogPosts } from '@/data/blog-posts';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { lang = 'en' } = await searchParams;

  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Not Found' };

  const title = lang === 'th' ? post.titleTh : post.title;
  const description = lang === 'th' ? post.excerptTh : post.excerpt;
  const baseUrl = 'https://insureai-nine.vercel.app';

  return {
    title: `${title} | InsureAI`,
    description,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${baseUrl}/blog/${slug}`,
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: title }],
      publishedTime: post.date,
      authors: [post.author.name],
      locale: lang === 'th' ? 'th_TH' : 'en_US',
      siteName: 'InsureAI',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.coverImage],
    },
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
      languages: {
        'en': `${baseUrl}/blog/${slug}?lang=en`,
        'th': `${baseUrl}/blog/${slug}?lang=th`,
      },
    },
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}
```

### 4. Root Layout Metadata Enhancement

**File:** `/web/src/app/layout.tsx` (update)

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://insureai-nine.vercel.app'),
  title: {
    default: 'InsureAI - ค้นหาประกันที่ใช่ใน 60 วินาที | Find Your Perfect Insurance',
    template: '%s | InsureAI',
  },
  description: 'AI-powered insurance recommendations. Compare health insurance, life insurance plans in Thailand. ค้นหาประกันสุขภาพ ประกันชีวิต ที่เหมาะกับคุณ',
  keywords: [
    // English keywords
    'insurance', 'health insurance', 'life insurance', 'Thailand insurance',
    'insurance comparison', 'AI insurance', 'best insurance Thailand',
    // Thai keywords
    'ประกันภัย', 'ประกันสุขภาพ', 'ประกันชีวิต', 'เปรียบเทียบประกัน',
    'ประกันออมทรัพย์', 'ประกันบำนาญ', 'ประกันอุบัติเหตุ',
  ],
  authors: [{ name: 'InsureAI', url: 'https://insureai-nine.vercel.app' }],
  creator: 'InsureAI',
  publisher: 'InsureAI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'th_TH',
    url: 'https://insureai-nine.vercel.app',
    siteName: 'InsureAI',
    title: 'InsureAI - AI-Powered Insurance Comparison',
    description: 'Find your perfect insurance plan in 60 seconds with AI recommendations',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'InsureAI - Smart Insurance Comparison',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InsureAI - AI-Powered Insurance Comparison',
    description: 'Find your perfect insurance plan in 60 seconds',
    images: ['/og-image.jpg'],
    creator: '@insureai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
  alternates: {
    canonical: 'https://insureai-nine.vercel.app',
    languages: {
      'en': 'https://insureai-nine.vercel.app?lang=en',
      'th': 'https://insureai-nine.vercel.app?lang=th',
    },
  },
};
```

---

## Internationalization (i18n) SEO

### Current Architecture Issues

1. Language handled client-side only (bad for crawlers)
2. No URL-based language routing (`/en/`, `/th/`)
3. No hreflang links
4. `<html lang="en">` is hardcoded

### Recommended Solution: Hybrid Approach

Since refactoring to `[lang]` directory structure is complex, implement:

#### Option A: Query Parameter with Server-Side Detection (Recommended)

**Benefits:**
- Minimal code changes
- Works with existing structure
- Google respects hreflang with query params

**Implementation:**

1. Add hreflang links in layout.tsx:

```typescript
// In layout.tsx metadata
alternates: {
  languages: {
    'en': 'https://insureai-nine.vercel.app?lang=en',
    'th': 'https://insureai-nine.vercel.app?lang=th',
    'x-default': 'https://insureai-nine.vercel.app',
  },
}
```

2. Dynamic HTML lang attribute:

```typescript
// layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Use client component to update lang attribute */}
      <LanguageHtmlUpdater />
      <body>{children}</body>
    </html>
  );
}
```

#### Option B: Future Migration to URL-Based i18n

For better SEO long-term, consider migrating to:
- `/en/blog/article-slug`
- `/th/blog/article-slug`

Using `next-intl` library:

```
app/
├── [locale]/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
```

### hreflang Implementation

Add to each page's metadata:

```typescript
alternates: {
  canonical: 'https://insureai-nine.vercel.app/blog/health-insurance-guide',
  languages: {
    'en': 'https://insureai-nine.vercel.app/blog/health-insurance-guide?lang=en',
    'th': 'https://insureai-nine.vercel.app/blog/health-insurance-guide?lang=th',
    'x-default': 'https://insureai-nine.vercel.app/blog/health-insurance-guide',
  },
}
```

---

## Thai Keyword Strategy

### Primary Keywords (High Priority)

| Thai Keyword | English | Search Intent | Priority |
|--------------|---------|---------------|----------|
| ประกันสุขภาพ | Health Insurance | Commercial | P1 |
| ประกันชีวิต | Life Insurance | Commercial | P1 |
| ประกันสุขภาพที่ดีที่สุด | Best Health Insurance | Commercial | P1 |
| เปรียบเทียบประกัน | Compare Insurance | Commercial | P1 |
| ประกันสุขภาพราคาถูก | Cheap Health Insurance | Commercial | P1 |

### Secondary Keywords (Medium Priority)

| Thai Keyword | English | Search Intent | Priority |
|--------------|---------|---------------|----------|
| ประกันออมทรัพย์ | Savings Insurance | Commercial | P2 |
| ประกันบำนาญ | Pension Insurance | Commercial | P2 |
| ประกันอุบัติเหตุ | Accident Insurance | Commercial | P2 |
| ประกันโรคร้ายแรง | Critical Illness Insurance | Commercial | P2 |
| ประกันเดินทาง | Travel Insurance | Commercial | P2 |
| ประกันรถยนต์ | Car Insurance | Commercial | P2 |

### Long-tail Keywords (Content Strategy)

| Thai Keyword | English | Content Type |
|--------------|---------|--------------|
| ประกันสุขภาพดีไหม ปี 2568 | Is health insurance worth it 2025 | Blog |
| ทำประกันสุขภาพที่ไหนดี | Where to get health insurance | Comparison |
| ประกันชีวิตคุ้มค่าไหม | Is life insurance worth it | Blog |
| ประกันสุขภาพ AIA ดีไหม | Is AIA health insurance good | Review |
| ประกันสุขภาพ vs ประกันชีวิต | Health vs Life Insurance | Comparison |
| ประกันสุขภาพ เบี้ยเท่าไหร่ | How much is health insurance premium | FAQ |
| ประกันสุขภาพผู้สูงอายุ | Senior health insurance | Blog |
| ประกันสุขภาพครอบครัว | Family health insurance | Blog |

### Question-Based Keywords (FAQ Content)

| Thai Question | English |
|---------------|---------|
| ประกันสุขภาพคุ้มครองอะไรบ้าง | What does health insurance cover |
| ประกันชีวิตมีกี่แบบ | Types of life insurance |
| ควรทำประกันสุขภาพเท่าไหร่ | How much health insurance should I get |
| ประกันสุขภาพหักลดหย่อนภาษีได้ไหม | Can health insurance be tax deductible |
| ประกันชีวิตแบบไหนดีที่สุด | Which type of life insurance is best |

### Competitor Keywords to Target

Target keywords from major Thai insurers:
- ไทยประกันชีวิต (Thai Life Insurance)
- เมืองไทยประกันชีวิต (Muang Thai Life)
- AIA ประเทศไทย
- กรุงไทย-แอกซ่า
- พรูเด็นเชียล ประเทศไทย
- อลิอันซ์ อยุธยา

---

## English Keyword Strategy

### Primary Keywords

| Keyword | Search Intent | Priority |
|---------|---------------|----------|
| health insurance Thailand | Commercial | P1 |
| best health insurance Thailand | Commercial | P1 |
| life insurance Thailand | Commercial | P1 |
| expat health insurance Thailand | Commercial | P1 |
| insurance comparison Thailand | Commercial | P1 |

### Secondary Keywords

| Keyword | Search Intent | Priority |
|---------|---------------|----------|
| Thailand insurance for foreigners | Commercial | P2 |
| international health insurance Thailand | Commercial | P2 |
| retirement insurance Thailand | Commercial | P2 |
| critical illness insurance Thailand | Commercial | P2 |
| family health insurance Thailand | Commercial | P2 |

### Long-tail Keywords

| Keyword | Content Type |
|---------|--------------|
| how to choose health insurance in Thailand | Guide |
| best insurance companies in Thailand 2025 | Comparison |
| health insurance Thailand cost per month | FAQ |
| AIA vs Allianz Thailand | Comparison |
| insurance for digital nomads Thailand | Blog |
| affordable health insurance Bangkok | Blog |

### Expat-Focused Keywords

| Keyword | Content Type |
|---------|--------------|
| expat insurance guide Thailand | Guide |
| health insurance for retirees in Thailand | Blog |
| Thailand visa insurance requirements | FAQ |
| international hospital coverage Thailand | Blog |

---

## Content SEO Optimization

### Blog Post Optimization Checklist

For each of the 130+ existing blog posts:

- [ ] Add Thai meta title (50-60 characters)
- [ ] Add Thai meta description (150-160 characters)
- [ ] Optimize H1 tag (include primary keyword)
- [ ] Add internal links to related posts (3-5 per article)
- [ ] Add FAQ schema for question-based content
- [ ] Optimize images with alt text (Thai + English)
- [ ] Add table of contents for long articles
- [ ] Include call-to-action linking to wizard

### Content Gap Analysis

Create new content for high-value keywords:

| Topic | Target Keyword (TH) | Target Keyword (EN) |
|-------|---------------------|---------------------|
| Insurance Tax Guide | ประกันหักภาษี 2568 | Thailand insurance tax deduction |
| Senior Insurance Guide | ประกันสุขภาพผู้สูงอายุ | Senior health insurance Thailand |
| Family Insurance Guide | ประกันครอบครัว | Family insurance Thailand |
| Insurance vs Savings | ประกัน vs เงินฝาก | Insurance vs savings account |
| Claims Process Guide | วิธีเคลมประกัน | How to claim insurance Thailand |

### URL Structure Optimization

Current: `/blog/health-insurance-guide`
Recommended: Keep current structure (SEO-friendly)

For Thai content, consider:
- `/blog/คู่มือประกันสุขภาพ` (Thai URL - not recommended)
- `/blog/health-insurance-guide?lang=th` (Recommended - cleaner)

---

## Structured Data Implementation

### 1. Organization Schema

**File:** `/web/src/components/seo/organization-schema.tsx`

```typescript
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'InsureAI',
    url: 'https://insureai-nine.vercel.app',
    logo: 'https://insureai-nine.vercel.app/logo.png',
    description: 'AI-powered insurance comparison platform in Thailand',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TH',
      addressLocality: 'Bangkok',
    },
    sameAs: [
      'https://facebook.com/insureai',
      'https://twitter.com/insureai',
      'https://linkedin.com/company/insureai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Thai'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 2. BlogPosting Schema

**File:** `/web/src/components/seo/blog-post-schema.tsx`

```typescript
interface BlogPostSchemaProps {
  post: {
    title: string;
    titleTh: string;
    excerpt: string;
    excerptTh: string;
    slug: string;
    date: string;
    author: { name: string };
    coverImage: string;
    content: string;
    tags: string[];
  };
  lang: 'en' | 'th';
}

export function BlogPostSchema({ post, lang }: BlogPostSchemaProps) {
  const title = lang === 'th' ? post.titleTh : post.title;
  const description = lang === 'th' ? post.excerptTh : post.excerpt;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: post.coverImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'InsureAI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://insureai-nine.vercel.app/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://insureai-nine.vercel.app/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    inLanguage: lang === 'th' ? 'th-TH' : 'en-US',
    articleSection: 'Insurance',
    wordCount: post.content.split(' ').length,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 3. FAQ Schema

**File:** `/web/src/components/seo/faq-schema.tsx`

```typescript
interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 4. Breadcrumb Schema

```typescript
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## Performance & Core Web Vitals

### Target Metrics (2025 Standards)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | Unknown | Measure |
| INP (Interaction to Next Paint) | ≤ 200ms | Unknown | Measure |
| CLS (Cumulative Layout Shift) | < 0.1 | Unknown | Measure |

### Optimization Actions

#### 1. Image Optimization

```typescript
// next.config.ts
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};
```

#### 2. Font Optimization

```typescript
// Use next/font for optimal font loading
import { Inter, Noto_Sans_Thai } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const notoSansThai = Noto_Sans_Thai({ subsets: ['thai'], display: 'swap' });
```

#### 3. Preconnect for External Resources

```html
<!-- Add to layout.tsx -->
<link rel="preconnect" href="https://images.unsplash.com" />
<link rel="dns-prefetch" href="https://images.unsplash.com" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
```

#### 4. Static Generation for Blog Posts

```typescript
// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}
```

---

## Implementation Roadmap

### Phase 1: Critical SEO Foundation ✅ COMPLETE

| Task | Status | Files |
|------|--------|-------|
| Create robots.txt | ✅ Done | `/web/public/robots.txt` |
| Create sitemap.ts | ✅ Done | `/web/src/app/sitemap.ts` |
| Add blog post generateMetadata | ✅ Done | `/web/src/app/blog/[slug]/page.tsx` |
| Add generateStaticParams for blog | ✅ Done | `/web/src/app/blog/[slug]/page.tsx` |
| Update root layout metadata | ✅ Done | `/web/src/app/layout.tsx` |

### Phase 2: Structured Data ✅ COMPLETE

| Task | Status | Files |
|------|--------|-------|
| Organization schema | ✅ Done | `/web/src/components/seo/organization-schema.tsx` |
| Website schema | ✅ Done | `/web/src/components/seo/organization-schema.tsx` |
| BlogPosting schema | ✅ Done | `/web/src/app/blog/[slug]/page.tsx` |
| FAQ schema for relevant pages | ✅ Done | `/web/src/components/seo/faq-schema.tsx` |
| Breadcrumb schema | ✅ Done | `/web/src/app/blog/[slug]/page.tsx` |

### Phase 3: Internationalization SEO ✅ COMPLETE

| Task | Status | Files |
|------|--------|-------|
| Add hreflang links to all pages | ✅ Done | `/web/src/components/seo/hreflang-links.tsx` |
| Dynamic HTML lang attribute | ✅ Done | `/web/src/components/seo/language-html-updater.tsx` |
| Sitemap with language alternates | ✅ Done | `/web/src/app/sitemap.ts` |
| Canonical URL implementation | ✅ Done | All page.tsx files have language-specific canonicals |
| Per-page bilingual metadata | ✅ Done | Home, Wizard, Learn, Compare, Blog pages |

### Phase 4: Content Optimization ⏳ PENDING

| Task | Status | Notes |
|------|--------|-------|
| Optimize existing blog posts metadata | ⏳ Future | Blog posts already have bilingual metadata |
| Add internal linking | ⏳ Future | Add 3-5 related posts per article |
| Create missing high-value content | ⏳ Future | See keyword strategy section |
| Image alt text optimization | ⏳ Future | Audit blog images for Thai/English alts |

### Phase 5: Analytics & Monitoring ⏳ PENDING (Manual Setup Required)

| Task | Status | Action Required |
|------|--------|-----------------|
| Google Analytics 4 setup | ⏳ Ready | Component created, add `NEXT_PUBLIC_GA_ID` env var |
| Google Search Console setup | ⏳ Pending | Verify site and submit sitemap |
| Core Web Vitals monitoring | ⏳ Pending | Run Lighthouse after deployment |
| Keyword ranking tracking | ⏳ Pending | Set up Ahrefs/SEMrush tracking |

---

## Monitoring & Analytics

### Tools to Set Up

1. **Google Search Console**
   - Submit sitemaps
   - Monitor indexing status
   - Track search queries
   - Fix crawl errors

2. **Google Analytics 4**
   - Traffic analysis
   - User behavior
   - Conversion tracking
   - Language segment analysis

3. **Core Web Vitals Monitoring**
   - PageSpeed Insights
   - Chrome UX Report
   - Lighthouse CI

### KPIs to Track

| Metric | Target | Measurement |
|--------|--------|-------------|
| Organic Traffic | +50% in 6 months | GA4 |
| Indexed Pages | 150+ pages | GSC |
| Thai Keyword Rankings | Top 10 for 20 keywords | Ahrefs/SEMrush |
| English Keyword Rankings | Top 10 for 10 keywords | Ahrefs/SEMrush |
| Core Web Vitals Pass Rate | 90%+ | PageSpeed Insights |
| Blog CTR | 5%+ | GSC |

### Monthly SEO Checklist

- [ ] Check Google Search Console for errors
- [ ] Review keyword rankings (TH + EN)
- [ ] Monitor Core Web Vitals
- [ ] Check sitemap indexing status
- [ ] Review top-performing content
- [ ] Identify content gaps
- [ ] Update outdated content
- [ ] Add new internal links

---

## Appendix

### A. Thai SEO Best Practices

1. **Language Mixing**: Thai users often mix Thai and English in searches (e.g., "ประกันสุขภาพ AIA")
2. **Mobile First**: 90%+ Thai internet users are on mobile
3. **Local Search**: Include location terms (Bangkok, Thailand)
4. **Seasonal Trends**: Monitor trends around tax season (Feb-Mar)
5. **Social Signals**: Thai users discover content via Facebook, Line, Pantip

### B. Technical SEO Checklist

#### Completed ✅
- [x] robots.txt created and validated
- [x] sitemap.xml created (dynamic generation)
- [x] All pages have unique title tags
- [x] All pages have unique meta descriptions
- [x] hreflang tags implemented
- [x] Canonical URLs set
- [x] JSON-LD schema implemented (Organization, Website, BlogPosting, Breadcrumb, FAQ)
- [x] Mobile-friendly (responsive - existing)
- [x] HTTPS enabled (Vercel default)
- [x] Thai font (Noto Sans Thai) added
- [x] Preconnect links added

#### Pending ⏳
- [ ] sitemap.xml submitted to GSC (requires manual action)
- [ ] Google Search Console verification
- [ ] Google Analytics ID configured
- [ ] OG image created (branded 1200x630px)
- [ ] Logo.png created for schema
- [ ] No broken links audit (404s)
- [ ] Image alt text audit
- [ ] Core Web Vitals passing (run Lighthouse)

### C. Resources

- [Google's Article Schema Documentation](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Next.js SEO Guide](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Technical SEO Checklist 2025](https://www.digitalapplied.com/blog/technical-seo-checklist-2025)
- [Thai SEO Guide](https://www.ranktracker.com/blog/a-complete-guide-for-doing-seo-in-thailand/)
- [next-intl Documentation](https://next-intl.dev/docs/environments/actions-metadata-route-handlers)

---

*Last Updated: January 4, 2026*
*Version: 2.0 - Phases 1-3 Complete*
