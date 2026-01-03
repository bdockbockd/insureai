"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Activity,
  PiggyBank,
  Heart,
  Download,
  Eye,
  X,
  FileText,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

interface Brochure {
  id: string;
  name_th: string;
  name_en: string;
  category: string;
  category_th: string;
  path: string;
  description_th: string;
  description_en: string;
}

const brochures: Brochure[] = [
  // Health Insurance
  {
    id: "first-class-all-hospital",
    name_th: "First Class All Hospital 80/100 MB",
    name_en: "First Class All Hospital 80/100 MB",
    category: "health",
    category_th: "ประกันสุขภาพ",
    path: "/brochures/health/first-class-all-hospital.pdf",
    description_th: "แผนประกันสุขภาพระดับพรีเมียม วงเงินสูงสุด 80-100 ล้านบาท/ปี",
    description_en: "Premium health plan with up to 80-100M THB annual coverage"
  },
  {
    id: "double-care-all-hospital",
    name_th: "Double Care All Hospital (8-30 MB)",
    name_en: "Double Care All Hospital (8-30 MB)",
    category: "health",
    category_th: "ประกันสุขภาพ",
    path: "/brochures/health/double-care-all-hospital.pdf",
    description_th: "แผนประกันสุขภาพยืดหยุ่น เลือกใช้ได้ทุกโรงพยาบาล",
    description_en: "Flexible health plan for any hospital"
  },
  {
    id: "first-class-bdms",
    name_th: "First Class BDMS 60/120 MB",
    name_en: "First Class BDMS 60/120 MB",
    category: "health",
    category_th: "ประกันสุขภาพ",
    path: "/brochures/health/first-class-bdms.pdf",
    description_th: "แผน VIP สำหรับโรงพยาบาลเครือ BDMS วงเงิน 60-120 ล้านบาท/ปี",
    description_en: "VIP plan for BDMS network with 60-120M THB coverage"
  },
  // Critical Illness
  {
    id: "ci-48-beyond",
    name_th: "CI 48 Beyond",
    name_en: "CI 48 Beyond",
    category: "critical-illness",
    category_th: "ประกันโรคร้ายแรง",
    path: "/brochures/critical-illness/ci-48-beyond.pdf",
    description_th: "คุ้มครอง 75 โรค/ภาวะ จ่ายสูงสุด 170%",
    description_en: "Covers 75 diseases/conditions with up to 170% payout"
  },
  {
    id: "multi-care",
    name_th: "Multi Care",
    name_en: "Multi Care",
    category: "critical-illness",
    category_th: "ประกันโรคร้ายแรง",
    path: "/brochures/critical-illness/multi-care.pdf",
    description_th: "คุ้มครอง 81 โรค จ่ายสูงสุด 840% เคลมซ้ำได้",
    description_en: "Covers 81 diseases with up to 840% payout, re-claim feature"
  },
  // Savings & Pension
  {
    id: "my-double-plus",
    name_th: "My Double Plus",
    name_en: "My Double Plus",
    category: "savings-pension",
    category_th: "ประกันออมทรัพย์",
    path: "/brochures/savings-pension/my-double-plus.pdf",
    description_th: "ออมเงิน + คุ้มครองชีวิต รับเงินคืน 140%",
    description_en: "Savings + Life coverage with 140% maturity benefit"
  },
  {
    id: "pension-plus-85a55",
    name_th: "Pension Plus 85A55",
    name_en: "Pension Plus 85A55",
    category: "savings-pension",
    category_th: "ประกันบำนาญ",
    path: "/brochures/savings-pension/pension-plus-85a55.pdf",
    description_th: "รับเงินบำนาญทุกปี ตั้งแต่อายุ 55-85 ปี",
    description_en: "Annual pension from age 55 to 85"
  },
  // Life Insurance
  {
    id: "high-capital-life",
    name_th: "แผนทุนชีวิตสูง",
    name_en: "High Capital Life Plan",
    category: "life-insurance",
    category_th: "ประกันชีวิต",
    path: "/brochures/life-insurance/high-capital-life.pdf",
    description_th: "ทุนประกันสูง คุ้มครองครอบครัว เบี้ยประหยัด",
    description_en: "High sum insured for family protection at affordable premium"
  },
];

