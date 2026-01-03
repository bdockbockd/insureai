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
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";

const insuranceTypes: { type: InsuranceType; icon: React.ElementType; label: string; description: string; color: string }[] = [
  { type: "health", icon: Shield, label: "Health", description: "Medical expenses, hospital stays", color: "from-blue-500 to-cyan-500" },
  { type: "life", icon: Heart, label: "Life", description: "Protect your loved ones", color: "from-pink-500 to-rose-500" },
  { type: "critical-illness", icon: Activity, label: "Critical Illness", description: "Cancer, heart disease, stroke", color: "from-purple-500 to-indigo-500" },
  { type: "motor", icon: Car, label: "Motor", description: "Car and motorcycle", color: "from-orange-500 to-red-500" },
  { type: "travel", icon: Plane, label: "Travel", description: "Trip protection", color: "from-teal-500 to-emerald-500" },
  { type: "home", icon: Home, label: "Home", description: "Property protection", color: "from-amber-500 to-yellow-500" },
];

const insuredFor: { type: InsuranceFor; icon: React.ElementType; label: string }[] = [
  { type: "self", icon: User, label: "Myself" },
  { type: "spouse", icon: Heart, label: "My Spouse/Partner" },
  { type: "child", icon: Baby, label: "My Child" },
  { type: "parent", icon: UserCircle, label: "My Parent" },
  { type: "friend", icon: Users, label: "A Friend" },
];

const healthConditions = [
  "Diabetes",
  "High Blood Pressure",
  "Heart Disease",
  "Cancer (past or current)",
  "Asthma",
  "Obesity",
  "None of the above",
];

const occupations = [
  "Office Worker",
  "Business Owner",
  "Healthcare Professional",
  "Engineer",
  "Teacher/Educator",
  "Self-Employed",
  "Freelancer",
  "Student",
  "Retired",
  "Other",
];

