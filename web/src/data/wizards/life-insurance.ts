// Life Insurance Wizard Data
// Products: High Capital Life Plan (แผนทุนชีวิตสูง)

import type { WizardQuestion } from './health-insurance';

export const lifeInsuranceEasyHook: WizardQuestion[] = [
  {
    id: "easy_q1",
    question: "คุณต้องการทุนประกันชีวิตเท่าไหร่?",
    question_en: "How much life insurance coverage do you need?",
    type: "single_choice",
    options: [
      {
        value: "low",
        label_th: "1-3 ล้านบาท",
        label_en: "1-3 Million THB",
        score: { high_capital: 1 }
      },
      {
        value: "medium",
        label_th: "3-5 ล้านบาท",
        label_en: "3-5 Million THB",
        score: { high_capital: 2 }
      },
      {
        value: "high",
        label_th: "5-10 ล้านบาท",
        label_en: "5-10 Million THB",
        score: { high_capital: 3 }
      },
      {
        value: "very_high",
        label_th: "มากกว่า 10 ล้านบาท",
        label_en: "More than 10 Million THB",
        score: { high_capital: 4 }
      }
    ],
    required: true,
    next_question: "easy_q2"
  },
  {
    id: "easy_q2",
    question: "จุดประสงค์หลักในการทำประกันชีวิต?",
    question_en: "What is your main purpose for life insurance?",
    type: "single_choice",
    options: [
      {
        value: "family_protection",
        label_th: "คุ้มครองครอบครัวหากจากไป",
        label_en: "Protect family if I pass away",
        score: { high_capital: 3 }
      },
      {
        value: "debt_coverage",
        label_th: "ชำระหนี้สิน (บ้าน/รถ)",
        label_en: "Cover debts (mortgage/car)",
        score: { high_capital: 2 }
      },
      {
        value: "inheritance",
        label_th: "สร้างมรดกให้ทายาท",
        label_en: "Create inheritance for heirs",
        score: { high_capital: 3 }
      },
      {
        value: "tax_planning",
        label_th: "วางแผนภาษีมรดก",
        label_en: "Estate tax planning",
        score: { high_capital: 4 }
      }
    ],
    required: true,
    next_question: "easy_q3"
  },
  {
    id: "easy_q3",
    question: "งบประมาณค่าเบี้ยประกันต่อปี?",
    question_en: "What is your annual premium budget?",
    type: "single_choice",
    options: [
      {
        value: "budget_low",
        label_th: "ไม่เกิน 50,000 บาท/ปี",
        label_en: "Up to 50,000 THB/year",
        score: { high_capital: 1 }
      },
      {
        value: "budget_mid",
        label_th: "50,000 - 100,000 บาท/ปี",
        label_en: "50,000 - 100,000 THB/year",
        score: { high_capital: 2 }
      },
      {
        value: "budget_high",
        label_th: "100,000 - 300,000 บาท/ปี",
        label_en: "100,000 - 300,000 THB/year",
        score: { high_capital: 3 }
      },
      {
        value: "budget_premium",
        label_th: "มากกว่า 300,000 บาท/ปี",
        label_en: "More than 300,000 THB/year",
        score: { high_capital: 4 }
      }
    ],
    required: true,
    next_question: "result"
  }
];

