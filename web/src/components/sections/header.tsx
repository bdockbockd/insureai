"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, Globe, User, LogOut, MessageCircle } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { useWizardStore } from "@/store/wizard-store";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const resetWizard = useWizardStore((state) => state.reset);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", labelKey: "nav.home" },
    { href: "/wizard", labelKey: "nav.findPlan", resetOnClick: true },
    { href: "/compare", labelKey: "nav.analyze" },
    { href: "/community", labelKey: "nav.community" },
    { href: "/ai-assist", labelKey: "nav.aiAssist" },
    { href: "/blog", labelKey: "nav.blog" },
  ];

  const toggleLanguage = () => {
    const newLang = language === "en" ? "th" : "en";
    setLanguage(newLang);
    // Update URL with language parameter while preserving current path
    const newUrl = `${pathname}?lang=${newLang}`;
    router.push(newUrl, { scroll: false });
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
              <span className="font-bold text-lg sm:text-xl text-gray-900">InsureAI</span>
            </Link>

            {/* Desktop Navigation - centered in remaining space */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
              {navLinks.map(({ href, labelKey, resetOnClick }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => resetOnClick && resetWizard()}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  {t(labelKey)}
                </Link>
              ))}
            </nav>

            {/* Spacer for mobile to push menu button to right */}
            <div className="flex-1 md:hidden" />

            {/* Desktop CTA - aligned to right edge */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4" />
                {language === "en" ? "EN" : "TH"}
              </button>

              {status === "loading" ? (
                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
              ) : session?.user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="max-w-[100px] truncate">{session.user.name || session.user.email?.split("@")[0]}</span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                      >
                        <Link
                          href="/ai-assist"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {t("auth.myChats")}
                        </Link>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            handleSignOut();
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          {t("auth.logout")}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {t("auth.login")}
                  </Button>
                </Link>
              )}

              <Link href="/wizard" onClick={() => resetWizard()}>
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
              {navLinks.map(({ href, labelKey, resetOnClick }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (resetOnClick) resetWizard();
                  }}
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  {t(labelKey)}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 py-2 text-gray-600 hover:text-gray-900 font-medium w-full"
                >
                  <Globe className="w-5 h-5" />
                  {language === "en" ? "English" : "ภาษาไทย"}
                </button>

                {session?.user ? (
                  <>
                    <div className="flex items-center gap-2 py-2 text-gray-700 font-medium">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <span>{session.user.name || session.user.email?.split("@")[0]}</span>
                    </div>
                    <Link
                      href="/ai-assist"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-gray-600 hover:text-gray-900 font-medium"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {t("auth.myChats")}
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center gap-2 py-2 text-red-600 hover:text-red-700 font-medium w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      {t("auth.logout")}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-600 hover:text-gray-900 font-medium"
                  >
                    <User className="w-5 h-5" />
                    {t("auth.login")}
                  </Link>
                )}
              </div>
              <Link href="/wizard" onClick={() => {
                setIsMobileMenuOpen(false);
                resetWizard();
              }}>
                <Button className="w-full mt-4">{t("nav.getFreeQuote")}</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
