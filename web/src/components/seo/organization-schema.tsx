export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "InsureAI",
    alternateName: "InsureAI Thailand",
    url: "https://insureai-nine.vercel.app",
    logo: "https://insureai-nine.vercel.app/logo.png",
    description:
      "AI-powered insurance comparison platform in Thailand. Compare health insurance, life insurance, and savings plans.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressCountry: "TH",
      addressLocality: "Bangkok",
      addressRegion: "Bangkok",
    },
    sameAs: [
      "https://facebook.com/insureai",
      "https://twitter.com/insureai",
      "https://linkedin.com/company/insureai",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Thai"],
    },
    knowsLanguage: ["en", "th"],
    areaServed: {
      "@type": "Country",
      name: "Thailand",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "InsureAI",
    alternateName: ["InsureAI Thailand", "อินชัวร์เอไอ"],
    url: "https://insureai-nine.vercel.app",
    description:
      "AI-powered insurance comparison platform - ค้นหาประกันที่ใช่ด้วย AI",
    inLanguage: ["en", "th"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://insureai-nine.vercel.app/blog?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
