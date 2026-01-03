"use client";

import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { useLanguage } from "@/contexts/language-context";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { ArrowRight, Heart, Shield, Sparkles, Star, Users, Zap, TrendingUp, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// Animated counter component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [count, value, isInView]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
    return unsubscribe;
  }, [rounded]);

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
}

// Floating particle component
function FloatingParticle({ delay, duration, x, y, size }: { delay: number; duration: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        y: [y, y - 100],
        x: [x, x + (Math.random() - 0.5) * 50],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
    />
  );
}

export function HeroSection() {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const { t } = useLanguage();

  const stats = [
    { value: 50000, suffix: "+", labelKey: "common.customersProtected" },
    { value: 4.9, suffix: "", labelKey: "common.rating", icon: Star, isDecimal: true },
    { value: 24, suffix: "/7", labelKey: "common.support" },
  ];

  const insuranceTypes = [
    { icon: Shield, labelKey: "hero.health", color: "from-blue-500 to-cyan-500", shadowColor: "shadow-blue-500/30" },
    { icon: Heart, labelKey: "hero.life", color: "from-pink-500 to-rose-500", shadowColor: "shadow-pink-500/30" },
    { icon: Users, labelKey: "hero.family", color: "from-purple-500 to-indigo-500", shadowColor: "shadow-purple-500/30" },
  ];

  const floatingIcons = [
    { Icon: Shield, x: 10, y: 20, delay: 0 },
    { Icon: Heart, x: 85, y: 15, delay: 0.5 },
    { Icon: Star, x: 5, y: 70, delay: 1 },
    { Icon: Zap, x: 90, y: 60, delay: 1.5 },
    { Icon: TrendingUp, x: 15, y: 45, delay: 2 },
    { Icon: CheckCircle, x: 80, y: 80, delay: 2.5 },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary rotating gradient orb */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
        />
        {/* Secondary rotating gradient orb */}
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-pink-400/30 to-orange-400/30 rounded-full blur-3xl"
        />
        {/* Center pulsing gradient */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.5}
            duration={4 + Math.random() * 2}
            x={Math.random() * 100}
            y={60 + Math.random() * 40}
            size={4 + Math.random() * 8}
          />
        ))}

        {/* Floating icons */}
        {floatingIcons.map(({ Icon, x, y, delay }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              y: [y + "%", (y - 5) + "%", y + "%"],
              rotate: [-10, 10, -10],
            }}
            transition={{
              duration: 4,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute hidden lg:block"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <Icon className="w-8 h-8 text-gray-300" />
          </motion.div>
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Trust Badge with glow effect */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-10"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(59, 130, 246, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200/50"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <span className="text-sm font-semibold">
              {t("hero.badge")}
            </span>
          </motion.div>
        </motion.div>

        {/* Main Headline with character animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="block"
            >
              {t("hero.title1")}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="block relative"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t("hero.title2")}
              </span>
              {/* Animated underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full origin-left"
              />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl block mt-2"
            >
              {t("hero.title3")}
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            {t("hero.subtitle")}
          </motion.p>
        </motion.div>

        {/* Insurance Type Cards with staggered animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4 sm:gap-6 lg:gap-10 mb-14"
        >
          {insuranceTypes.map(({ icon: Icon, labelKey, color, shadowColor }, index) => (
            <motion.div
              key={labelKey}
              initial={{ opacity: 0, y: 50, rotateY: -30 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{
                delay: 0.6 + index * 0.15,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.08,
                y: -10,
                rotateY: 5,
                rotateX: -5,
              }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex flex-col items-center gap-3 p-5 sm:p-8 lg:p-12 rounded-2xl cursor-pointer
                bg-gradient-to-br ${color} text-white shadow-2xl ${shadowColor}
                hover:shadow-3xl transition-all min-w-[100px] sm:min-w-[140px] lg:min-w-[200px]
                transform perspective-1000
              `}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut",
                }}
              >
                <Icon className="w-10 h-10 lg:w-14 lg:h-14" />
              </motion.div>
              <span className="font-semibold lg:text-xl">{t(labelKey)}</span>

              {/* Shine effect */}
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "200%", opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  delay: index * 0.5,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons with pulse animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-16 px-4"
        >
          <Link href="/wizard" className="w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              {/* Animated glow ring */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg"
              />
              <Button
                size="lg"
                variant="gradient"
                className="relative group w-full sm:w-auto text-lg px-8 py-6"
              >
                {t("common.findMyPlan")}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.div>
              </Button>
            </motion.div>
          </Link>
          <Link href="/compare" className="w-full sm:w-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6">
                {t("common.compareMyCurrentPlan")}
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats with animated counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex justify-center gap-10 sm:gap-20 lg:gap-32"
        >
          {stats.map(({ value, suffix, labelKey, icon: Icon, isDecimal }, index) => (
            <motion.div
              key={labelKey}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + index * 0.1, type: "spring", stiffness: 100 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-1 lg:gap-2">
                {Icon && (
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    <Icon className="w-5 h-5 lg:w-7 lg:h-7 text-yellow-500 fill-yellow-500" />
                  </motion.div>
                )}
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
                  {isDecimal ? (
                    <span>{value}</span>
                  ) : (
                    <AnimatedCounter value={value} suffix={suffix} />
                  )}
                </span>
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                className="text-sm lg:text-base text-gray-500"
              >
                {t(labelKey)}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating CTA for Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 sm:hidden z-40"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 -4px 20px rgba(59, 130, 246, 0.2)",
                "0 -4px 40px rgba(59, 130, 246, 0.4)",
                "0 -4px 20px rgba(59, 130, 246, 0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-full"
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
        </motion.div>
      </div>

      {/* Lead Capture Modal */}
      <Modal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)}>
        <ModalHeader>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("common.getFreeQuoteNow")}
          </h2>
          <p className="text-gray-600 mt-1">{t("common.tellUsReach")}</p>
        </ModalHeader>
        <ModalContent>
          <LeadCaptureForm onSuccess={() => setShowLeadModal(false)} />
        </ModalContent>
      </Modal>
    </section>
  );
}
