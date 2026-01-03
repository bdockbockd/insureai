"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Heart,
  Car,
  Plane,
  Home,
  Activity,
  User,
  Users,
  Baby,
  UserCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Cigarette,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useWizardStore } from "@/store/wizard-store";
import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import type { InsuranceType, InsuranceFor } from "@/types/insurance";
import { useLanguage } from "@/contexts/language-context";

const insuranceTypeData: { type: InsuranceType; icon: React.ElementType; labelKey: string; descKey: string; color: string }[] = [
  { type: "health", icon: Shield, labelKey: "wizard.insurance.health", descKey: "wizard.insurance.health.desc", color: "from-blue-500 to-cyan-500" },
  { type: "life", icon: Heart, labelKey: "wizard.insurance.life", descKey: "wizard.insurance.life.desc", color: "from-pink-500 to-rose-500" },
  { type: "critical-illness", icon: Activity, labelKey: "wizard.insurance.criticalIllness", descKey: "wizard.insurance.criticalIllness.desc", color: "from-purple-500 to-indigo-500" },
  { type: "motor", icon: Car, labelKey: "wizard.insurance.motor", descKey: "wizard.insurance.motor.desc", color: "from-orange-500 to-red-500" },
  { type: "travel", icon: Plane, labelKey: "wizard.insurance.travel", descKey: "wizard.insurance.travel.desc", color: "from-teal-500 to-emerald-500" },
  { type: "home", icon: Home, labelKey: "wizard.insurance.home", descKey: "wizard.insurance.home.desc", color: "from-amber-500 to-yellow-500" },
];

const insuredForData: { type: InsuranceFor; icon: React.ElementType; labelKey: string }[] = [
  { type: "self", icon: User, labelKey: "wizard.for.myself" },
  { type: "spouse", icon: Heart, labelKey: "wizard.for.spouse" },
  { type: "child", icon: Baby, labelKey: "wizard.for.child" },
  { type: "parent", icon: UserCircle, labelKey: "wizard.for.parent" },
  { type: "friend", icon: Users, labelKey: "wizard.for.friend" },
];

const healthConditionKeys = [
  "wizard.condition.diabetes",
  "wizard.condition.highBloodPressure",
  "wizard.condition.heartDisease",
  "wizard.condition.cancer",
  "wizard.condition.asthma",
  "wizard.condition.obesity",
  "wizard.condition.none",
];

const occupationKeys = [
  "wizard.occupation.officeWorker",
  "wizard.occupation.businessOwner",
  "wizard.occupation.healthcarePro",
  "wizard.occupation.engineer",
  "wizard.occupation.teacher",
  "wizard.occupation.selfEmployed",
  "wizard.occupation.freelancer",
  "wizard.occupation.student",
  "wizard.occupation.retired",
  "wizard.occupation.other",
];

