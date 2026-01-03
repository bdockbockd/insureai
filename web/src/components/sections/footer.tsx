"use client";

import Link from "next/link";
import { Shield, Facebook, Instagram, MessageCircle, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  products: [
    { label: "Health Insurance", href: "/wizard?type=health" },
    { label: "Life Insurance", href: "/wizard?type=life" },
    { label: "Critical Illness", href: "/wizard?type=critical-illness" },
    { label: "Motor Insurance", href: "/wizard?type=motor" },
    { label: "Travel Insurance", href: "/wizard?type=travel" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Partner With Us", href: "/partners" },
  ],
  support: [
    { label: "FAQ", href: "/faq" },
    { label: "Claims", href: "/claims" },
    { label: "Policy Portal", href: "/portal" },
    { label: "Find a Hospital", href: "/hospitals" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: MessageCircle, href: "https://line.me", label: "LINE" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
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
              AI-powered insurance recommendations backed by Allianz - the world&apos;s #1 insurer.
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
            <h3 className="font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                <a href="tel:1378" className="hover:text-white">1378 (24/7)</a>
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
              &copy; {new Date().getFullYear()} InsureAI. All rights reserved.
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-gray-500 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4 text-center sm:text-left">
            InsureAI is an authorized digital partner of Allianz Ayudhya. Insurance products are underwritten by Allianz Ayudhya Assurance PCL and Allianz Ayudhya General Insurance PCL.
          </p>
        </div>
      </div>
    </footer>
  );
}
