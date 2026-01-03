"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Activity,
  PiggyBank,
  Landmark,
  ArrowRight,
  Clock,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

const insuranceTypes = [
  {
    id: "health",
    icon: Shield,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    products: ["Platinum 80MB/100MB", "All Hos Platinum", "BDMS First Class"],
  },
  {
    id: "critical-illness",
    icon: Activity,
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    products: ["CI 48 Beyond", "Multi Care"],
  },
  {
    id: "savings",
    icon: PiggyBank,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    products: ["My Double Plus"],
  },
  {
    id: "pension",
    icon: Landmark,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    products: ["Pension Plus 85A55"],
  },
];

const translations: Record<string, Record<string, string>> = {
  en: {
    "learn.title": "Understanding Insurance Plans",
    "learn.subtitle": "Learn about different types of insurance and find the right coverage for your needs",
    "learn.health.title": "Health Insurance",
    "learn.health.desc": "Comprehensive medical coverage for hospital stays, surgeries, and outpatient care",
    "learn.health.benefit1": "IPD coverage up to 80-100M THB/year",
    "learn.health.benefit2": "OPD, dental, and vaccination benefits",
    "learn.health.benefit3": "Worldwide coverage options",
    "learn.critical-illness.title": "Critical Illness Insurance",
    "learn.critical-illness.desc": "Lump sum payment upon diagnosis of serious illnesses like cancer, heart disease, or stroke",
    "learn.critical-illness.benefit1": "Coverage for 75-81 diseases",
    "learn.critical-illness.benefit2": "Up to 840% payout with Multi Care",
    "learn.critical-illness.benefit3": "Re-claim feature for recurring diseases",
    "learn.savings.title": "Savings Insurance",
    "learn.savings.desc": "Build wealth while protecting your family with guaranteed returns",
    "learn.savings.benefit1": "115% life coverage",
    "learn.savings.benefit2": "140% maturity benefit",
    "learn.savings.benefit3": "Tax deduction up to 100,000 THB",
    "learn.pension.title": "Pension Insurance",
    "learn.pension.desc": "Secure your retirement with guaranteed monthly income",
    "learn.pension.benefit1": "Annual pension from age 55-85",
    "learn.pension.benefit2": "10% guaranteed return + bonus",
    "learn.pension.benefit3": "Tax deduction up to 200,000 THB",
    "learn.availableProducts": "Available Products",
    "learn.learnMore": "Learn More",
    "learn.startWizard": "Find Your Plan",
    "learn.readingTime": "5 min read",
    "learn.whyNeed": "Why You Need It",
    "learn.comparison": "Compare All Types",
    "learn.comparisonDesc": "See how different insurance types compare and which one is right for you",
  },
  th: {
    "learn.title": "ทำความรู้จักแผนประกัน",
    "learn.subtitle": "เรียนรู้เกี่ยวกับประกันแต่ละประเภท และค้นหาความคุ้มครองที่เหมาะกับคุณ",
    "learn.health.title": "ประกันสุขภาพ",
    "learn.health.desc": "ความคุ้มครองค่ารักษาพยาบาลครบวงจร ทั้งค่าห้อง ค่าผ่าตัด และผู้ป่วยนอก",
    "learn.health.benefit1": "IPD สูงสุด 80-100 ล้านบาท/ปี",
    "learn.health.benefit2": "OPD ทันตกรรม และวัคซีน",
    "learn.health.benefit3": "ตัวเลือกคุ้มครองทั่วโลก",
    "learn.critical-illness.title": "ประกันโรคร้ายแรง",
    "learn.critical-illness.desc": "รับเงินก้อนทันทีเมื่อตรวจพบโรคร้ายแรง เช่น มะเร็ง โรคหัวใจ โรคหลอดเลือดสมอง",
    "learn.critical-illness.benefit1": "คุ้มครอง 75-81 โรค",
    "learn.critical-illness.benefit2": "จ่ายสูงสุด 840% กับ Multi Care",
    "learn.critical-illness.benefit3": "เคลมซ้ำได้หากโรคกลับมา",
    "learn.savings.title": "ประกันออมทรัพย์",
    "learn.savings.desc": "สะสมความมั่งคั่งพร้อมคุ้มครองครอบครัว ด้วยผลตอบแทนที่แน่นอน",
    "learn.savings.benefit1": "คุ้มครองชีวิต 115%",
    "learn.savings.benefit2": "รับคืน 140% เมื่อครบสัญญา",
    "learn.savings.benefit3": "ลดหย่อนภาษีได้ถึง 100,000 บาท",
    "learn.pension.title": "ประกันบำนาญ",
    "learn.pension.desc": "วางแผนเกษียณอย่างมั่นคง ด้วยรายได้ประจำที่การันตี",
    "learn.pension.benefit1": "รับเงินบำนาญอายุ 55-85 ปี",
    "learn.pension.benefit2": "การันตีผลตอบแทน 10% + โบนัส",
    "learn.pension.benefit3": "ลดหย่อนภาษีได้ถึง 200,000 บาท",
    "learn.availableProducts": "แผนที่มีให้เลือก",
    "learn.learnMore": "อ่านเพิ่มเติม",
    "learn.startWizard": "ค้นหาแผนของคุณ",
    "learn.readingTime": "อ่าน 5 นาที",
    "learn.whyNeed": "ทำไมต้องมี",
    "learn.comparison": "เปรียบเทียบทุกประเภท",
    "learn.comparisonDesc": "ดูการเปรียบเทียบประกันแต่ละประเภท และเลือกแบบที่เหมาะกับคุณ",
  },
};

export default function LearnPage() {
  const { language } = useLanguage();
  const t = (key: string) => translations[language][key] || key;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            {language === "th" ? "ศูนย์การเรียนรู้" : "Learning Center"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t("learn.title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("learn.subtitle")}
          </p>
        </motion.div>

        {/* Insurance Type Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {insuranceTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full border-2 ${type.borderColor} hover:shadow-lg transition-shadow`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                          {t(`learn.${type.id}.title`)}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {t("learn.readingTime")}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">
                      {t(`learn.${type.id}.desc`)}
                    </p>

                    {/* Benefits */}
                    <div className="space-y-2 mb-4">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {t(`learn.${type.id}.benefit${num}`)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Products */}
                    <div className={`${type.bgColor} rounded-lg p-3 mb-4`}>
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        {t("learn.availableProducts")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {type.products.map((product) => (
                          <span
                            key={product}
                            className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link href={`/learn/${type.id}`} className="flex-1">
                        <Button variant="outline" className="w-full gap-2">
                          {t("learn.learnMore")}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/wizard/${type.id}`} className="flex-1">
                        <Button className="w-full gap-2">
                          {t("learn.startWizard")}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-gray-200">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {t("learn.comparison")}
                  </h2>
                  <p className="text-gray-600">
                    {t("learn.comparisonDesc")}
                  </p>
                </div>
                <Link href="/learn/compare">
                  <Button size="lg" className="gap-2">
                    {language === "th" ? "ดูตารางเปรียบเทียบ" : "View Comparison"}
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
