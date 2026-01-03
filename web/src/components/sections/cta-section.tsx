"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import Link from "next/link";

const benefits = [
  "Free personalized recommendations",
  "Compare 100+ insurance plans",
  "Expert advisors available 24/7",
  "No obligation to purchase",
];

export function CTASection() {
  const [showLeadModal, setShowLeadModal] = useState(false);

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

      {/* Animated shapes */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-32 h-32 lg:w-48 lg:h-48 bg-white/10 rounded-full blur-2xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-48 h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-2xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 rounded-full bg-white/20 text-white mb-6 sm:mb-8"
          >
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            <span className="font-medium text-sm sm:text-base lg:text-lg">Start protecting your family today</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 lg:mb-10 leading-tight"
          >
            Ready to Find Your
            <span className="block mt-2">Perfect Insurance Plan?</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 lg:gap-x-10 gap-y-3 mb-10 sm:mb-12 lg:mb-16"
          >
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 text-white/90"
              >
                <Check className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-300" />
                <span className="text-sm sm:text-base lg:text-lg">{benefit}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 lg:gap-6 px-4"
          >
            <Link href="/wizard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 shadow-xl group lg:text-lg lg:h-16 lg:px-10"
              >
                Get Started - It&apos;s Free
                <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white text-white hover:bg-white/20 lg:text-lg lg:h-16 lg:px-10"
              onClick={() => setShowLeadModal(true)}
            >
              Request a Callback
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 sm:mt-10 lg:mt-12 text-white/70 text-sm sm:text-base lg:text-lg"
          >
            Join 50,000+ families who found better protection with InsureAI
          </motion.p>
        </div>
      </div>

      {/* Lead Capture Modal */}
      <Modal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)}>
        <ModalHeader>
          <h2 className="text-2xl font-bold text-gray-900">Request a Callback</h2>
          <p className="text-gray-600 mt-1">Our insurance advisor will contact you shortly</p>
        </ModalHeader>
        <ModalContent>
          <LeadCaptureForm onSuccess={() => setShowLeadModal(false)} />
        </ModalContent>
      </Modal>
    </section>
  );
}
