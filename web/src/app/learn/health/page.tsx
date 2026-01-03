"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  ArrowLeft,
  ArrowRight,
  Check,
  Hospital,
  Stethoscope,
  Syringe,
  Globe,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

const products = [
  {
    id: "platinum",
    name: "Platinum 80MB/100MB",
    coverage: "80-100M",
    features: {
      th: ["IPD สูงสุด 80-100 ล้านบาท/ปี", "OPD ครอบคลุม", "วัคซีน", "ตรวจสุขภาพประจำปี", "ทันตกรรม"],
      en: ["IPD up to 80-100M THB/year", "Comprehensive OPD", "Vaccines", "Annual checkup", "Dental"]
    },
    idealFor: {
      th: ["ต้องการความคุ้มครองสูงสุด", "ใช้บริการโรงพยาบาลบ่อย", "ครอบครัว"],
      en: ["High coverage seekers", "Frequent hospital users", "Families"]
    },
    premium: "45,000 - 450,000",
    highlight: true
  },
  {
    id: "all_hos",
    name: "All Hos Platinum",
    coverage: "Flexible",
    features: {
      th: ["เลือกโรงพยาบาลได้ทุกแห่ง", "IPD ครอบคลุม", "เบี้ยประหยัด", "ยืดหยุ่นสูง"],
      en: ["Any hospital coverage", "IPD focused", "Cost-effective", "High flexibility"]
    },
    idealFor: {
      th: ["คนรักความคุ้มค่า", "ต้องการความยืดหยุ่น", "งบประมาณจำกัด"],
      en: ["Budget conscious", "Flexibility seekers", "Limited budget"]
    },
    premium: "25,000 - 250,000",
    highlight: false
  },
  {
    id: "bdms",
    name: "BDMS First Class",
    coverage: "60-120M",
    features: {
      th: ["โรงพยาบาลเครือ BDMS", "วงเงิน 60-120 ล้านบาท/ปี", "OPD รวม", "บริการ VIP"],
      en: ["BDMS network exclusive", "60-120M THB/year", "OPD included", "VIP benefits"]
    },
    idealFor: {
      th: ["ใช้บริการ BDMS เป็นประจำ", "ต้องการบริการระดับพรีเมียม", "ผู้บริหาร"],
      en: ["BDMS hospital loyalists", "Premium service seekers", "Executives"]
    },
    premium: "55,000 - 500,000",
    highlight: false
  }
];

const whyNeedReasons = {
  th: [
    { icon: Hospital, title: "ค่ารักษาพยาบาลสูงขึ้นทุกปี", desc: "ค่ารักษาพยาบาลในประเทศไทยเพิ่มขึ้น 8-10% ต่อปี การผ่าตัดใหญ่อาจมีค่าใช้จ่ายถึงหลายล้านบาท" },
    { icon: Stethoscope, title: "ประกันสังคมไม่เพียงพอ", desc: "ประกันสังคมมีข้อจำกัดด้านวงเงินและโรงพยาบาล ประกันสุขภาพเอกชนให้ความคุ้มครองที่ครอบคลุมกว่า" },
    { icon: Syringe, title: "คุ้มครองโรคร้ายแรง", desc: "โรคมะเร็ง โรคหัวใจ และโรคร้ายแรงอื่นๆ มีค่าใช้จ่ายสูงมาก ประกันช่วยแบ่งเบาภาระ" },
    { icon: Globe, title: "คุ้มครองทั่วโลก", desc: "แผนพรีเมียมคุ้มครองการรักษาในต่างประเทศ เหมาะสำหรับผู้ที่เดินทางบ่อย" }
  ],
  en: [
    { icon: Hospital, title: "Rising Healthcare Costs", desc: "Healthcare costs in Thailand increase 8-10% annually. Major surgeries can cost millions of baht." },
    { icon: Stethoscope, title: "Social Security Limitations", desc: "Social security has coverage and hospital limitations. Private health insurance provides more comprehensive protection." },
    { icon: Syringe, title: "Critical Illness Coverage", desc: "Cancer, heart disease, and other serious illnesses are extremely expensive. Insurance helps share the burden." },
    { icon: Globe, title: "Worldwide Coverage", desc: "Premium plans cover overseas treatment. Perfect for frequent travelers." }
  ]
};

