"use client";

import Link from "next/link";
import { Shield, Facebook, Instagram, MessageCircle, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: MessageCircle, href: "https://line.me", label: "LINE" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    products: [
      { labelKey: "footer.healthInsurance", href: "/wizard?type=health" },
      { labelKey: "footer.lifeInsurance", href: "/wizard?type=life" },
      { labelKey: "footer.criticalIllness", href: "/wizard?type=critical-illness" },
      { labelKey: "footer.motorInsurance", href: "/wizard?type=motor" },
      { labelKey: "footer.travelInsurance", href: "/wizard?type=travel" },
    ],
    company: [
      { labelKey: "footer.aboutUs", href: "/about" },
      { labelKey: "footer.blog", href: "/blog" },
      { labelKey: "footer.careers", href: "/careers" },
      { labelKey: "footer.contact", href: "/contact" },
      { labelKey: "footer.partnerWithUs", href: "/partners" },
    ],
    support: [
      { labelKey: "footer.faq", href: "/faq" },
      { labelKey: "footer.claims", href: "/claims" },
      { labelKey: "footer.policyPortal", href: "/portal" },
      { labelKey: "footer.findHospital", href: "/hospitals" },
    ],
    legal: [
      { labelKey: "footer.privacyPolicy", href: "/privacy" },
      { labelKey: "footer.termsOfService", href: "/terms" },
      { labelKey: "footer.cookiePolicy", href: "/cookies" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white">InsureAI</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              {t("footer.brandDescription")}
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.products")}</h3>
            <ul className="space-y-2">
              {footerLinks.products.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">
                    {t(labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">
                    {t(labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.support")}</h3>
            <ul className="space-y-2">
              {footerLinks.support.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">
                    {t(labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.contactUs")}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                <a href="tel:1378" className="hover:text-white">{t("footer.hotline")}</a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MessageCircle className="w-4 h-4" />
                <a href="https://line.me" className="hover:text-white">@InsureAI</a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@insureai.com" className="hover:text-white">support@insureai.com</a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Bangkok, Thailand</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} InsureAI. {t("footer.allRightsReserved")}
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map(({ labelKey, href }) => (
                <Link
                  key={labelKey}
                  href={href}
                  className="text-sm text-gray-500 hover:text-white transition-colors"
                >
                  {t(labelKey)}
                </Link>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4 text-center sm:text-left">
            {t("footer.legalDisclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