export function WizardContent() {
  const { t, language } = useLanguage();
  const {
    currentStep,
    nextStep,
    prevStep,
    insuranceType,
    setInsuranceType,
    insuranceFor,
    setInsuranceFor,
    age,
    setAge,
    gender,
    setGender,
    occupation,
    setOccupation,
    smoker,
    setSmoker,
    healthConditions: selectedConditions,
    setHealthConditions,
    budgetMin,
    budgetMax,
    setBudget,
  } = useWizardStore();

  const [showResults, setShowResults] = useState(false);

  const totalSteps = 7;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!insuranceType;
      case 1: return !!insuranceFor;
      case 2: return age !== null && age > 0 && !!gender;
      case 3: return !!occupation;
      case 4: return true; // smoker is boolean
      case 5: return selectedConditions.length > 0;
      case 6: return true; // budget has defaults
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep === totalSteps - 1) {
      setShowResults(true);
    } else {
      nextStep();
    }
  };

  const toggleCondition = (conditionKey: string) => {
    if (conditionKey === "wizard.condition.none") {
      setHealthConditions(["wizard.condition.none"]);
    } else {
      const newConditions = selectedConditions.includes(conditionKey)
        ? selectedConditions.filter(c => c !== conditionKey)
        : [...selectedConditions.filter(c => c !== "wizard.condition.none"), conditionKey];
      setHealthConditions(newConditions);
    }
  };

  if (showResults) {
    return <ResultsPage onBack={() => setShowResults(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 sm:py-12 px-5 sm:px-6 lg:px-8 pb-32 sm:pb-12">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {t("common.step")} {currentStep + 1} / {totalSteps}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progress)}% {t("common.complete")}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 0: Insurance Type */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="text-center mb-10">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {t("wizard.step0.title")}
                  </h1>
                  <p className="text-gray-600">{t("wizard.step0.subtitle")}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
                  {insuranceTypeData.map(({ type, icon: Icon, labelKey, descKey, color }) => (
                    <Card
                      key={type}
                      hover
                      onClick={() => setInsuranceType(type)}
                      className={`cursor-pointer transition-all border-2 ${
                        insuranceType === type
                          ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50/50"
                          : "border-gray-100"
                      }`}
                    >
                      <CardContent className="p-5 sm:p-6 text-center">
                        <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-base">{t(labelKey)}</h3>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{t(descKey)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Who is this for? */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-10">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {t("wizard.step1.title")}
                  </h1>
                  <p className="text-gray-600">{t("wizard.step1.subtitle")}</p>
                </div>

                <div className="space-y-4">
                  {insuredForData.map(({ type, icon: Icon, labelKey }) => (
                    <Card
                      key={type}
                      hover
                      onClick={() => setInsuranceFor(type)}
                      className={`cursor-pointer transition-all border-2 ${
                        insuranceFor === type
                          ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50/50"
                          : "border-gray-100"
                      }`}
                    >
                      <CardContent className="p-5 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <Icon className="w-7 h-7 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-900 text-lg">{t(labelKey)}</span>
                        {insuranceFor === type && (
                          <Check className="w-6 h-6 text-blue-600 ml-auto" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Age and Gender */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-10">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {insuranceFor === "self" ? t("wizard.step2.titleSelf") : t("wizard.step2.titleOther")}
                  </h1>
                  <p className="text-gray-600">{t("wizard.step2.subtitle")}</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">{t("wizard.age")}</label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder={t("wizard.agePlaceholder")}
                      value={age || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        const num = parseInt(val) || 0;
                        if (num <= 100) setAge(num);
                      }}
                      maxLength={3}
                      className="text-lg text-center text-2xl font-semibold h-16"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">{t("wizard.gender")}</label>
                    <div className="grid grid-cols-3 gap-4">
                      {(["male", "female", "other"] as const).map((g) => (
                        <Card
                          key={g}
                          hover
                          onClick={() => setGender(g)}
                          className={`cursor-pointer border-2 ${
                            gender === g ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50/50" : "border-gray-100"
                          }`}
                        >
                          <CardContent className="p-5 text-center">
                            <span className="font-semibold text-gray-900">
                              {t(`wizard.gender.${g}`)}
                            </span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Occupation */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-10">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {insuranceFor === "self" ? t("wizard.step3.titleSelf") : t("wizard.step3.titleOther")}
                  </h1>
                  <p className="text-gray-600">{t("wizard.step3.subtitle")}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {occupationKeys.map((occKey) => (
                    <Card
                      key={occKey}
                      hover
                      onClick={() => setOccupation(occKey)}
                      className={`cursor-pointer border-2 ${
                        occupation === occKey ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50/50" : "border-gray-100"
                      }`}
                    >
                      <CardContent className="p-5 text-center">
                        <span className="font-semibold text-gray-900">{t(occKey)}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Smoker */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="text-center mb-10">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {insuranceFor === "self" ? t("wizard.step4.titleSelf") : t("wizard.step4.titleOther")}
                  </h1>
                  <p className="text-gray-600">{t("wizard.step4.subtitle")}</p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <Card
                    hover
                    onClick={() => setSmoker(true)}
                    className={`cursor-pointer border-2 transition-all ${
                      smoker === true
                        ? "ring-2 ring-orange-500 border-orange-300 bg-orange-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <CardContent className="p-8 text-center">
                      <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center ${
                        smoker === true ? "bg-orange-100" : "bg-gray-100"
                      }`}>
                        <Cigarette className={`w-10 h-10 ${smoker === true ? "text-orange-500" : "text-gray-400"}`} />
                      </div>
                      <span className="font-bold text-xl text-gray-900 block mb-2">{language === "th" ? "ใช่" : "Yes"}</span>
                      <p className="text-sm text-gray-500">
                        {insuranceFor === "self" ? t("wizard.smoker.yes") : t("wizard.smoker.yesOther")}
                      </p>
                    </CardContent>
                  </Card>
                  <Card
                    hover
                    onClick={() => setSmoker(false)}
                    className={`cursor-pointer border-2 transition-all ${
                      smoker === false
                        ? "ring-2 ring-green-500 border-green-300 bg-green-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <CardContent className="p-8 text-center">
                      <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center ${
                        smoker === false ? "bg-green-100" : "bg-gray-100"
                      }`}>
                        <HeartPulse className={`w-10 h-10 ${smoker === false ? "text-green-500" : "text-gray-400"}`} />
                      </div>
                      <span className="font-bold text-xl text-gray-900 block mb-2">{language === "th" ? "ไม่" : "No"}</span>
                      <p className="text-sm text-gray-500">{t("wizard.smoker.no")}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 5: Health Conditions */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="text-center mb-10">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {t("wizard.step5.title")}
                  </h1>
                  <p className="text-gray-600">{t("wizard.step5.subtitle")}</p>
                </div>

                <div className="space-y-4">
                  {healthConditionKeys.map((conditionKey) => (
                    <Card
                      key={conditionKey}
                      hover
                      onClick={() => toggleCondition(conditionKey)}
                      className={`cursor-pointer border-2 transition-all ${
                        selectedConditions.includes(conditionKey)
                          ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50/50"
                          : "border-gray-100"
                      }`}
                    >
                      <CardContent className="p-5 flex items-center gap-5">
                        <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors ${
                          selectedConditions.includes(conditionKey)
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}>
                          {selectedConditions.includes(conditionKey) && (
                            <Check className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <span className="font-semibold text-gray-900 text-base">{t(conditionKey)}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Budget */}
            {currentStep === 6 && (
              <div className="space-y-8">
                <div className="text-center mb-10">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {t("wizard.step6.title")}
                  </h1>
                  <p className="text-gray-600">{t("wizard.step6.subtitle")}</p>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">{t("wizard.budget.minimum")}</label>
                      <Input
                        type="number"
                        value={budgetMin}
                        onChange={(e) => setBudget(parseInt(e.target.value) || 0, budgetMax)}
                        min={0}
                        step={100}
                        className="text-lg"
                      />
                    </div>
                    <span className="text-gray-400 mt-8 font-medium">{language === "th" ? "ถึง" : "to"}</span>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">{t("wizard.budget.maximum")}</label>
                      <Input
                        type="number"
                        value={budgetMax}
                        onChange={(e) => setBudget(budgetMin, parseInt(e.target.value) || 0)}
                        min={budgetMin}
                        step={100}
                        className="text-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:gap-5">
                    {[
                      { labelKey: "wizard.budget.basic", min: 500, max: 2000 },
                      { labelKey: "wizard.budget.standard", min: 2000, max: 5000 },
                      { labelKey: "wizard.budget.premium", min: 5000, max: 15000 },
                    ].map(({ labelKey, min, max }) => {
                      const formatK = (n: number) => n >= 1000 ? `${n / 1000}K` : n.toString();
                      return (
                        <Card
                          key={labelKey}
                          hover
                          onClick={() => setBudget(min, max)}
                          className={`cursor-pointer border-2 shadow-sm hover:shadow-md transition-all ${
                            budgetMin === min && budgetMax === max
                              ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <CardContent className="p-4 sm:p-6 text-center">
                            <span className="font-bold text-gray-900 text-base sm:text-lg block mb-1">{t(labelKey)}</span>
                            <p className="text-xs sm:text-sm text-gray-500">
                              <span className="block">{formatK(min)}-{formatK(max)}</span>
                              <span className="block">{t("wizard.budget.currency")}</span>
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons - Desktop */}
        <div className="hidden sm:flex items-center justify-between mt-14 gap-5 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="gap-2 w-auto h-14"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("common.back")}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 w-auto h-14"
          >
            {currentStep === totalSteps - 1 ? t("common.seeMyPlans") : t("common.continue")}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Navigation Buttons - Mobile Fixed */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-gray-200 sm:hidden z-40">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="gap-2 flex-1 h-14"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("common.back")}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 flex-1 h-14"
          >
            {currentStep === totalSteps - 1 ? t("common.seeMyPlans") : t("common.continue")}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ResultsPage({ onBack }: { onBack: () => void }) {
  const { t, language } = useLanguage();
  const [showLeadForm, setShowLeadForm] = useState(false);

  // Mock recommended plans based on user input
  const recommendedPlans = [
    {
      id: "1",
      name: "Allianz Health Essential",
      premium: 1500,
      highlights: [
        language === "th" ? "ค่าห้อง: 5,000 บาท/วัน" : "Room & Board: 5,000 THB/day",
        language === "th" ? "ผู้ป่วยนอก: 30,000 บาท/ปี" : "OPD: 30,000 THB/year",
        language === "th" ? "ไม่มีระยะรอคอย" : "No Waiting Period",
      ],
      isRecommended: true,
    },
    {
      id: "2",
      name: "Allianz Health Plus",
      premium: 2500,
      highlights: [
        language === "th" ? "ค่าห้อง: 8,000 บาท/วัน" : "Room & Board: 8,000 THB/day",
        language === "th" ? "ผู้ป่วยนอก: 50,000 บาท/ปี" : "OPD: 50,000 THB/year",
        language === "th" ? "คุ้มครองทันตกรรม" : "Dental Coverage",
      ],
      isBestValue: true,
    },
    {
      id: "3",
      name: "Allianz Health Premium",
      premium: 4500,
      highlights: [
        language === "th" ? "ค่าห้อง: 15,000 บาท/วัน" : "Room & Board: 15,000 THB/day",
        language === "th" ? "ผู้ป่วยนอก: 100,000 บาท/ปี" : "OPD: 100,000 THB/year",
        language === "th" ? "คุ้มครองทั่วโลก" : "Worldwide Coverage",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 sm:py-12 px-5 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {t("wizard.results.title")}
          </h1>
          <p className="text-gray-600 text-lg">
            {t("wizard.results.subtitle")}
          </p>
        </motion.div>

        <div className="space-y-6 sm:space-y-8 mb-12">
          {recommendedPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden border-2 shadow-lg ${plan.isRecommended ? "ring-2 ring-blue-500 border-blue-200" : "border-gray-200"}`}>
                {plan.isRecommended && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-5 py-2 text-sm font-semibold rounded-bl-xl">
                    {t("wizard.results.recommended")}
                  </div>
                )}
                {plan.isBestValue && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-5 py-2 text-sm font-semibold rounded-bl-xl">
                    {t("wizard.results.bestValue")}
                  </div>
                )}
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                      <ul className="space-y-3">
                        {plan.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-center gap-3 text-base text-gray-700">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-center sm:text-right pt-4 sm:pt-0">
                      <div className="text-4xl font-bold text-blue-600">
                        {plan.premium.toLocaleString()}
                        <span className="text-base font-normal text-gray-500">{t("wizard.results.perMonth")}</span>
                      </div>
                      <Button className="mt-5 w-full sm:w-auto h-12 px-8" onClick={() => setShowLeadForm(true)}>
                        {t("wizard.results.getThisPlan")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 pt-6 border-t border-gray-100">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto h-14">
            {t("wizard.results.adjustPreferences")}
          </Button>
          <Button variant="secondary" onClick={() => setShowLeadForm(true)} className="w-full sm:w-auto h-14">
            {t("wizard.results.speakToAdvisor")}
          </Button>
        </div>

        {/* Lead Capture Modal */}
        {showLeadForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowLeadForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("wizard.results.almostThere")}</h2>
              <p className="text-gray-600 mb-6">{t("wizard.results.sendQuote")}</p>
              <LeadCaptureForm onSuccess={() => setShowLeadForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
