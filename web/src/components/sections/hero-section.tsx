"use client";

import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { useLanguage } from "@/contexts/language-context";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Shield, Sparkles, Star, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function HeroSection() {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const { t } = useLanguage();

  const stats = [
    { value: "50K+", labelKey: "common.customersProtected" },
    { value: "4.9", labelKey: "common.rating", icon: Star },
    { value: "24/7", labelKey: "common.support" },
  ];

  const insuranceTypes = [
    { icon: Shield, labelKey: "hero.health", color: "from-blue-500 to-cyan-500" },
    { icon: Heart, labelKey: "hero.life", color: "from-pink-500 to-rose-500" },
    { icon: Users, labelKey: "hero.family", color: "from-purple-500 to-indigo-500" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t("hero.badge")}
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {t("hero.title1")}
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("hero.title2")}
            </span>
            <span className="text-3xl sm:text-4xl lg:text-5xl">
              {t("hero.title3")}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </motion.div>

        {/* Insurance Type Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 sm:gap-6 lg:gap-10 mb-14"
        >
          {insuranceTypes.map(({ icon: Icon, labelKey, color }) => (
            <motion.div
              key={labelKey}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex flex-col items-center gap-3 p-5 sm:p-8 lg:p-12 rounded-2xl cursor-pointer
                bg-gradient-to-br ${color} text-white shadow-lg
                hover:shadow-xl transition-shadow min-w-[100px] sm:min-w-[140px] lg:min-w-[200px]
              `}
            >
              <Icon className="w-10 h-10 lg:w-14 lg:h-14" />
              <span className="font-semibold lg:text-xl">{t(labelKey)}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-16 px-4"
        >
          <Link href="/wizard" className="w-full sm:w-auto mt-2">
            <Button
              size="lg"
              variant="gradient"
              className="group w-full sm:w-auto"
            >
              {t("common.findMyPlan")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/compare" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              {t("common.compareMyCurrentPlan")}
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-10 sm:gap-20 lg:gap-32"
        >
          {stats.map(({ value, labelKey, icon: Icon }) => (
            <div key={labelKey} className="text-center">
              <div className="flex items-center justify-center gap-1 lg:gap-2">
                {Icon && (
                  <Icon className="w-5 h-5 lg:w-7 lg:h-7 text-yellow-500 fill-yellow-500" />
                )}
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  {value}
                </span>
              </div>
              <span className="text-sm lg:text-base text-gray-500">{t(labelKey)}</span>
            </div>
          ))}
        </motion.div>

        {/* Floating CTA for Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-100 sm:hidden z-40"
        >
          <Button
            size="lg"
            variant="gradient"
            className="w-full"
            onClick={() => setShowLeadModal(true)}
          >
            {t("common.getFreeQuoteNow")}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      {/* Lead Capture Modal */}
      <Modal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)}>
        <ModalHeader>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("common.getFreeQuoteNow")}
          </h2>
          <p className="text-gray-600 mt-1">Tell us how to reach you</p>
        </ModalHeader>
        <ModalContent>
          <LeadCaptureForm onSuccess={() => setShowLeadModal(false)} />
        </ModalContent>
      </Modal>
    </section>
  );
}