export const lifeInsuranceLongHook: WizardQuestion[] = [
  {
    id: "long_q1",
    question: "คุณอายุเท่าไหร่?",
    question_en: "How old are you?",
    type: "slider",
    config: {
      min: 18,
      max: 65,
      step: 1,
      default: 35,
      unit: "ปี (years)"
    },
    required: true,
    next_question: "long_q2"
  },
  {
    id: "long_q2",
    question: "สถานภาพครอบครัวของคุณ?",
    question_en: "What is your family status?",
    type: "single_choice",
    options: [
      { value: "single", label_th: "โสด", label_en: "Single", score: { high_capital: 1 } },
      { value: "married_no_kids", label_th: "แต่งงานแล้ว ยังไม่มีบุตร", label_en: "Married, no children", score: { high_capital: 2 } },
      { value: "married_with_kids", label_th: "แต่งงานแล้ว มีบุตร", label_en: "Married with children", score: { high_capital: 3 } },
      { value: "single_parent", label_th: "เลี้ยงบุตรคนเดียว", label_en: "Single parent", score: { high_capital: 4 } }
    ],
    required: true,
    next_question: "long_q3"
  },
  {
    id: "long_q3",
    question: "รายได้ต่อเดือนของคุณ?",
    question_en: "What is your monthly income?",
    type: "single_choice",
    options: [
      { value: "income_under_50k", label_th: "ต่ำกว่า 50,000 บาท", label_en: "Below 50,000 THB", score: { high_capital: 1 } },
      { value: "income_50_100k", label_th: "50,000 - 100,000 บาท", label_en: "50,000 - 100,000 THB", score: { high_capital: 2 } },
      { value: "income_100_300k", label_th: "100,000 - 300,000 บาท", label_en: "100,000 - 300,000 THB", score: { high_capital: 3 } },
      { value: "income_300k_plus", label_th: "300,000 บาทขึ้นไป", label_en: "300,000+ THB", score: { high_capital: 4 } }
    ],
    required: true,
    next_question: "long_q4"
  },
  {
    id: "long_q4",
    question: "คุณมีหนี้สินรวมเท่าไหร่?",
    question_en: "What is your total debt?",
    type: "single_choice",
    options: [
      { value: "no_debt", label_th: "ไม่มีหนี้สิน", label_en: "No debt", score: { high_capital: 1 } },
      { value: "debt_under_3m", label_th: "ต่ำกว่า 3 ล้านบาท", label_en: "Below 3M THB", score: { high_capital: 2 } },
      { value: "debt_3_10m", label_th: "3 - 10 ล้านบาท", label_en: "3 - 10M THB", score: { high_capital: 3 } },
      { value: "debt_10m_plus", label_th: "มากกว่า 10 ล้านบาท", label_en: "More than 10M THB", score: { high_capital: 4 } }
    ],
    required: true,
    next_question: "long_q5"
  },
  {
    id: "long_q5",
    question: "คุณมีประกันชีวิตอยู่แล้วหรือไม่?",
    question_en: "Do you currently have life insurance?",
    type: "single_choice",
    options: [
      { value: "no_life", label_th: "ไม่มี", label_en: "No life insurance", score: { high_capital: 3 } },
      { value: "has_basic", label_th: "มี ทุนต่ำกว่า 1 ล้าน", label_en: "Yes, below 1M coverage", score: { high_capital: 3 } },
      { value: "has_medium", label_th: "มี ทุน 1-5 ล้าน", label_en: "Yes, 1-5M coverage", score: { high_capital: 2 } },
      { value: "has_high", label_th: "มี ทุนมากกว่า 5 ล้าน", label_en: "Yes, 5M+ coverage", score: { high_capital: 1 } }
    ],
    required: true,
    next_question: "long_q6"
  },
  {
    id: "long_q6",
    question: "ทุนประกันที่ต้องการ?",
    question_en: "How much coverage do you need?",
    type: "slider",
    config: {
      min: 1000000,
      max: 50000000,
      step: 1000000,
      default: 5000000,
      unit: "บาท (THB)"
    },
    required: true,
    next_question: "result"
  }
];

export const lifeInsuranceProducts = {
  high_capital: {
    id: "high_capital",
    name_th: "แผนทุนชีวิตสูง",
    name_en: "High Capital Life Plan",
    brochure_path: "/brochures/life-insurance/high-capital-life.pdf",
    coverage_limit: "Up to 50M THB",
    key_features_th: [
      "ทุนประกันสูง คุ้มครองครอบครัว",
      "เบี้ยประหยัด เหมาะสำหรับทุนสูง",
      "ลดหย่อนภาษีได้สูงสุด 100,000 บาท",
      "รับทุนคืนตามสัญญา"
    ],
    key_features_en: [
      "High sum insured for family protection",
      "Cost-effective premium for high coverage",
      "Tax deduction up to 100,000 THB",
      "Guaranteed maturity benefit"
    ],
    ideal_for_th: [
      "ผู้มีภาระครอบครัว",
      "เจ้าของธุรกิจ",
      "ผู้มีหนี้สินสูง",
      "ต้องการวางแผนมรดก"
    ],
    ideal_for_en: [
      "Family breadwinners",
      "Business owners",
      "Those with significant debts",
      "Estate planning needs"
    ],
    premium_base: 25000
  }
};
