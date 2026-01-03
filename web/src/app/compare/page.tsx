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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { LeadCaptureForm } from "@/components/forms/lead-capture-form";

interface ComparisonItem {
  category: string;
  icon: React.ElementType;
  yourPlan: string | number;
  allianzPlan: string | number;
  winner: "yours" | "allianz" | "tie";
  importance: "high" | "medium" | "low";
}

const mockComparison: ComparisonItem[] = [
  {
    category: "Room & Board (per day)",
    icon: Heart,
    yourPlan: "3,000 THB",
    allianzPlan: "5,000 THB",
    winner: "allianz",
    importance: "high",
  },
  {
    category: "Outpatient Coverage (per year)",
    icon: Activity,
    yourPlan: "20,000 THB",
    allianzPlan: "30,000 THB",
    winner: "allianz",
    importance: "high",
  },
  {
    category: "Monthly Premium",
    icon: DollarSign,
    yourPlan: "1,800 THB",
    allianzPlan: "1,500 THB",
    winner: "allianz",
    importance: "high",
  },
  {
    category: "Critical Illness Coverage",
    icon: Shield,
    yourPlan: "Not Included",
    allianzPlan: "500,000 THB",
    winner: "allianz",
    importance: "high",
  },
  {
    category: "Dental Coverage",
    icon: Activity,
    yourPlan: "5,000 THB",
    allianzPlan: "10,000 THB",
    winner: "allianz",
    importance: "medium",
  },
  {
    category: "Waiting Period",
    icon: Activity,
    yourPlan: "30 days",
    allianzPlan: "30 days",
    winner: "tie",
    importance: "medium",
  },
  {
    category: "Worldwide Coverage",
    icon: Shield,
    yourPlan: "No",
    allianzPlan: "Yes",
    winner: "allianz",
    importance: "medium",
  },
];

export default function ComparePage() {
  const [step, setStep] = useState<"input" | "analyzing" | "results">("input");
  const [planDetails, setPlanDetails] = useState({
    provider: "",
    planName: "",
    monthlyPremium: "",
    roomBoard: "",
    outpatient: "",
  });
  const [showLeadModal, setShowLeadModal] = useState(false);

  const handleAnalyze = () => {
    setStep("analyzing");
    // Simulate AI analysis
    setTimeout(() => {
      setStep("results");
    }, 2500);
  };

  const allianzWins = mockComparison.filter(c => c.winner === "allianz").length;
  const savingsPercent = 17; // Mock savings calculation

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
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
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Compare Your Current Plan
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  See how your existing insurance stacks up against Allianz plans.
                  Find gaps in coverage and potential savings.
                </p>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Your Current Plan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Insurance Provider
                      </label>
                      <Input
                        placeholder="e.g., AIA, Bangkok Life"
                        value={planDetails.provider}
                        onChange={(e) => setPlanDetails({ ...planDetails, provider: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Plan Name
                      </label>
                      <Input
                        placeholder="e.g., Health Shield Plus"
                        value={planDetails.planName}
                        onChange={(e) => setPlanDetails({ ...planDetails, planName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Premium (THB)
                      </label>
                      <Input
                        type="number"
                        placeholder="1,500"
                        value={planDetails.monthlyPremium}
                        onChange={(e) => setPlanDetails({ ...planDetails, monthlyPremium: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room & Board (per day)
                      </label>
                      <Input
                        type="number"
                        placeholder="3,000"
                        value={planDetails.roomBoard}
                        onChange={(e) => setPlanDetails({ ...planDetails, roomBoard: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Outpatient (per year)
                      </label>
                      <Input
                        type="number"
                        placeholder="20,000"
                        value={planDetails.outpatient}
                        onChange={(e) => setPlanDetails({ ...planDetails, outpatient: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          Or upload your policy document and our AI will extract the details
                        </p>
                      </div>
                      <label className="cursor-pointer">
                        <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm font-medium">Upload PDF</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button
                  size="xl"
                  variant="gradient"
                  onClick={handleAnalyze}
                  disabled={!planDetails.provider}
                  className="gap-2"
                >
                  Analyze My Plan
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
                Analyzing Your Plan...
              </h2>
              <p className="text-gray-600">
                Our AI is comparing your coverage against 50+ Allianz plans
              </p>
              <div className="mt-8 space-y-2 max-w-md mx-auto">
                {["Extracting coverage details", "Comparing benefits", "Finding the best match"].map((text, i) => (
                  <motion.div
                    key={text}
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-10 h-10 text-green-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-green-600">{savingsPercent}%</div>
                    <p className="text-sm text-gray-600">Potential Savings</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-blue-600">{allianzWins}/{mockComparison.length}</div>
                    <p className="text-sm text-gray-600">Categories Better</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-orange-600">2</div>
                    <p className="text-sm text-gray-600">Coverage Gaps Found</p>
                  </CardContent>
                </Card>
              </div>

              {/* Comparison Table */}
              <Card className="mb-8 overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <CardTitle>Detailed Comparison</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-4 font-semibold">Category</th>
                          <th className="text-center p-4 font-semibold">Your Plan</th>
                          <th className="text-center p-4 font-semibold text-blue-600">
                            Allianz Health Plus
                          </th>
                          <th className="text-center p-4 font-semibold">Winner</th>
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
                                <item.icon className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{item.category}</span>
                                {item.importance === "high" && (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                                    Important
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-center text-gray-600">{item.yourPlan}</td>
                            <td className="p-4 text-center font-medium text-blue-600">
                              {item.allianzPlan}
                            </td>
                            <td className="p-4 text-center">
                              {item.winner === "allianz" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                                  <Check className="w-3 h-3" /> Allianz
                                </span>
                              ) : item.winner === "yours" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                  <Check className="w-3 h-3" /> Yours
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
                                  <Minus className="w-3 h-3" /> Tie
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
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Ready to Upgrade Your Coverage?
                </h2>
                <p className="text-gray-600 max-w-lg mx-auto">
                  Switch to Allianz Health Plus and get better coverage at a lower price.
                  Our advisor will help you make the transition seamless.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" variant="gradient" onClick={() => setShowLeadModal(true)}>
                    Get My Upgrade
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setStep("input")}>
                    Compare Another Plan
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
          <h2 className="text-2xl font-bold text-gray-900">Get Your Upgrade</h2>
          <p className="text-gray-600 mt-1">Our advisor will contact you with next steps</p>
        </ModalHeader>
        <ModalContent>
          <LeadCaptureForm onSuccess={() => setShowLeadModal(false)} />
        </ModalContent>
      </Modal>
    </div>
  );
}