const categories = [
  { id: "all", name_th: "ทั้งหมด", name_en: "All", icon: FileText, color: "from-gray-500 to-gray-600" },
  { id: "health", name_th: "ประกันสุขภาพ", name_en: "Health", icon: Shield, color: "from-blue-500 to-cyan-500" },
  { id: "critical-illness", name_th: "โรคร้ายแรง", name_en: "Critical Illness", icon: Activity, color: "from-purple-500 to-indigo-500" },
  { id: "savings-pension", name_th: "ออมทรัพย์/บำนาญ", name_en: "Savings/Pension", icon: PiggyBank, color: "from-green-500 to-emerald-500" },
  { id: "life-insurance", name_th: "ประกันชีวิต", name_en: "Life", icon: Heart, color: "from-pink-500 to-rose-500" },
];

export default function BrochuresPage() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewingBrochure, setViewingBrochure] = useState<Brochure | null>(null);

  const filteredBrochures = selectedCategory === "all"
    ? brochures
    : brochures.filter(b => b.category === selectedCategory);

  const getCategoryIcon = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.icon || FileText;
  };

  const getCategoryColor = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.color || "from-gray-500 to-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            {language === "th" ? "กลับหน้าหลัก" : "Back to Home"}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {language === "th" ? "โบรชัวร์แผนประกัน" : "Insurance Plan Brochures"}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              {language === "th"
                ? "ดาวน์โหลดหรืออ่านโบรชัวร์ออนไลน์ได้ทันที เพื่อศึกษารายละเอียดแผนประกันที่คุณสนใจ"
                : "Download or read brochures online instantly to learn about insurance plans you're interested in"}
            </p>
          </motion.div>
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {categories.map(({ id, name_th, name_en, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all
                ${selectedCategory === id
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {language === "th" ? name_th : name_en}
            </button>
          ))}
        </motion.div>

        {/* Brochures Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrochures.map((brochure, index) => {
            const Icon = getCategoryIcon(brochure.category);
            const color = getCategoryColor(brochure.category);

            return (
              <motion.div
                key={brochure.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    {/* Icon and Category */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {language === "th" ? brochure.category_th : brochure.category.replace("-", " ").toUpperCase()}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {language === "th" ? brochure.name_th : brochure.name_en}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                      {language === "th" ? brochure.description_th : brochure.description_en}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingBrochure(brochure)}
                        className="flex-1 gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        {language === "th" ? "อ่านออนไลน์" : "View Online"}
                      </Button>
                      <a
                        href={brochure.path}
                        download
                        className="flex-1"
                      >
                        <Button variant="gradient" size="sm" className="w-full gap-2">
                          <Download className="w-4 h-4" />
                          {language === "th" ? "ดาวน์โหลด" : "Download"}
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredBrochures.length === 0 && (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === "th" ? "ไม่พบโบรชัวร์" : "No brochures found"}
            </h3>
            <p className="text-gray-500">
              {language === "th" ? "กรุณาเลือกหมวดหมู่อื่น" : "Please select another category"}
            </p>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {language === "th" ? "ต้องการคำแนะนำ?" : "Need advice?"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                {language === "th"
                  ? "ถามคำถามเกี่ยวกับแผนประกันได้เลย AI ของเราพร้อมช่วยเหลือ 24/7"
                  : "Ask questions about insurance plans. Our AI is ready to help 24/7"}
              </p>
              <Link href="/ai-assist">
                <Button size="lg" variant="gradient" className="gap-2">
                  {language === "th" ? "ถาม AI ผู้ช่วย" : "Ask AI Assistant"}
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* PDF Viewer Modal */}
      {viewingBrochure && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setViewingBrochure(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-5xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900">
                  {language === "th" ? viewingBrochure.name_th : viewingBrochure.name_en}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === "th" ? viewingBrochure.category_th : viewingBrochure.category}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a href={viewingBrochure.path} download>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    {language === "th" ? "ดาวน์โหลด" : "Download"}
                  </Button>
                </a>
                <a href={viewingBrochure.path} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    {language === "th" ? "เปิดในแท็บใหม่" : "Open in new tab"}
                  </Button>
                </a>
                <button
                  onClick={() => setViewingBrochure(null)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* PDF Embed */}
            <div className="h-[calc(100%-72px)]">
              <iframe
                src={`${viewingBrochure.path}#toolbar=0&navpanes=0`}
                className="w-full h-full"
                title={viewingBrochure.name_en}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
