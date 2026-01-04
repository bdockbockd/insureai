"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, FileText, X } from "lucide-react";
import { planCategories, type InsurancePlan } from "@/data/plans-config";
import { useLanguage } from "@/contexts/language-context";

interface PlanSelectorProps {
  selectedPlan: InsurancePlan | null;
  onSelectPlan: (plan: InsurancePlan | null) => void;
  disabled?: boolean;
}

export function PlanSelector({ selectedPlan, onSelectPlan, disabled }: PlanSelectorProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handlePlanSelect = (plan: InsurancePlan) => {
    onSelectPlan(plan);
    setIsOpen(false);
    setExpandedCategory(null);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectPlan(null);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border transition-all outline-none
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-blue-400 cursor-pointer"}
          ${selectedPlan ? "bg-blue-50 border-blue-300" : "bg-white border-gray-300"}
          ${isOpen ? "border-blue-500" : ""}
        `}
      >
        <FileText className={`w-4 h-4 ${selectedPlan ? "text-blue-600" : "text-gray-400"}`} />
        <span className={`text-sm ${selectedPlan ? "text-blue-700 font-medium" : "text-gray-500"}`}>
          {selectedPlan
            ? (language === "th" ? selectedPlan.short_name_th : selectedPlan.short_name_en)
            : (language === "th" ? "เลือกแผนประกัน" : "Select a plan")}
        </span>
        {selectedPlan ? (
          <button
            onClick={handleClear}
            className="ml-1 p-0.5 hover:bg-blue-100 rounded outline-none"
          >
            <X className="w-3 h-3 text-blue-600" />
          </button>
        ) : (
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        )}
      </button>

      {/* Dropdown Menu - Opens upward since it's at bottom of screen */}
      {isOpen && (
        <div className="absolute z-50 bottom-full mb-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-2 bg-gray-50 border-b">
            <p className="text-xs text-gray-500 font-medium">
              {language === "th" ? "เลือกแผนเพื่อถามคำถามเฉพาะแผน" : "Select a plan for plan-specific questions"}
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {planCategories.map((category) => (
              <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                {/* Category Header */}
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors outline-none
                    ${expandedCategory === category.id ? "bg-gray-50" : ""}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">
                        {category.plans.length}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm">
                        {language === "th" ? category.name_th : category.name_en}
                      </p>
                      <p className="text-xs text-gray-500">
                        {category.plans.length} {language === "th" ? "แผน" : "plans"}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedCategory === category.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Plans List */}
                {expandedCategory === category.id && (
                  <div className="bg-gray-50 py-1">
                    {category.plans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => handlePlanSelect(plan)}
                        className={`
                          w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors outline-none
                          ${selectedPlan?.id === plan.id ? "bg-blue-100" : ""}
                        `}
                      >
                        <p className="font-medium text-gray-900 text-sm">
                          {language === "th" ? plan.name_th : plan.name_en}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {language === "th" ? plan.description_th : plan.description_en}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {plan.key_highlights.slice(0, 3).map((highlight, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-1.5 py-0.5 bg-white rounded border border-gray-200 text-gray-600"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-2 bg-gray-50 border-t">
            <button
              onClick={() => {
                onSelectPlan(null);
                setIsOpen(false);
              }}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-1 outline-none"
            >
              {language === "th" ? "ไม่เลือกแผน (ถามทั่วไป)" : "No plan (general questions)"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