export default function WizardPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const {
    currentStep,
    setStep,
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

  const toggleCondition = (condition: string) => {
    if (condition === "None of the above") {
      setHealthConditions(["None of the above"]);
    } else {
      const newConditions = selectedConditions.includes(condition)
        ? selectedConditions.filter(c => c !== condition)
        : [...selectedConditions.filter(c => c !== "None of the above"), condition];
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
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progress)}% Complete
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
                    What type of insurance are you looking for?
                  </h1>
                  <p className="text-gray-600">Select the coverage that matters most to you</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
                  {insuranceTypes.map(({ type, icon: Icon, label, description, color }) => (
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
                        <h3 className="font-semibold text-gray-900 text-base">{label}</h3>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{description}</p>
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
                    Who is this insurance for?
                  </h1>
                  <p className="text-gray-600">Tell us who you want to protect</p>
                </div>

                <div className="space-y-4">
                  {insuredFor.map(({ type, icon: Icon, label }) => (
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
                        <span className="font-semibold text-gray-900 text-lg">{label}</span>
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
                    {insuranceFor === "self" ? "Tell us about yourself" : "Tell us about them"}
                  </h1>
                  <p className="text-gray-600">This helps us find the right plan</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Age</label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Enter age (1-100)"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
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
                            <span className="font-semibold capitalize text-gray-900">{g}</span>
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
                    What is {insuranceFor === "self" ? "your" : "their"} occupation?
                  </h1>
                  <p className="text-gray-600">This affects plan eligibility and pricing</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {occupations.map((occ) => (
                    <Card
                      key={occ}
                      hover
                      onClick={() => setOccupation(occ)}
                      className={`cursor-pointer border-2 ${
                        occupation === occ ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50/50" : "border-gray-100"
                      }`}
                    >
                      <CardContent className="p-5 text-center">
                        <span className="font-semibold text-gray-900">{occ}</span>
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
                    {insuranceFor === "self" ? "Do you smoke?" : "Do they smoke?"}
                  </h1>
                  <p className="text-gray-600">Including e-cigarettes or vaping</p>
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
                      <span className="font-bold text-xl text-gray-900 block mb-2">Yes</span>
                      <p className="text-sm text-gray-500">I smoke or vape</p>
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
                      <span className="font-bold text-xl text-gray-900 block mb-2">No</span>
                      <p className="text-sm text-gray-500">Non-smoker</p>
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
                    Any pre-existing health conditions?
                  </h1>
                  <p className="text-gray-600">Select all that apply</p>
                </div>

                <div className="space-y-4">
                  {healthConditions.map((condition) => (
                    <Card
                      key={condition}
                      hover
                      onClick={() => toggleCondition(condition)}
                      className={`cursor-pointer border-2 transition-all ${
                        selectedConditions.includes(condition)
                          ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50/50"
                          : "border-gray-100"
                      }`}
                    >
                      <CardContent className="p-5 flex items-center gap-5">
                        <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-colors ${
                          selectedConditions.includes(condition)
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}>
                          {selectedConditions.includes(condition) && (
                            <Check className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <span className="font-semibold text-gray-900 text-base">{condition}</span>
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
                    What&apos;s your monthly budget?
                  </h1>
                  <p className="text-gray-600">We&apos;ll find plans that fit your budget</p>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Minimum (THB)</label>
                      <Input
                        type="number"
                        value={budgetMin}
                        onChange={(e) => setBudget(parseInt(e.target.value) || 0, budgetMax)}
                        min={0}
                        step={100}
                        className="text-lg"
                      />
                    </div>
                    <span className="text-gray-400 mt-8 font-medium">to</span>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Maximum (THB)</label>
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
                      { labelEn: "Basic", labelTh: "พื้นฐาน", min: 500, max: 2000 },
                      { labelEn: "Standard", labelTh: "มาตรฐาน", min: 2000, max: 5000 },
                      { labelEn: "Premium", labelTh: "พรีเมียม", min: 5000, max: 15000 },
                    ].map(({ labelEn, labelTh, min, max }) => {
                      const formatK = (n: number) => n >= 1000 ? `${n / 1000}K` : n.toString();
                      const label = language === "th" ? labelTh : labelEn;
                      const currencyUnit = language === "th" ? "บาท/เดือน" : "THB/mo";
                      return (
                        <Card
                          key={labelEn}
                          hover
                          onClick={() => setBudget(min, max)}
                          className={`cursor-pointer border-2 shadow-sm hover:shadow-md transition-all ${
                            budgetMin === min && budgetMax === max
                              ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <CardContent className="p-4 sm:p-6 text-center">
                            <span className="font-bold text-gray-900 text-base sm:text-lg block mb-1">{label}</span>
                            <p className="text-xs sm:text-sm text-gray-500">
                              <span className="block">{formatK(min)}-{formatK(max)}</span>
                              <span className="block">{currencyUnit}</span>
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
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 w-auto h-14"
          >
            {currentStep === totalSteps - 1 ? "See My Plans" : "Continue"}
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
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 flex-1 h-14"
          >
            {currentStep === totalSteps - 1 ? "See My Plans" : "Continue"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ResultsPage({ onBack }: { onBack: () => void }) {
  const { insuranceType, age, gender, budgetMin, budgetMax } = useWizardStore();
  const [showLeadForm, setShowLeadForm] = useState(false);

  // Mock recommended plans based on user input
  const recommendedPlans = [
    {
      id: "1",
      name: "Allianz Health Essential",
      premium: 1500,
      highlights: ["Room & Board: 5,000 THB/day", "OPD: 30,000 THB/year", "No Waiting Period"],
      isRecommended: true,
    },
    {
      id: "2",
      name: "Allianz Health Plus",
      premium: 2500,
      highlights: ["Room & Board: 8,000 THB/day", "OPD: 50,000 THB/year", "Dental Coverage"],
      isBestValue: true,
    },
    {
      id: "3",
      name: "Allianz Health Premium",
      premium: 4500,
      highlights: ["Room & Board: 15,000 THB/day", "OPD: 100,000 THB/year", "Worldwide Coverage"],
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
            We Found Your Perfect Plans!
          </h1>
          <p className="text-gray-600 text-lg">
            Based on your profile, here are our top recommendations
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
                    RECOMMENDED
                  </div>
                )}
                {plan.isBestValue && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-5 py-2 text-sm font-semibold rounded-bl-xl">
                    BEST VALUE
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
                        <span className="text-base font-normal text-gray-500">/mo</span>
                      </div>
                      <Button className="mt-5 w-full sm:w-auto h-12 px-8" onClick={() => setShowLeadForm(true)}>
                        Get This Plan
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
            Adjust My Preferences
          </Button>
          <Button variant="secondary" onClick={() => setShowLeadForm(true)} className="w-full sm:w-auto h-14">
            Speak to an Advisor
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost there!</h2>
              <p className="text-gray-600 mb-6">Tell us how to reach you and we&apos;ll send your personalized quote.</p>
              <LeadCaptureForm onSuccess={() => setShowLeadForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
