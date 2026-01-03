"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const baseUrl = "https://www.xn--q3cxxb8a4e.life";

function HreflangLinksInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Build the current path without lang param
  const currentPath = pathname;

  // Create URLs for each language
  const enUrl = `${baseUrl}${currentPath}?lang=en`;
  const thUrl = `${baseUrl}${currentPath}?lang=th`;
  const defaultUrl = `${baseUrl}${currentPath}`;

  return (
    <>
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="th" href={thUrl} />
      <link rel="alternate" hrefLang="x-default" href={defaultUrl} />
    </>
  );
}

export function HreflangLinks() {
  return (
    <Suspense fallback={null}>
      <HreflangLinksInner />
    </Suspense>
  );
}
