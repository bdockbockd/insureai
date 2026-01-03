"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Scale,
  Clock,
  Shield,
  Smartphone,
  HeadphonesIcon,
  TrendingUp,
  FileCheck
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Our smart algorithm analyzes your needs and finds the perfect plan from 100+ options.",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Scale,
    title: "Side-by-Side Comparison",
    description: "Upload your current plan and see exactly where you can get better coverage.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Clock,
    title: "60-Second Results",
    description: "No lengthy forms. Just a few quick questions and you&apos;ll have personalized recommendations.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Shield,
    title: "Allianz Backed",
    description: "All plans are from Allianz, the world&apos;s #1 insurance brand with AA rating.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Smartphone,
    title: "Easy Claims",
    description: "Submit claims directly from your phone. Get reimbursed faster than ever.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Advisors",
    description: "Real humans available 24/7 to help you understand your options.",
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
            Why Choose InsureAI?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We combine cutting-edge AI technology with human expertise to find you the best protection.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {features.map(({ icon: Icon, title, description, color }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="group relative p-8 rounded-2xl bg-white border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`
                  w-16 h-16 rounded-xl bg-gradient-to-br ${color}
                  flex items-center justify-center mb-6
                  group-hover:scale-110 transition-transform duration-300
                `}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Tell Us About You",
      description: "Answer a few quick questions about yourself, your family, and what you&apos;re looking for.",
      icon: FileCheck,
    },
    {
      number: "02",
      title: "Get Smart Recommendations",
      description: "Our AI analyzes your needs and matches you with the best Allianz plans.",
      icon: Brain,
    },
    {
      number: "03",
      title: "Compare & Choose",
      description: "See detailed comparisons with your current plan. Understand exactly what you&apos;re getting.",
      icon: Scale,
    },
    {
      number: "04",
      title: "Get Protected",
      description: "Complete your application online or speak with an advisor. Start coverage immediately.",
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
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            From finding the right plan to getting covered - we make it simple.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 -translate-y-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {steps.map(({ number, title, description, icon: Icon }, index) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="absolute -top-4 left-6 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white text-sm font-bold">
                  {number}
                </div>
                <div className="mt-4 mb-5">
                  <Icon className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-8"
        >
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Trusted by 50,000+ Families
            </h3>
            <p className="text-gray-600">
              Protecting lives across Thailand, Southeast Asia, and beyond.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">AA</div>
              <div className="text-sm text-gray-500">S&P Rating</div>
            </div>
            <div className="h-12 w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">130+</div>
              <div className="text-sm text-gray-500">Years Experience</div>
            </div>
            <div className="h-12 w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">70+</div>
              <div className="text-sm text-gray-500">Countries</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
