"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Upload,
  FileText,
  ArrowRight,
  Check,
  X,
  Minus,
  TrendingUp,
  AlertTriangle,
  Shield,
  DollarSign,
  Activity,
  Heart,
  AlertCircle,
  Clock,
  Lock,
  Unlock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { useLanguage } from "@/contexts/language-context";

interface ComparisonItem {
  category: string;
  icon: React.ElementType;
  yourPlan: string | number;
  recommendedPlan: string | number;
  winner: "yours" | "recommended" | "tie";
  importance: "high" | "medium" | "low";
}

interface ExtractedPlan {
  provider: string;
  planName: string;
  planType: string;
  annualPremium: number | null;
  roomAndBoard: { limit: number | null; isUnlimited: boolean };
  opdCoverage: { covered: boolean; limit: number | null };
  ipdCoverage: { covered: boolean; annualLimit: number | null };
  criticalIllness: { covered: boolean; conditions: string[]; sumInsured: number | null };
  keyBenefits: string[];
  limitations: string[];
}

interface AnalysisResult {
  success: boolean;
  extractedPlan: ExtractedPlan;
  recommendedPlans: { planId: string; planName: string; matchScore: number; advantages: string[] }[];
  comparisonTable: { category: string; yourPlan: string; recommended: string; winner: string; importance: string }[];
  savings: { percentage: number; annualAmount: number | null };
  gaps: string[];
}

// Our actual plans from insureai/data folder
const ourPlans = {
  health: [
    { id: "platinum-80mb", name: "Platinum 80MB/100MB", coverage: "80-100M THB/year" },
    { id: "all-hos", name: "All Hos Platinum", coverage: "Flexible" },
    { id: "bdms-first", name: "BDMS First Class", coverage: "60-120M THB/year" },
  ],
  criticalIllness: [
    { id: "multi-care", name: "Multi Care", coverage: "Comprehensive CI" },
    { id: "ci-48-beyond", name: "CI 48 Beyond", coverage: "48 Critical Illnesses" },
  ],
  savings: [
    { id: "my-double-plus", name: "My Double Plus", coverage: "Savings + Protection" },
  ],
  pension: [
    { id: "pension-plus", name: "Pension Plus 85A55", coverage: "Retirement Income" },
  ],
};

// Thai Insurance Providers and Plans Data (competitors)
const insuranceProviders = [
  {
    name: "AIA Thailand",
    plans: ["AIA Health Happy", "AIA Comprehensive Health", "AIA Critical Illness Cover", "AIA Med Excess", "AIA Premier Care"],
  },
  {
    name: "Bangkok Life Assurance",
    plans: ["Prestige Health", "Prestige Health Unlock", "Value Health", "Health Care Plus"],
  },
  {
    name: "Muang Thai Life",
    plans: ["Elite Health Rider", "Elite Health Plus", "Smart Health Rider", "MTL Health Care"],
  },
  {
    name: "Thai Life Insurance",
    plans: ["Thai Life Medicare", "Thai Life Health Plus", "Health Saver", "Health Protection"],
  },
  {
    name: "Prudential Thailand",
    plans: ["PRUSuper Health Guard", "PRUHealthcare Plus", "PRUFirst Health", "PRUMy Care"],
  },
  {
    name: "FWD Thailand",
    plans: ["E-Health Eco", "Easy E-Health", "Precious Care", "Health First", "Cancer Care"],
  },
  {
    name: "AXA Thailand",
    plans: ["SmartCare Essential", "EasyCare Visa", "SwitchCare", "Health Max", "iCare"],
  },
  {
    name: "Generali Thailand",
    plans: ["Gen Health Hero", "Generali Comprehensive Health", "Health Guardian", "Vitality Plan"],
  },
  {
    name: "Cigna Thailand",
    plans: ["Cigna Close Care Silver", "Cigna Close Care Gold", "Cigna Close Care Platinum", "Global Health Access"],
  },
];