export default function HealthInsuranceLearnPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/learn" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          {language === "th" ? "กลับไปหน้าเรียนรู้" : "Back to Learning"}
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === "th" ? "ประกันสุขภาพ" : "Health Insurance"}
              </h1>
              <p className="text-gray-600">
                {language === "th" ? "โดย Allianz Ayudhya" : "by Allianz Ayudhya"}
              </p>
            </div>
          </div>

          <p className="text-lg text-gray-600">
            {language === "th"
              ? "ประกันสุขภาพช่วยคุ้มครองค่าใช้จ่ายด้านการรักษาพยาบาล ทั้งค่าห้องพัก ค่าผ่าตัด ค่ายา และค่าบริการทางการแพทย์อื่นๆ เมื่อคุณเจ็บป่วยหรือประสบอุบัติเหตุ"
              : "Health insurance protects you from medical expenses including room charges, surgery, medication, and other medical services when you're sick or injured."}
          </p>
        </motion.div>

        {/* Why You Need It */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === "th" ? "ทำไมต้องมีประกันสุขภาพ?" : "Why Do You Need Health Insurance?"}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {whyNeedReasons[language].map((reason, index) => {
              const Icon = reason.icon;
              return (
                <Card key={index} className="border-blue-100">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{reason.title}</h3>
                        <p className="text-sm text-gray-600">{reason.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === "th" ? "แผนประกันสุขภาพที่มีให้เลือก" : "Available Health Insurance Plans"}
          </h2>

          <div className="space-y-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`border-2 ${product.highlight ? "border-blue-300 bg-blue-50/50" : "border-gray-200"}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                        {product.highlight && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {language === "th" ? "แนะนำ" : "Recommended"}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mb-3">
                        {language === "th" ? "วงเงินคุ้มครอง" : "Coverage"}: {product.coverage} {language === "th" ? "บาท/ปี" : "THB/year"}
                      </p>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          {language === "th" ? "ความคุ้มครองหลัก" : "Key Features"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.features[language].map((feature, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs">
                              <Check className="w-3 h-3 text-green-500" />
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          {language === "th" ? "เหมาะสำหรับ" : "Ideal For"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.idealFor[language].map((ideal, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              {ideal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm text-gray-500 mb-1">
                        {language === "th" ? "เบี้ยประกันต่อปี" : "Annual Premium"}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mb-3">
                        {product.premium} {language === "th" ? "บาท" : "THB"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-5">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {language === "th" ? "สิ่งที่ควรรู้" : "Important Notes"}
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• {language === "th" ? "เบี้ยประกันขึ้นอยู่กับอายุและสุขภาพ" : "Premium depends on age and health condition"}</li>
                    <li>• {language === "th" ? "มีระยะรอคอยสำหรับบางโรค" : "Waiting period applies for certain conditions"}</li>
                    <li>• {language === "th" ? "โรคที่เป็นอยู่ก่อนอาจมีข้อยกเว้น" : "Pre-existing conditions may have exclusions"}</li>
                    <li>• {language === "th" ? "ควรอ่านเงื่อนไขกรมธรรม์อย่างละเอียด" : "Read policy terms and conditions carefully"}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <CardContent className="p-6 sm:p-8 text-center">
              <BadgeCheck className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                {language === "th" ? "พร้อมหาแผนที่ใช่สำหรับคุณ?" : "Ready to Find Your Perfect Plan?"}
              </h2>
              <p className="mb-6 opacity-90">
                {language === "th"
                  ? "ตอบคำถามง่ายๆ เพียงไม่กี่ข้อ เราจะแนะนำแผนที่เหมาะกับคุณที่สุด"
                  : "Answer a few simple questions and we'll recommend the best plan for you"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/wizard/health">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
                    {language === "th" ? "เริ่มค้นหาแผน" : "Find My Plan"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
