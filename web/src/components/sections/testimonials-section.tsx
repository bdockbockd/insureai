"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function TestimonialsSection() {
  const { t, language } = useLanguage();

  const testimonials = [
    {
      id: 1,
      name: language === "th" ? "สมชาย ก." : "Somchai K.",
      role: language === "th" ? "เจ้าของธุรกิจ" : "Business Owner",
      avatar: "SK",
      rating: 5,
      text: language === "th"
        ? "InsureAI ช่วยให้ผมหาแผนประกันสุขภาพที่ประหยัดได้ 30% เมื่อเทียบกับที่จ่ายอยู่ เครื่องมือเปรียบเทียบแสดงให้เห็นว่าแผนเดิมขาดอะไรบ้าง"
        : "InsureAI helped me find a health insurance plan that saved me 30% compared to what I was paying before. The comparison tool showed exactly where my old plan was lacking.",
      planType: language === "th" ? "ประกันสุขภาพ" : "Health Insurance",
    },
    {
      id: 2,
      name: language === "th" ? "ปราณี ว." : "Pranee W.",
      role: language === "th" ? "พนักงานบริษัท" : "Working Professional",
      avatar: "PW",
      rating: 5,
      text: language === "th"
        ? "ผมรู้สึกสับสนกับตัวเลือกประกันมากมาย คำแนะนำจาก AI ตรงกับความต้องการของครอบครัวผมมาก ได้รับความคุ้มครองใน 2 วัน!"
        : "I was overwhelmed by all the insurance options out there. The AI recommendation was spot-on for my family's needs. Got covered in just 2 days!",
      planType: language === "th" ? "คุ้มครองครอบครัว" : "Family Protection",
    },
    {
      id: 3,
      name: "Michael T.",
      role: language === "th" ? "ชาวต่างชาติในกรุงเทพฯ" : "Expat in Bangkok",
      avatar: "MT",
      rating: 5,
      text: language === "th"
        ? "ในฐานะชาวต่างชาติ การเข้าใจประกันไทยเป็นเรื่องท้าทาย InsureAI ทำให้ง่ายขึ้น ที่ปรึกษาติดต่อผ่าน LINE และช่วยทุกอย่าง"
        : "As a foreigner, understanding Thai insurance was challenging. InsureAI made it simple. The advisor contacted me via LINE and helped with everything.",
      planType: language === "th" ? "ประกันสุขภาพนานาชาติ" : "International Health",
    },
    {
      id: 4,
      name: language === "th" ? "ณัฐยา ส." : "Nattaya S.",
      role: language === "th" ? "คนทำงานรุ่นใหม่" : "Young Professional",
      avatar: "NS",
      rating: 5,
      text: language === "th"
        ? "ในที่สุดก็มีแพลตฟอร์มประกันที่พูดภาษาเดียวกัน! หาความคุ้มครองโรคร้ายแรงที่ไม่รู้ว่าต้องการ ประทับใจมากกับบริการ"
        : "Finally, an insurance platform that speaks my language! Found critical illness coverage I didn't even know I needed. Very impressed with the service.",
      planType: language === "th" ? "โรคร้ายแรง" : "Critical Illness",
    },
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            {t("testimonials.title")}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("testimonials.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 sm:p-8 lg:p-10 relative"
            >
              <Quote className="absolute top-6 right-6 sm:top-8 sm:right-8 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-200" />

              <div className="flex items-center gap-4 mb-5 lg:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-base sm:text-lg lg:text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg lg:text-xl">{testimonial.name}</h4>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4 lg:mb-5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 mb-5 lg:mb-6 leading-relaxed text-sm sm:text-base lg:text-lg">{testimonial.text}</p>

              <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 lg:px-5 lg:py-2 bg-blue-100 text-blue-700 text-xs sm:text-sm lg:text-base font-medium rounded-full">
                {testimonial.planType}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
