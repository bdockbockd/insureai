"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";

export function LanguageHtmlUpdater() {
  const { language } = useLanguage();

  useEffect(() => {
    // Update the HTML lang attribute based on selected language
    document.documentElement.lang = language === "th" ? "th" : "en";

    // Update the dir attribute for RTL languages (Thai is LTR, so this is optional)
    document.documentElement.dir = "ltr";
  }, [language]);

  return null;
}
