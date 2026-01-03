"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Activity,
  PiggyBank,
  Landmark,
  Check,
  Search,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

const comparisonData = {
  categories: [
    { key: "purpose", th: "วัตถุประสงค์หลัก", en: "Main Purpose" },
    { key: "coverage_type", th: "ประเภทความคุ้มครอง", en: "Coverage Type" },
    { key: "payout", th: "การจ่ายเงิน", en: "Payout Method" },
    { key: "ideal_age", th: "อายุที่เหมาะสม", en: "Ideal Age" },
    { key: "premium_range", th: "ช่วงเบี้ยประกัน/ปี", en: "Annual Premium Range" },
    { key: "tax_benefit", th: "สิทธิลดหย่อนภาษี", en: "Tax Benefit" },
    { key: "waiting_period", th: "ระยะรอคอย", en: "Waiting Period" },
  ],
  products: [
    {
      type: "health",
      icon: Shield,
      color: "bg-blue-500",
      data: {
        purpose: { th: "คุ้มครองค่ารักษาพยาบาล", en: "Medical expense coverage" },
        coverage_type: { th: "ค่าห้อง ค่าผ่าตัด OPD", en: "Room, Surgery, OPD" },
        payout: { th: "จ่ายตามค่าใช้จ่ายจริง", en: "Reimburse actual expenses" },
        ideal_age: { th: "ทุกวัย (18-80)", en: "All ages (18-80)" },
        premium_range: { th: "25,000 - 500,000 บาท", en: "25,000 - 500,000 THB" },
        tax_benefit: { th: "สูงสุด 25,000 บาท", en: "Up to 25,000 THB" },
        waiting_period: { th: "30-90 วัน", en: "30-90 days" },
      },
    },
    {
      type: "critical-illness",
      icon: Activity,
      color: "bg-purple-500",
      data: {
        purpose: { th: "รับเงินก้อนเมื่อเป็นโรคร้าย", en: "Lump sum on CI diagnosis" },
        coverage_type: { th: "มะเร็ง หัวใจ หลอดเลือดสมอง", en: "Cancer, Heart, Stroke" },
        payout: { th: "จ่ายเป็นเงินก้อนทันที", en: "Lump sum payment" },
        ideal_age: { th: "25-55 ปี", en: "25-55 years" },
        premium_range: { th: "5,000 - 100,000 บาท", en: "5,000 - 100,000 THB" },
        tax_benefit: { th: "สูงสุด 25,000 บาท (รวมสุขภาพ)", en: "Up to 25,000 THB (with health)" },
        waiting_period: { th: "90 วัน", en: "90 days" },
      },
    },
    {
      type: "savings",
      icon: PiggyBank,
      color: "bg-green-500",
      data: {
        purpose: { th: "ออมเงิน + คุ้มครองชีวิต", en: "Savings + Life protection" },
        coverage_type: { th: "เสียชีวิต 115%, ครบสัญญา 140%", en: "Death 115%, Maturity 140%" },
        payout: { th: "รับคืนเมื่อครบสัญญา", en: "Return at maturity" },
        ideal_age: { th: "20-45 ปี", en: "20-45 years" },
        premium_range: { th: "12,000 - 100,000 บาท", en: "12,000 - 100,000 THB" },
        tax_benefit: { th: "สูงสุด 100,000 บาท", en: "Up to 100,000 THB" },
        waiting_period: { th: "ไม่มี", en: "None" },
      },
    },
    {
      type: "pension",
      icon: Landmark,
      color: "bg-amber-500",
      data: {
        purpose: { th: "รายได้หลังเกษียณ", en: "Retirement income" },
        coverage_type: { th: "เงินบำนาญรายปี", en: "Annual pension" },
        payout: { th: "รับบำนาญทุกปี อายุ 55-85", en: "Annual pension age 55-85" },
        ideal_age: { th: "30-55 ปี", en: "30-55 years" },
        premium_range: { th: "20,000 - 200,000 บาท", en: "20,000 - 200,000 THB" },
        tax_benefit: { th: "สูงสุด 200,000 บาท", en: "Up to 200,000 THB" },
        waiting_period: { th: "ไม่มี", en: "None" },
      },
    },
  ],
};

