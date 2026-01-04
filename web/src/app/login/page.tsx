"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Sparkles, Users, HeadphonesIcon, MessageCircle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function LoginPage() {
  const { t } = useLanguage();

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/ai-assist" });
  };

  const handleFacebookSignIn = () => {
    signIn("facebook", { callbackUrl: "/ai-assist" });
  };

  const benefits = [
    {
      icon: Sparkles,
      titleKey: "auth.benefit1Title",
      descKey: "auth.benefit1Desc",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: Users,
      titleKey: "auth.benefit2Title",
      descKey: "auth.benefit2Desc",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: HeadphonesIcon,
      titleKey: "auth.benefit3Title",
      descKey: "auth.benefit3Desc",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">InsureAI</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <h2 className="text-xl font-bold text-center mb-4">
              {t("auth.whyLogin")}
            </h2>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <benefit.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t(benefit.titleKey)}</h3>
                    <p className="text-sm text-white/80">{t(benefit.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Login Section */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {t("auth.welcome")}
              </h1>
              <p className="text-gray-600 mt-2">
                {t("auth.ssoSubtitle")}
              </p>
            </div>

            {/* SSO Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium text-gray-700">
                  {t("auth.continueWithGoogle")}
                </span>
              </button>

              <button
                onClick={handleFacebookSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] text-white rounded-xl hover:bg-[#166FE5] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="font-medium">
                  {t("auth.continueWithFacebook")}
                </span>
              </button>
            </div>

            {/* Guest Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{t("auth.guestMode")}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("auth.guestModeDesc")}
                  </p>
                </div>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-4">
              {t("auth.termsText")}
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            "auth.feature1",
            "auth.feature2",
            "auth.feature3",
            "auth.feature4",
          ].map((key, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{t(key)}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
