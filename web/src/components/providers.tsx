"use client";

import { Suspense, ReactNode } from "react";
import { LanguageProvider } from "@/contexts/language-context";

function LanguageProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LanguageProvider>{children}</LanguageProvider>
    </Suspense>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProviderWrapper>
      {children}
    </LanguageProviderWrapper>
  );
}