export default function CompareInsurancePage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/learn" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          {language === "th" ? "กลับไปหน้าเรียนรู้" : "Back to Learning"}
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {language === "th" ? "เปรียบเทียบประกันแต่ละประเภท" : "Compare Insurance Types"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === "th"
              ? "ดูความแตกต่างของประกันแต่ละประเภท เพื่อเลือกความคุ้มครองที่เหมาะกับคุณ"
              : "See the differences between insurance types to choose the right coverage for you"}
          </p>
        </motion.div>

        {/* Comparison Table - Mobile Cards */}
        <div className="block lg:hidden space-y-4 mb-10">
          {comparisonData.products.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.div
                key={product.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 border-gray-200">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg ${product.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {language === "th"
                          ? product.type === "health" ? "ประกันสุขภาพ"
                            : product.type === "critical-illness" ? "ประกันโรคร้าย"
                            : product.type === "savings" ? "ประกันออมทรัพย์"
                            : "ประกันบำนาญ"
                          : product.type === "health" ? "Health"
                            : product.type === "critical-illness" ? "Critical Illness"
                            : product.type === "savings" ? "Savings"
                            : "Pension"}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {comparisonData.categories.map((cat) => (
                        <div key={cat.key} className="flex justify-between items-start gap-2">
                          <span className="text-sm text-gray-500 flex-shrink-0">{cat[language]}</span>
                          <span className="text-sm text-gray-900 text-right font-medium">
                            {product.data[cat.key as keyof typeof product.data][language]}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Link href={`/wizard/${product.type}`}>
                        <Button size="icon" variant="outline" title={language === "th" ? "ค้นหาแผน" : "Find Plan"}>
                          <Search className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href="/ai-assist" className="flex-1">
                        <Button variant="gradient" className="w-full gap-2">
                          <Sparkles className="w-4 h-4" />
                          {language === "th" ? "ถาม AI" : "Ask AI"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Table - Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block mb-10"
        >
          <Card className="border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-left text-sm font-semibold text-gray-600 w-48"></th>
                    {comparisonData.products.map((product) => {
                      const Icon = product.icon;
                      return (
                        <th key={product.type} className="p-4 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-xl ${product.color} flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-gray-900">
                              {language === "th"
                                ? product.type === "health" ? "ประกันสุขภาพ"
                                  : product.type === "critical-illness" ? "ประกันโรคร้าย"
                                  : product.type === "savings" ? "ประกันออมทรัพย์"
                                  : "ประกันบำนาญ"
                                : product.type === "health" ? "Health"
                                  : product.type === "critical-illness" ? "Critical Illness"
                                  : product.type === "savings" ? "Savings"
                                  : "Pension"}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.categories.map((cat, rowIndex) => (
                    <tr key={cat.key} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 text-sm font-medium text-gray-700 border-r border-gray-100">
                        {cat[language]}
                      </td>
                      {comparisonData.products.map((product) => (
                        <td key={product.type} className="p-4 text-center text-sm text-gray-600">
                          {product.data[cat.key as keyof typeof product.data][language]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-gray-50 border-t border-gray-200">
                    <td className="p-4"></td>
                    {comparisonData.products.map((product) => (
                      <td key={product.type} className="p-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <Link href={`/wizard/${product.type}`}>
                            <Button size="icon" variant="outline" title={language === "th" ? "ค้นหาแผน" : "Find Plan"}>
                              <Search className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href="/ai-assist">
                            <Button variant="gradient" className="gap-2">
                              <Sparkles className="w-4 h-4" />
                              {language === "th" ? "ถาม AI" : "Ask AI"}
                            </Button>
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-3">
                {language === "th" ? "คุณควรเริ่มจากประกันอะไร?" : "Where Should You Start?"}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>
                    {language === "th"
                      ? "ประกันสุขภาพ - สิ่งแรกที่ทุกคนควรมี เพราะเจ็บป่วยได้ทุกเมื่อ"
                      : "Health Insurance - Everyone's first priority, illness can happen anytime"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>
                    {language === "th"
                      ? "ประกันโรคร้าย - เสริมจากประกันสุขภาพ สำหรับรายได้ที่หายไป"
                      : "Critical Illness - Supplement to health, for lost income"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>
                    {language === "th"
                      ? "ประกันออมทรัพย์/บำนาญ - เมื่อมีฐานะมั่นคง เริ่มวางแผนระยะยาว"
                      : "Savings/Pension - When financially stable, start long-term planning"}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-3">
                {language === "th" ? "ไม่แน่ใจว่าควรเลือกอะไร?" : "Not Sure What to Choose?"}
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                {language === "th"
                  ? "ตอบคำถามง่ายๆ เพียง 5 ข้อ ระบบจะวิเคราะห์ความต้องการและแนะนำแผนที่เหมาะสมกับคุณ"
                  : "Answer just 5 simple questions and our system will analyze your needs and recommend the right plan for you"}
              </p>
              <Link href="/wizard">
                <Button className="w-full gap-2">
                  {language === "th" ? "เริ่มค้นหาแผนที่เหมาะกับคุณ" : "Start Finding Your Plan"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
