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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
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
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    What type of insurance are you looking for?
                  </h1>
                  <p className="text-gray-600">Select the coverage that matters most to you</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {insuranceTypes.map(({ type, icon: Icon, label, description, color }) => (
                    <Card
                      key={type}
                      hover
                      onClick={() => setInsuranceType(type)}
                      className={`cursor-pointer transition-all ${
                        insuranceType === type
                          ? "ring-2 ring-blue-500 border-transparent"
                          : ""
                      }`}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{label}</h3>
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Who is this for? */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Who is this insurance for?
                  </h1>
                  <p className="text-gray-600">Tell us who you want to protect</p>
                </div>

                <div className="space-y-3">
                  {insuredFor.map(({ type, icon: Icon, label }) => (
                    <Card
                      key={type}
                      hover
                      onClick={() => setInsuranceFor(type)}
                      className={`cursor-pointer transition-all ${
                        insuranceFor === type
                          ? "ring-2 ring-blue-500 border-transparent"
                          : ""
                      }`}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{label}</span>
                        {insuranceFor === type && (
                          <Check className="w-5 h-5 text-blue-600 ml-auto" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Age and Gender */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {insuranceFor === "self" ? "Tell us about yourself" : "Tell us about them"}
                  </h1>
                  <p className="text-gray-600">This helps us find the right plan</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <Input
                      type="number"
                      placeholder="Enter age"
                      value={age || ""}
                      onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                      min={0}
                      max={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["male", "female", "other"] as const).map((g) => (
                        <Card
                          key={g}
                          hover
                          onClick={() => setGender(g)}
                          className={`cursor-pointer ${
                            gender === g ? "ring-2 ring-blue-500" : ""
                          }`}
                        >
                          <CardContent className="p-4 text-center">
                            <span className="font-medium capitalize">{g}</span>
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
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    What is {insuranceFor === "self" ? "your" : "their"} occupation?
                  </h1>
                  <p className="text-gray-600">This affects plan eligibility and pricing</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {occupations.map((occ) => (
                    <Card
                      key={occ}
                      hover
                      onClick={() => setOccupation(occ)}
                      className={`cursor-pointer ${
                        occupation === occ ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <CardContent className="p-4 text-center">
                        <span className="font-medium text-sm">{occ}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Smoker */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {insuranceFor === "self" ? "Do you smoke?" : "Do they smoke?"}
                  </h1>
                  <p className="text-gray-600">Including e-cigarettes or vaping</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Card
                    hover
                    onClick={() => setSmoker(true)}
                    className={`w-full sm:flex-1 cursor-pointer ${
                      smoker ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <CardContent className="p-6 text-center">
                      <Cigarette className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <span className="font-medium text-lg">Yes</span>
                    </CardContent>
                  </Card>
                  <Card
                    hover
                    onClick={() => setSmoker(false)}
                    className={`w-full sm:flex-1 cursor-pointer ${
                      !smoker ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <CardContent className="p-6 text-center">
                      <HeartPulse className="w-10 h-10 text-green-500 mx-auto mb-3" />
                      <span className="font-medium text-lg">No</span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 5: Health Conditions */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Any pre-existing health conditions?
                  </h1>
                  <p className="text-gray-600">Select all that apply</p>
                </div>

                <div className="space-y-3">
                  {healthConditions.map((condition) => (
                    <Card
                      key={condition}
                      hover
                      onClick={() => toggleCondition(condition)}
                      className={`cursor-pointer ${
                        selectedConditions.includes(condition) ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                          selectedConditions.includes(condition)
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}>
                          {selectedConditions.includes(condition) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{condition}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Budget */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    What&apos;s your monthly budget?
                  </h1>
                  <p className="text-gray-600">We&apos;ll find plans that fit your budget</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum (THB)</label>
                      <Input
                        type="number"
                        value={budgetMin}
                        onChange={(e) => setBudget(parseInt(e.target.value) || 0, budgetMax)}
                        min={0}
                        step={100}
                      />
                    </div>
                    <span className="text-gray-400 mt-6">to</span>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maximum (THB)</label>
                      <Input
                        type="number"
                        value={budgetMax}
                        onChange={(e) => setBudget(budgetMin, parseInt(e.target.value) || 0)}
                        min={budgetMin}
                        step={100}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {[
                      { label: "Basic", min: 500, max: 2000 },
                      { label: "Standard", min: 2000, max: 5000 },
                      { label: "Premium", min: 5000, max: 15000 },
                    ].map(({ label, min, max }) => (
                      <Card
                        key={label}
                        hover
                        onClick={() => setBudget(min, max)}
                        className={`cursor-pointer border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-all ${
                          budgetMin === min && budgetMax === max ? "ring-2 ring-blue-500 border-blue-300 bg-gradient-to-br from-blue-50 to-white" : ""
                        }`}
                      >
                        <CardContent className="p-5 text-center">
                          <span className="font-semibold text-gray-900">{label}</span>
                          <p className="text-sm text-gray-500 mt-1">{min.toLocaleString()}-{max.toLocaleString()}/mo</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-12 gap-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 w-full sm:w-auto"
          >
            {currentStep === totalSteps - 1 ? "See My Plans" : "Continue"}
            <ArrowRight className="w-4 h-4" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            We Found Your Perfect Plans!
          </h1>
          <p className="text-gray-600">
            Based on your profile, here are our top recommendations
          </p>
        </motion.div>

        <div className="space-y-6 mb-10">
          {recommendedPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden border-2 shadow-md ${plan.isRecommended ? "ring-2 ring-blue-500 border-blue-200" : "border-gray-200"}`}>
                {plan.isRecommended && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1.5 text-xs font-semibold rounded-bl-lg">
                    RECOMMENDED
                  </div>
                )}
                {plan.isBestValue && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1.5 text-xs font-semibold rounded-bl-lg">
                    BEST VALUE
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                      <ul className="space-y-2">
                        {plan.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-center sm:text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {plan.premium.toLocaleString()}
                        <span className="text-sm font-normal text-gray-500">/mo</span>
                      </div>
                      <Button className="mt-4 w-full sm:w-auto" onClick={() => setShowLeadForm(true)}>
                        Get This Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
            Adjust My Preferences
          </Button>
          <Button variant="secondary" onClick={() => setShowLeadForm(true)} className="w-full sm:w-auto">
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
