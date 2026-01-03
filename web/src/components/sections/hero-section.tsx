"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Heart, Users, Sparkles, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import Link from "next/link";

const stats = [
  { value: "50K+", label: "Customers Protected" },
  { value: "4.9", label: "Rating", icon: Star },
  { value: "24/7", label: "Support" },
];

const insuranceTypes = [
  { icon: Shield, label: "Health", color: "from-blue-500 to-cyan-500" },
  { icon: Heart, label: "Life", color: "from-pink-500 to-rose-500" },
  { icon: Users, label: "Family", color: "from-purple-500 to-indigo-500" },
];

export function HeroSection() {
  const [showLeadModal, setShowLeadModal] = useState(false);

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

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-20 pb-16">
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by Allianz - World&apos;s #1 Insurer</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Insurance Plan
            </span>
            <span className="text-3xl sm:text-4xl lg:text-5xl">in 60 Seconds</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered recommendations for you, your family, and loved ones.
            Compare your existing plan and discover better protection.
          </p>
        </motion.div>

        {/* Insurance Type Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-10"
        >
          {insuranceTypes.map(({ icon: Icon, label, color }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex flex-col items-center gap-2 p-4 sm:p-6 rounded-2xl cursor-pointer
                bg-gradient-to-br ${color} text-white shadow-lg
                hover:shadow-xl transition-shadow
              `}
            >
              <Icon className="w-8 h-8" />
              <span className="font-semibold">{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link href="/wizard">
            <Button size="xl" variant="gradient" className="group">
              Find My Plan
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/compare">
            <Button size="xl" variant="outline">
              Compare My Current Plan
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-8 sm:gap-16"
        >
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-1">
                {Icon && <Icon className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</span>
              </div>
              <span className="text-sm text-gray-500">{label}</span>
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
            Get Free Quote Now
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      {/* Lead Capture Modal */}
      <Modal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)}>
        <ModalHeader>
          <h2 className="text-2xl font-bold text-gray-900">Get Your Free Quote</h2>
          <p className="text-gray-600 mt-1">Tell us how to reach you</p>
        </ModalHeader>
        <ModalContent>
          <LeadCaptureForm onSuccess={() => setShowLeadModal(false)} />
        </ModalContent>
      </Modal>
    </section>
  );
}
