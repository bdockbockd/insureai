"use client";

import { Suspense, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
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
    <SessionProvider>
      <LanguageProviderWrapper>
        {children}
      </LanguageProviderWrapper>
    </SessionProvider>
  );
}
