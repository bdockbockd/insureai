"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { href: "/", labelKey: "nav.home" },
    { href: "/wizard", labelKey: "nav.findPlan" },
    { href: "/compare", labelKey: "nav.compare" },
    { href: "/blog", labelKey: "nav.blog" },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "th" : "en");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-xl text-gray-900 leading-tight">InsureAI</span>
                <span className="text-[10px] sm:text-xs text-gray-500 leading-tight">{t("common.poweredByAllianz")}</span>
              </div>
            </Link>

            {/* Desktop Navigation - centered in remaining space */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
              {navLinks.map(({ href, labelKey }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  {t(labelKey)}
                </Link>
              ))}
            </nav>

            {/* Spacer for mobile to push menu button to right */}
            <div className="flex-1 md:hidden" />

            {/* Desktop CTA - aligned to right edge */}
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4" />
                {language === "en" ? "EN" : "TH"}
              </button>
              <Link href="/wizard">
                <Button size="sm">{t("nav.getFreeQuote")}</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100"
          >
            <div className="px-4 sm:px-6 py-4 space-y-3">
              {navLinks.map(({ href, labelKey }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  {t(labelKey)}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 py-2 text-gray-600 hover:text-gray-900 font-medium w-full"
                >
                  <Globe className="w-5 h-5" />
                  {language === "en" ? "English" : "ภาษาไทย"}
                </button>
              </div>
              <Link href="/wizard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full mt-4">{t("nav.getFreeQuote")}</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
