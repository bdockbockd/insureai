"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Somchai K.",
    role: "Business Owner",
    avatar: "SK",
    rating: 5,
    text: "InsureAI helped me find a health insurance plan that saved me 30% compared to what I was paying before. The comparison tool showed exactly where my old plan was lacking.",
    planType: "Health Insurance",
  },
  {
    id: 2,
    name: "Pranee W.",
    role: "Working Professional",
    avatar: "PW",
    rating: 5,
    text: "I was overwhelmed by all the insurance options out there. The AI recommendation was spot-on for my family's needs. Got covered in just 2 days!",
    planType: "Family Protection",
  },
  {
    id: 3,
    name: "Michael T.",
    role: "Expat in Bangkok",
    avatar: "MT",
    rating: 5,
    text: "As a foreigner, understanding Thai insurance was challenging. InsureAI made it simple. The advisor contacted me via LINE and helped with everything.",
    planType: "International Health",
  },
  {
    id: 4,
    name: "Nattaya S.",
    role: "Young Professional",
    avatar: "NS",
    rating: 5,
    text: "Finally, an insurance platform that speaks my language! Found critical illness coverage I didn't even know I needed. Very impressed with the service.",
    planType: "Critical Illness",
  },
];

export function TestimonialsSection() {
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
            Loved by Thousands of Families
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            See what our customers have to say about their experience with InsureAI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 relative"
            >
              <Quote className="absolute top-8 right-8 w-10 h-10 text-blue-200" />

              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 mb-5 leading-relaxed">{testimonial.text}</p>

              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {testimonial.planType}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
