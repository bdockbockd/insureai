"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export function CompareContent() {
  const { t, language } = useLanguage();

  // Selected recommended plan for comparison (default to Platinum 80MB)
  const [selectedRecommendedPlan] = useState(ourPlans.health[0]);

  const mockComparison: ComparisonItem[] = [
    {
      category: t("compare.roomBoard"),
      icon: Heart,
      yourPlan: "3,000 THB",
      recommendedPlan: "5,000 THB",
      winner: "recommended",
      importance: "high",
    },
    {
      category: t("compare.outpatient"),
      icon: Activity,
      yourPlan: "20,000 THB",
      recommendedPlan: "30,000 THB",
      winner: "recommended",
      importance: "high",
    },
    {
      category: language === "th" ? "เบี้ยประกันรายเดือน" : "Monthly Premium",
      icon: DollarSign,
      yourPlan: "1,800 THB",
      recommendedPlan: "1,500 THB",
      winner: "recommended",
      importance: "high",
    },
    {
      category: t("compare.criticalIllness"),
      icon: Shield,
      yourPlan: t("compare.notIncluded"),
      recommendedPlan: "500,000 THB",
      winner: "recommended",
      importance: "high",
    },
    {
      category: t("compare.dentalCoverage"),
      icon: Activity,
      yourPlan: "5,000 THB",
      recommendedPlan: "10,000 THB",
      winner: "recommended",
      importance: "medium",
    },
    {
      category: t("compare.waitingPeriod"),
      icon: Activity,
      yourPlan: language === "th" ? "30 วัน" : "30 days",
      recommendedPlan: language === "th" ? "30 วัน" : "30 days",
      winner: "tie",
      importance: "medium",
    },
    {
      category: t("compare.worldwideCoverage"),
      icon: Shield,
      yourPlan: t("compare.no"),
      recommendedPlan: t("compare.yes"),
      winner: "recommended",
      importance: "medium",
    },
  ];

  const [step, setStep] = useState<"input" | "analyzing" | "results">("input");
  const [planDetails, setPlanDetails] = useState({
    provider: "",
    planName: "",
    customPlanName: "",
    monthlyPremium: "",
    roomBoard: "",
    outpatient: "",
  });
  const [showLeadModal, setShowLeadModal] = useState(false);

  // Get plans for the selected provider
  const selectedProvider = insuranceProviders.find(p => p.name === planDetails.provider);
  const planOptions = selectedProvider
    ? [...selectedProvider.plans.map(plan => ({ value: plan, label: plan })), { value: "custom", label: t("compare.customPlan") }]
    : [];

  const providerOptions = insuranceProviders.map(p => ({ value: p.name, label: p.name }));

  const handleAnalyze = () => {
    setStep("analyzing");
    // Simulate AI analysis
    setTimeout(() => {
      setStep("results");
    }, 2500);
  };

  const recommendedWins = mockComparison.filter(c => c.winner === "recommended").length;
  const savingsPercent = 17; // Mock savings calculation

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Input Step */}
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
                  {t("compare.title")}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t("compare.fullSubtitle")}
                </p>
              </div>

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

                  <div className="pt-6 border-t mt-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          {t("compare.uploadDescription")}
                        </p>
                      </div>
                      <label className="cursor-pointer w-full sm:w-auto">
                        <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
                        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm font-medium">{t("compare.uploadPdf")}</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center mt-8">
                <Button
                  size="lg"
                  variant="gradient"
                  onClick={handleAnalyze}
                  disabled={!planDetails.provider}
                  className="w-full sm:w-auto gap-2 py-3"
                >
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
                    <div className="text-3xl font-bold text-blue-600">{recommendedWins}/{mockComparison.length}</div>
                    <p className="text-sm text-gray-600 mt-1">{t("compare.categoriesBetter")}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                  <CardContent className="p-7 sm:p-8 text-center">
                    <AlertTriangle className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-orange-600">2</div>
                    <p className="text-sm text-gray-600 mt-1">{t("compare.coverageGaps")}</p>
                  </CardContent>
                </Card>
              </div>

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
                          <th className="text-center p-4 font-semibold text-gray-900">{t("compare.yourPlan")}</th>
                          <th className="text-center p-4 font-semibold text-blue-700">
                            {selectedRecommendedPlan.name}
                          </th>
                          <th className="text-center p-4 font-semibold text-gray-900">{t("compare.winner")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockComparison.map((item, index) => (
                          <motion.tr
                            key={item.category}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <item.icon className="w-4 h-4 text-gray-500" />
                                <span className="font-medium text-gray-900">{item.category}</span>
                                {item.importance === "high" && (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                    {t("compare.important")}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-center text-gray-700 font-medium">{item.yourPlan}</td>
                            <td className="p-4 text-center font-semibold text-blue-700">
                              {item.recommendedPlan}
                            </td>
                            <td className="p-4 text-center">
                              {item.winner === "recommended" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                                  <Check className="w-3 h-3" /> {t("compare.allianz")}
                                </span>
                              ) : item.winner === "yours" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                  <Check className="w-3 h-3" /> {t("compare.yours")}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
                                  <Minus className="w-3 h-3" /> {t("compare.tie")}
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

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
                  <Button size="lg" variant="outline" onClick={() => setStep("input")} className="w-full sm:w-auto">
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