// Hook problems that old plans commonly have
const oldPlanProblems = {
  th: [
    { icon: Lock, title: "ล็อควงเงินค่าห้อง", desc: "แผนเก่าจำกัดค่าห้อง 3,000-5,000 บาท ไม่พอกับ รพ. ชั้นนำ" },
    { icon: AlertCircle, title: "ไม่ครอบคลุม OPD", desc: "ต้องนอน รพ. ถึงจะเคลมได้ ตรวจเช็คทั่วไปไม่คุ้มครอง" },
    { icon: Clock, title: "เบี้ยขึ้นทุกปี", desc: "แผนเก่าเบี้ยเพิ่มตามอายุ บางคนเบี้ยแพงกว่าแผนใหม่" },
    { icon: X, title: "ไม่ครอบคลุมโรคร้าย", desc: "มะเร็ง หัวใจ ต้องซื้อเพิ่ม หรือไม่คุ้มครองเลย" },
  ],
  en: [
    { icon: Lock, title: "Room Limit Locked", desc: "Old plans cap room at 3,000-5,000 THB, not enough for top hospitals" },
    { icon: AlertCircle, title: "No OPD Coverage", desc: "Must be hospitalized to claim, regular checkups not covered" },
    { icon: Clock, title: "Premium Increases", desc: "Old plans increase premium with age, sometimes more than new plans" },
    { icon: X, title: "No Critical Illness", desc: "Cancer, heart disease need add-ons or not covered at all" },
  ],
};

