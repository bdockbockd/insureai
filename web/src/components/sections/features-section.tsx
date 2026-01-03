"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Scale,
  Clock,
  Shield,
  Smartphone,
  HeadphonesIcon,
  FileCheck
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const featureKeys = [
  {
    icon: Brain,
    titleKey: "features.aiMatching",
    descKey: "features.aiMatchingDesc",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Scale,
    titleKey: "features.comparison",
    descKey: "features.comparisonDesc",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Clock,
    titleKey: "features.results",
    descKey: "features.resultsDesc",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Shield,
    titleKey: "features.allianzBacked",
    descKey: "features.allianzBackedDesc",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Smartphone,
    titleKey: "features.easyClaims",
    descKey: "features.easyClaimsDesc",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: HeadphonesIcon,
    titleKey: "features.experts",
    descKey: "features.expertsDesc",
    color: "from-teal-500 to-cyan-500",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {t("features.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("features.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12"
        >
          {featureKeys.map(({ icon: Icon, titleKey, descKey, color }) => (
            <motion.div
              key={titleKey}
              variants={itemVariants}
              className="group relative p-6 sm:p-8 lg:p-10 rounded-2xl bg-white border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`
                  w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl bg-gradient-to-br ${color}
                  flex items-center justify-center mb-5 lg:mb-8
                  group-hover:scale-110 transition-transform duration-300
                `}
              >
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3">{t(titleKey)}</h3>
              <p className="text-gray-600 leading-relaxed lg:text-lg">{t(descKey)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const { t } = useLanguage();

  const stepKeys = [
    {
      number: "01",
      titleKey: "howItWorks.step1",
      descKey: "howItWorks.step1Desc",
      icon: FileCheck,
    },
    {
      number: "02",
      titleKey: "howItWorks.step2",
      descKey: "howItWorks.step2Desc",
      icon: Brain,
    },
    {
      number: "03",
      titleKey: "howItWorks.step3",
      descKey: "howItWorks.step3Desc",
      icon: Scale,
    },
    {
      number: "04",
      titleKey: "howItWorks.step4",
      descKey: "howItWorks.step4Desc",
      icon: Shield,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {t("howItWorks.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("howItWorks.subtitle")}
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 -translate-y-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-8">
            {stepKeys.map(({ number, titleKey, descKey, icon: Icon }, index) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="absolute -top-4 left-6 px-4 py-1.5 lg:px-5 lg:py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white text-sm lg:text-base font-bold">
                  {number}
                </div>
                <div className="mt-4 mb-5 lg:mb-6">
                  <Icon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3">{t(titleKey)}</h3>
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-8 lg:gap-16"
        >
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {t("trust.title")}
            </h3>
            <p className="text-gray-600 lg:text-lg">
              {t("trust.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-6 sm:gap-8 lg:gap-12">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">AA</div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-500">{t("trust.spRating")}</div>
            </div>
            <div className="h-10 sm:h-12 lg:h-16 w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">130+</div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-500">{t("trust.yearsExperience")}</div>
            </div>
            <div className="h-10 sm:h-12 lg:h-16 w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">70+</div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-500">{t("trust.countries")}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
