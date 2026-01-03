"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Sparkles,
  Download,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import {
  healthInsuranceEasyHook,
  healthInsuranceLongHook,
  healthInsuranceProducts,
  type WizardQuestion,
} from "@/data/wizards/health-insurance";

type WizardMode = "select" | "easy" | "long" | "result";

interface ProductScore {
  id: string;
  name_th: string;
  name_en: string;
  score: number;
  percentage: number;
  features: string[];
  premium_base: number;
}

export default function HealthWizardPage() {
  const { language } = useLanguage();
  const [mode, setMode] = useState<WizardMode>("select");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [results, setResults] = useState<ProductScore[]>([]);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const questions = mode === "easy" ? healthInsuranceEasyHook : healthInsuranceLongHook;
  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setMode("select");
    }
  };

  const calculateResults = () => {
    const scores = { platinum: 0, all_hos: 0, bdms: 0 };

    // Calculate scores from answers
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find((q) => q.id === questionId);
      if (!question || !question.options) return;

      const selectedValues = Array.isArray(answer) ? answer : [answer];
      selectedValues.forEach((val) => {
        const option = question.options?.find((o) => o.value === val);
        if (option?.score) {
          Object.entries(option.score).forEach(([product, score]) => {
            if (product in scores) {
              scores[product as keyof typeof scores] += score as number;
            }
          });
        }
      });
    });

    // Calculate percentages
    const maxScore = Math.max(...Object.values(scores));
    const productResults: ProductScore[] = Object.entries(healthInsuranceProducts).map(
      ([key, product]) => ({
        id: key,
        name_th: product.name_th,
        name_en: product.name_en,
        score: scores[key as keyof typeof scores],
        percentage: Math.round((scores[key as keyof typeof scores] / maxScore) * 100),
        features: language === "th" ? product.key_features_th : product.key_features_en,
        premium_base: product.premium_base,
      })
    );

    // Sort by score
    productResults.sort((a, b) => b.score - a.score);
    setResults(productResults);
    setMode("result");
  };

  const resetWizard = () => {
    setMode("select");
    setCurrentStep(0);
    setAnswers({});
    setResults([]);
  };

  // Mode Selection
  if (mode === "select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/learn/health" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            {language === "th" ? "กลับ" : "Back"}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {language === "th" ? "ค้นหาประกันสุขภาพที่เหมาะกับคุณ" : "Find Your Perfect Health Insurance"}
            </h1>
            <p className="text-gray-600">
              {language === "th"
                ? "เลือกระดับความละเอียดที่ต้องการ"
                : "Choose the level of detail you prefer"}
            </p>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card
                hover
                onClick={() => setMode("easy")}
                className="cursor-pointer border-2 border-gray-200 hover:border-blue-300 transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                      <Clock className="w-7 h-7 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {language === "th" ? "แบบด่วน" : "Quick Mode"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === "th" ? "5 คำถาม • 30-60 วินาที" : "5 questions • 30-60 seconds"}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card
                hover
                onClick={() => setMode("long")}
                className="cursor-pointer border-2 border-gray-200 hover:border-blue-300 transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {language === "th" ? "แบบละเอียด" : "Detailed Mode"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === "th" ? "10 คำถาม • 2-3 นาที • แม่นยำกว่า" : "10 questions • 2-3 min • More accurate"}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Results
  if (mode === "result") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {language === "th" ? "แผนที่เหมาะกับคุณ" : "Plans Recommended for You"}
            </h1>
            <p className="text-gray-600">
              {language === "th"
                ? "จากคำตอบของคุณ เราแนะนำแผนเหล่านี้"
                : "Based on your answers, we recommend these plans"}
            </p>
          </motion.div>

          <div className="space-y-4 mb-8">
            {results.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`border-2 ${
                    index === 0
                      ? "border-blue-300 bg-blue-50/50 ring-2 ring-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {language === "th" ? product.name_th : product.name_en}
                          </h3>
                          {index === 0 && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              {language === "th" ? "แนะนำ" : "Best Match"}
                            </span>
                          )}
                        </div>

                        {/* Match percentage bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              {language === "th" ? "ความเหมาะสม" : "Match Score"}
                            </span>
                            <span className="font-semibold text-blue-600">{product.percentage}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                              style={{ width: `${product.percentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {product.features.slice(0, 3).map((feature, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs"
                            >
                              <Check className="w-3 h-3 text-green-500" />
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-sm text-gray-500 mb-1">
                          {language === "th" ? "เบี้ยเริ่มต้น" : "Starting from"}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {product.premium_base.toLocaleString()}
                          <span className="text-sm font-normal text-gray-500">
                            {language === "th" ? " บาท/ปี" : " THB/year"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Lead Capture Form or Brochure Download */}
          {!leadSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                    {language === "th" ? "รับใบเสนอราคาส่วนตัว" : "Get Your Personalized Quote"}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {language === "th"
                      ? "กรอกข้อมูลติดต่อ ที่ปรึกษาจะติดต่อกลับภายใน 24 ชั่วโมง"
                      : "Fill in your contact details and our advisor will reach out within 24 hours"}
                  </p>
                  <LeadCaptureForm onSuccess={() => setLeadSubmitted(true)} />
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {language === "th" ? "ขอบคุณค่ะ!" : "Thank You!"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {language === "th"
                      ? "ที่ปรึกษาของเราจะติดต่อคุณภายใน 24 ชั่วโมง"
                      : "Our advisor will contact you within 24 hours"}
                  </p>

                  <div className="border-t border-green-200 pt-6 mt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      {language === "th" ? "ดาวน์โหลดโบรชัวร์" : "Download Brochures"}
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {results.map((product) => (
                        <a
                          key={product.id}
                          href={`/brochures/health/${product.id}.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors"
                        >
                          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {language === "th" ? product.name_th : product.name_en}
                            </p>
                            <p className="text-xs text-gray-500">PDF</p>
                          </div>
                          <Download className="w-4 h-4 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button variant="outline" onClick={resetWizard} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {language === "th" ? "ทำแบบทดสอบใหม่" : "Retake Quiz"}
            </Button>
            <Link href="/learn/compare">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                {language === "th" ? "เปรียบเทียบประเภทประกัน" : "Compare Insurance Types"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Question Flow
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 sm:py-12 px-5 sm:px-6 lg:px-8 pb-32 sm:pb-12">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {language === "th" ? "คำถาม" : "Question"} {currentStep + 1} / {questions.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progress)}% {language === "th" ? "เสร็จสิ้น" : "Complete"}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {language === "th" ? currentQuestion.question : currentQuestion.question_en}
              </h2>
            </div>

            {/* Options */}
            {currentQuestion.type === "single_choice" && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <Card
                    key={option.value}
                    hover
                    onClick={() => handleAnswer(option.value)}
                    className={`cursor-pointer transition-all border-2 ${
                      answers[currentQuestion.id] === option.value
                        ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50/50"
                        : "border-gray-100"
                    }`}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion.id] === option.value
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {answers[currentQuestion.id] === option.value && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">
                        {language === "th" ? option.label_th : option.label_en}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const selected = (answers[currentQuestion.id] as string[] || []).includes(option.value);
                  return (
                    <Card
                      key={option.value}
                      hover
                      onClick={() => {
                        const current = (answers[currentQuestion.id] as string[]) || [];
                        if (option.exclusive) {
                          handleAnswer([option.value]);
                        } else if (selected) {
                          handleAnswer(current.filter((v) => v !== option.value));
                        } else {
                          handleAnswer([...current.filter((v) => {
                            const opt = currentQuestion.options?.find((o) => o.value === v);
                            return !opt?.exclusive;
                          }), option.value]);
                        }
                      }}
                      className={`cursor-pointer transition-all border-2 ${
                        selected
                          ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50/50"
                          : "border-gray-100"
                      }`}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            selected
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="font-medium text-gray-900">
                          {language === "th" ? option.label_th : option.label_en}
                        </span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "slider" && currentQuestion.config && (
              <div className="py-8">
                <input
                  type="range"
                  min={currentQuestion.config.min}
                  max={currentQuestion.config.max}
                  step={currentQuestion.config.step}
                  value={(answers[currentQuestion.id] as string) || currentQuestion.config.default}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between mt-4">
                  <span className="text-sm text-gray-500">{currentQuestion.config.min}</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {(answers[currentQuestion.id] as string) || currentQuestion.config.default}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      {currentQuestion.config.unit}
                    </span>
                  </span>
                  <span className="text-sm text-gray-500">{currentQuestion.config.max}</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons - Desktop */}
        <div className="hidden sm:flex items-center justify-between mt-14 gap-5 pt-6 border-t border-gray-100">
          <Button variant="outline" onClick={handleBack} className="gap-2 h-14">
            <ArrowLeft className="w-5 h-5" />
            {language === "th" ? "กลับ" : "Back"}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className="gap-2 h-14"
          >
            {currentStep === questions.length - 1
              ? language === "th"
                ? "ดูผลลัพธ์"
                : "See Results"
              : language === "th"
              ? "ถัดไป"
              : "Next"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Navigation Buttons - Mobile Fixed */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-gray-200 sm:hidden z-40">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <Button variant="outline" onClick={handleBack} className="gap-2 flex-1 h-14">
            <ArrowLeft className="w-5 h-5" />
            {language === "th" ? "กลับ" : "Back"}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className="gap-2 flex-1 h-14"
          >
            {currentStep === questions.length - 1
              ? language === "th"
                ? "ดูผลลัพธ์"
                : "See Results"
              : language === "th"
              ? "ถัดไป"
              : "Next"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