export function CompareContent() {
  const { t, language } = useLanguage();

  // Selected recommended plan for comparison (default to Platinum 80MB)
  const [selectedRecommendedPlan] = useState(ourPlans.health[0]);

  const mockComparison: ComparisonItem[] = [
    {
      category: t("compare.roomBoard"),
      icon: Heart,
      yourPlan: "3,000 THB",
      recommendedPlan: "ไม่จำกัด",
      winner: "recommended",
      importance: "high",
    },
    {
      category: t("compare.outpatient"),
      icon: Activity,
      yourPlan: "ไม่คุ้มครอง",
      recommendedPlan: "เหมาจ่าย",
      winner: "recommended",
      importance: "high",
    },
    {
      category: language === "th" ? "เบี้ยประกันรายปี" : "Annual Premium",
      icon: DollarSign,
      yourPlan: "25,000 THB",
      recommendedPlan: "22,000 THB",
      winner: "recommended",
      importance: "high",
    },
    {
      category: t("compare.criticalIllness"),
      icon: Shield,
      yourPlan: t("compare.notIncluded"),
      recommendedPlan: "รวมอยู่ในแผน",
      winner: "recommended",
      importance: "high",
    },
    {
      category: language === "th" ? "วงเงินต่อปี" : "Annual Limit",
      icon: Activity,
      yourPlan: "5 ล้านบาท",
      recommendedPlan: "80 ล้านบาท",
      winner: "recommended",
      importance: "high",
    },
    {
      category: t("compare.waitingPeriod"),
      icon: Clock,
      yourPlan: language === "th" ? "30 วัน" : "30 days",
      recommendedPlan: language === "th" ? "30 วัน" : "30 days",
      winner: "tie",
      importance: "medium",
    },
  ];

  const [step, setStep] = useState<"hook" | "input" | "analyzing" | "results">("hook");
  const [planDetails, setPlanDetails] = useState({
    provider: "",
    planName: "",
    customPlanName: "",
    monthlyPremium: "",
    roomBoard: "",
    outpatient: "",
  });
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Get plans for the selected provider
  const selectedProvider = insuranceProviders.find(p => p.name === planDetails.provider);
  const planOptions = selectedProvider
    ? [...selectedProvider.plans.map(plan => ({ value: plan, label: plan })), { value: "custom", label: t("compare.customPlan") }]
    : [];

  const providerOptions = insuranceProviders.map(p => ({ value: p.name, label: p.name }));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setStep("input");
    }
  };

  const handleAnalyze = async () => {
    setStep("analyzing");
    setAnalysisError(null);

    try {
      const formData = new FormData();

      if (uploadedFile) {
        formData.append("file", uploadedFile);
      } else if (planDetails.provider || planDetails.planName) {
        // Build text description from manual input
        const manualText = `
Insurance Provider: ${planDetails.provider}
Plan Name: ${planDetails.planName === "custom" ? planDetails.customPlanName : planDetails.planName}
Monthly Premium: ${planDetails.monthlyPremium} THB
Room and Board Limit: ${planDetails.roomBoard} THB per day
Outpatient Coverage: ${planDetails.outpatient ? `${planDetails.outpatient} THB` : "Not covered"}
        `.trim();
        formData.append("text", manualText);
      }

      const response = await fetch("/api/compare/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysisResult(data);
      setStep("results");
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisError(error instanceof Error ? error.message : "Analysis failed");
      // Fall back to mock results if API fails
      setStep("results");
    }
  };

  // Use real analysis data if available, otherwise use mock
  const comparisonData = analysisResult?.comparisonTable || mockComparison;
  const recommendedWins = comparisonData.filter(c => c.winner === "recommended").length;
  const savingsPercent = analysisResult?.savings?.percentage || 12;
  const coverageGaps = analysisResult?.gaps || [];

  const problems = language === "th" ? oldPlanProblems.th : oldPlanProblems.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Hook Step - First thing users see */}
          {step === "hook" && (
            <motion.div
              key="hook"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Hook Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {language === "th" ? "แผนประกันเก่าอาจมีปัญหา" : "Your old plan may have issues"}
                </motion.div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {language === "th" ? (
                    <>แผนประกันของคุณ <span className="text-orange-500">เก่าไปมั้ย?</span></>
                  ) : (
                    <>Is your insurance plan <span className="text-orange-500">outdated?</span></>
                  )}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === "th"
                    ? "อัปโหลดแผนประกันปัจจุบัน แล้ว AI จะวิเคราะห์ข้อเสียให้อัตโนมัติ"
                    : "Upload your current plan and let AI automatically analyze potential issues"}
                </p>
              </div>

              {/* Upload Card - Primary CTA */}
              <Card className="mb-8 border-2 border-dashed border-blue-300 bg-blue-50/50 hover:border-blue-400 transition-colors">
                <CardContent className="p-8 text-center">
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.png"
                      onChange={handleFileUpload}
                    />
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {language === "th" ? "อัปโหลดแผนประกันปัจจุบัน" : "Upload Your Current Plan"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === "th"
                        ? "รองรับ PDF, รูปภาพ หรือ ใบเสนอราคา"
                        : "Supports PDF, images, or quotation documents"}
                    </p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
                      <Sparkles className="w-5 h-5" />
                      {language === "th" ? "เลือกไฟล์เพื่อวิเคราะห์" : "Choose File to Analyze"}
                    </div>
                  </label>
                </CardContent>
              </Card>

              {/* Alternative: Manual Entry */}
              <div className="text-center mb-8">
                <button
                  onClick={() => setStep("input")}
                  className="text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  {language === "th" ? "หรือ กรอกข้อมูลแผนด้วยตัวเอง" : "Or enter plan details manually"}
                </button>
              </div>

              {/* Common Problems Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
                  {language === "th" ? "ปัญหาที่พบบ่อยในแผนเก่า" : "Common Issues in Old Plans"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {problems.map((problem, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Card className="h-full border-red-100 bg-red-50/30 hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                              <problem.icon className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 mb-1">{problem.title}</h3>
                              <p className="text-sm text-gray-600">{problem.desc}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Example Comparison Preview */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 py-4">
                  <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                    <Unlock className="w-5 h-5 text-green-400" />
                    {language === "th" ? "ตัวอย่าง: แผนเก่า vs แผนปลดล็อคใหม่" : "Example: Old Plan vs New Unlocked Plan"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3 font-semibold text-gray-900">
                            {language === "th" ? "ความคุ้มครอง" : "Coverage"}
                          </th>
                          <th className="text-center p-3 font-semibold text-red-600">
                            {language === "th" ? "แผนเก่า" : "Old Plan"}
                          </th>
                          <th className="text-center p-3 font-semibold text-green-600">
                            {language === "th" ? "แผนใหม่ (ปลดล็อค)" : "New Plan (Unlocked)"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3 font-medium">{language === "th" ? "ค่าห้อง ICU" : "ICU Room"}</td>
                          <td className="p-3 text-center text-red-600">
                            <div className="flex items-center justify-center gap-1">
                              <Lock className="w-4 h-4" /> 5,000 บาท/วัน
                            </div>
                          </td>
                          <td className="p-3 text-center text-green-600 font-bold">
                            <div className="flex items-center justify-center gap-1">
                              <Unlock className="w-4 h-4" /> ไม่จำกัด
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-medium">{language === "th" ? "วงเงินต่อปี" : "Annual Limit"}</td>
                          <td className="p-3 text-center text-red-600">5 ล้านบาท</td>
                          <td className="p-3 text-center text-green-600 font-bold">80-100 ล้านบาท</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-medium">{language === "th" ? "ผู้ป่วยนอก (OPD)" : "Outpatient"}</td>
                          <td className="p-3 text-center text-red-600">
                            <X className="w-4 h-4 mx-auto" />
                          </td>
                          <td className="p-3 text-center text-green-600">
                            <Check className="w-4 h-4 mx-auto" />
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-medium">{language === "th" ? "ค่ายา/อุปกรณ์" : "Medicine/Equipment"}</td>
                          <td className="p-3 text-center text-red-600">
                            <div className="flex items-center justify-center gap-1">
                              <Lock className="w-4 h-4" /> ตามจริง แต่ไม่เกิน
                            </div>
                          </td>
                          <td className="p-3 text-center text-green-600 font-bold">เหมาจ่าย 100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-green-50 border-t border-green-200">
                    <p className="text-center text-green-700 font-medium">
                      {language === "th"
                        ? "แผนใหม่ไม่ล็อควงเงิน จ่ายตามจริง ไม่ต้องกังวลเรื่องค่าใช้จ่ายส่วนเกิน"
                        : "New plans are unlocked - pay as actual, no worrying about excess costs"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Infographic Section */}
              <Card className="mt-8 overflow-hidden">
                <CardHeader className="py-4 bg-blue-50">
                  <CardTitle className="text-center text-blue-800">
                    {language === "th" ? "ทำความเข้าใจแผนปลดล็อค Double Care" : "Understanding Unlocked Double Care Plans"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative w-full">
                    <Image
                      src="/images/health.jpg"
                      alt={language === "th" ? "อินโฟกราฟิกแผนสุขภาพ" : "Health Plan Infographic"}
                      width={1200}
                      height={800}
                      className="w-full h-auto"
                      priority
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Final CTA */}
              <div className="mt-8 text-center">
                <Button
                  size="lg"
                  variant="gradient"
                  onClick={() => setStep("input")}
                  className="gap-2"
                >
                  {language === "th" ? "เริ่มวิเคราะห์แผนของฉัน" : "Start Analyzing My Plan"}
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Input Step */}
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-10">
                <button
                  onClick={() => setStep("hook")}
                  className="text-gray-500 hover:text-gray-700 text-sm mb-4 inline-flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  {language === "th" ? "กลับ" : "Back"}
                </button>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
                  {t("compare.title")}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t("compare.fullSubtitle")}
                </p>
              </div>

              {/* Show uploaded file if any */}
              {uploadedFile && (
                <Card className="mb-6 border-green-200 bg-green-50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {language === "th" ? "ไฟล์พร้อมวิเคราะห์" : "File ready for analysis"}
                      </p>
                    </div>
                    <Check className="w-5 h-5 text-green-600" />
                  </CardContent>
                </Card>
              )}

              <Card className="mb-10">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    {t("compare.yourCurrentPlan")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2.5">
                        {t("compare.provider")}
                      </label>
                      <Select
                        options={providerOptions}
                        value={planDetails.provider}
                        onChange={(value) => setPlanDetails({ ...planDetails, provider: value, planName: "", customPlanName: "" })}
                        placeholder={t("compare.selectProvider")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2.5">
                        {t("compare.planName")}
                      </label>
                      <Select
                        options={planOptions}
                        value={planDetails.planName}
                        onChange={(value) => setPlanDetails({ ...planDetails, planName: value })}
                        placeholder={planDetails.provider ? t("compare.selectPlan") : t("compare.selectProviderFirst")}
                        disabled={!planDetails.provider}
                      />
                    </div>
                  </div>

                  {/* Custom Plan Name Input */}
                  {planDetails.planName === "custom" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2.5">
                        {t("compare.enterPlanName")}
                      </label>
                      <Input
                        placeholder={t("compare.enterPlanNamePlaceholder")}
                        value={planDetails.customPlanName}
                        onChange={(e) => setPlanDetails({ ...planDetails, customPlanName: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2.5">
                        {t("compare.monthlyPremium")}
                      </label>
                      <Input
                        type="number"
                        placeholder="1,500"
                        value={planDetails.monthlyPremium}
                        onChange={(e) => setPlanDetails({ ...planDetails, monthlyPremium: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2.5">
                        {t("compare.roomBoard")}
                      </label>
                      <Input
                        type="number"
                        placeholder="3,000"
                        value={planDetails.roomBoard}
                        onChange={(e) => setPlanDetails({ ...planDetails, roomBoard: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2.5">
                        {t("compare.outpatient")}
                      </label>
                      <Input
                        type="number"
                        placeholder="20,000"
                        value={planDetails.outpatient}
                        onChange={(e) => setPlanDetails({ ...planDetails, outpatient: e.target.value })}
                      />
                    </div>
                  </div>

                  {!uploadedFile && (
                    <div className="pt-6 border-t mt-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            {t("compare.uploadDescription")}
                          </p>
                        </div>
                        <label className="cursor-pointer w-full sm:w-auto">
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.png"
                            onChange={handleFileUpload}
                          />
                          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm font-medium">{t("compare.uploadPdf")}</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="text-center mt-8">
                <Button
                  size="lg"
                  variant="gradient"
                  onClick={handleAnalyze}
                  disabled={!planDetails.provider && !uploadedFile}
                  className="w-full sm:w-auto gap-2 py-3"
                >
                  <Sparkles className="w-5 h-5" />
                  {t("compare.analyzeMyPlan")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Analyzing Step */}
          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("compare.analyzing")}
              </h2>
              <p className="text-gray-600">
                {t("compare.aiAnalyzing")}
              </p>
              <div className="mt-8 space-y-2 max-w-md mx-auto">
                {[
                  t("compare.extractingDetails"),
                  t("compare.comparingBenefits"),
                  t("compare.findingBestMatch")
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.5 }}
                    className="flex items-center gap-3 text-left"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.5 + 0.3 }}
                      className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </motion.div>
                    <span className="text-gray-600">{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Results Step */}
          {step === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Extracted Plan Info (if available) */}
              {analysisResult?.extractedPlan && (
                <Card className="mb-6 border-blue-200 bg-blue-50/50">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {analysisResult.extractedPlan.planName || "Your Plan"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {analysisResult.extractedPlan.provider || "Unknown Provider"}
                        </p>
                        {analysisResult.extractedPlan.annualPremium && (
                          <p className="text-sm text-blue-600 mt-1">
                            {language === "th" ? "เบี้ยประกัน: " : "Premium: "}
                            {analysisResult.extractedPlan.annualPremium.toLocaleString()} {language === "th" ? "บาท/ปี" : "THB/year"}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {language === "th" ? "วิเคราะห์แล้ว" : "Analyzed"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error Message */}
              {analysisError && (
                <Card className="mb-6 border-orange-200 bg-orange-50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <p className="text-sm text-orange-800">
                      {language === "th"
                        ? `ไม่สามารถวิเคราะห์ได้: ${analysisError} (แสดงตัวอย่างผลลัพธ์)`
                        : `Analysis failed: ${analysisError} (showing sample results)`}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 mb-12">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-7 sm:p-8 text-center">
                    <TrendingUp className="w-10 h-10 text-green-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-green-600">{savingsPercent}%</div>
                    <p className="text-sm text-gray-600 mt-1">{t("compare.potentialSavings")}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-7 sm:p-8 text-center">
                    <Shield className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-blue-600">{recommendedWins}/{comparisonData.length}</div>
                    <p className="text-sm text-gray-600 mt-1">{t("compare.categoriesBetter")}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                  <CardContent className="p-7 sm:p-8 text-center">
                    <AlertTriangle className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-orange-600">{coverageGaps.length || 3}</div>
                    <p className="text-sm text-gray-600 mt-1">{t("compare.coverageGaps")}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Coverage Gaps (if available) */}
              {coverageGaps.length > 0 && (
                <Card className="mb-8 border-orange-200">
                  <CardHeader className="bg-orange-50 py-4">
                    <CardTitle className="text-orange-800 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      {language === "th" ? "ช่องว่างความคุ้มครองที่พบ" : "Coverage Gaps Found"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="space-y-2">
                      {coverageGaps.map((gap, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Comparison Table */}
              <Card className="mb-12 overflow-hidden">
                <CardHeader className="bg-gray-50 py-5">
                  <CardTitle>{t("compare.detailedComparison")}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-100">
                          <th className="text-left p-4 font-semibold text-gray-900">{t("compare.category")}</th>
                          <th className="text-center p-4 font-semibold text-red-600">
                            {language === "th" ? "แผนปัจจุบัน (ล็อค)" : "Current (Locked)"}
                          </th>
                          <th className="text-center p-4 font-semibold text-green-600">
                            {language === "th" ? "แผนแนะนำ (ปลดล็อค)" : "Recommended (Unlocked)"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonData.map((item, index) => {
                          // Handle both mock and real data structure
                          const category = "category" in item ? item.category : "";
                          const yourPlan = "yourPlan" in item ? String(item.yourPlan) : "";
                          const recommended = "recommendedPlan" in item ? String(item.recommendedPlan) : ("recommended" in item ? String(item.recommended) : "");
                          const winner = item.winner;
                          const importance = item.importance;
                          const Icon = "icon" in item ? item.icon : Shield;

                          return (
                            <motion.tr
                              key={category}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  {typeof Icon === "function" && <Icon className="w-4 h-4 text-gray-500" />}
                                  <span className="font-medium text-gray-900">{category}</span>
                                  {importance === "high" && (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                      {t("compare.important")}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className={`p-4 text-center font-medium ${winner === "recommended" ? "text-red-600" : winner === "yours" ? "text-green-600" : "text-gray-600"}`}>
                                <div className="flex items-center justify-center gap-1">
                                  {(yourPlan === t("compare.notIncluded") || yourPlan === "ไม่คุ้มครอง" || yourPlan.includes("ไม่")) && (
                                    <X className="w-4 h-4" />
                                  )}
                                  {yourPlan}
                                </div>
                              </td>
                              <td className={`p-4 text-center font-semibold ${winner === "recommended" ? "text-green-600" : winner === "yours" ? "text-red-600" : "text-gray-600"}`}>
                                <div className="flex items-center justify-center gap-1">
                                  {winner === "recommended" && <Check className="w-4 h-4" />}
                                  {winner === "tie" && <Minus className="w-4 h-4" />}
                                  {recommended}
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Plans (if available) */}
              {analysisResult?.recommendedPlans && analysisResult.recommendedPlans.length > 0 && (
                <Card className="mb-8">
                  <CardHeader className="bg-green-50 py-4">
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      {language === "th" ? "แผนที่แนะนำสำหรับคุณ" : "Recommended Plans for You"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {analysisResult.recommendedPlans.slice(0, 3).map((plan, index) => (
                        <div key={plan.planId} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? "bg-green-500" : "bg-blue-500"}`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{plan.planName}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-green-600 font-medium">
                                {language === "th" ? "คะแนน: " : "Score: "}{plan.matchScore}%
                              </span>
                            </div>
                            {plan.advantages.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {plan.advantages.slice(0, 3).map((adv, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check className="w-3 h-3 text-green-500" />
                                    {adv}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* CTA */}
              <div className="text-center space-y-5">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("compare.readyToUpgrade")}
                </h2>
                <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
                  {t("compare.upgradeDescription")}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 px-4 pt-2">
                  <Button size="lg" variant="gradient" onClick={() => setShowLeadModal(true)} className="w-full sm:w-auto">
                    {t("compare.getMyUpgrade")}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setStep("hook")} className="w-full sm:w-auto">
                    {t("compare.compareAnother")}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lead Capture Modal */}
      <Modal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)}>
        <ModalHeader>
          <h2 className="text-2xl font-bold text-gray-900">{t("compare.getYourUpgrade")}</h2>
          <p className="text-gray-600 mt-1">{t("compare.advisorContact")}</p>
        </ModalHeader>
        <ModalContent>
          <LeadCaptureForm onSuccess={() => setShowLeadModal(false)} />
        </ModalContent>
      </Modal>
    </div>
  );
}
