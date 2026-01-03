// Savings & Pension Insurance Wizard Data
// Products: My Double Plus (115% coverage, 140% maturity), Pension Plus 85A55 (annuity 55-85)

import type { WizardQuestion, WizardOption, SliderConfig } from './health-insurance';

export const savingsPensionEasyHook: WizardQuestion[] = [
  {
    id: "easy_q1",
    question: "เป้าหมายทางการเงินหลักของคุณคืออะไร?",
    question_en: "What is your primary financial goal?",
    type: "single_choice",
    options: [
      {
        value: "retirement",
        label_th: "วางแผนเกษียณ - อยากมีรายได้หลังเกษียณ",
        label_en: "Retirement Planning - Want income after retirement",
        score: { pension: 3, savings: 1 }
      },
      {
        value: "savings",
        label_th: "ออมเงินระยะยาว - สะสมความมั่งคั่ง",
        label_en: "Long-term Savings - Build wealth",
        score: { pension: 1, savings: 3 }
      },
      {
        value: "tax",
        label_th: "ลดหย่อนภาษี - ประหยัดภาษีปีนี้",
        label_en: "Tax Benefits - Save on taxes this year",
        score: { pension: 2, savings: 2 }
      },
      {
        value: "protection",
        label_th: "คุ้มครองครอบครัว - ความมั่นคงของคนที่รัก",
        label_en: "Family Protection - Security for loved ones",
        score: { pension: 0, savings: 3 }
      }
    ],
    required: true,
    next_question: "easy_q2"
  },
  {
    id: "easy_q2",
    question: "คุณอายุเท่าไหร่?",
    question_en: "How old are you?",
    type: "single_choice",
    options: [
      {
        value: "age_20_35",
        label_th: "20-35 ปี",
        label_en: "20-35 years",
        score: { pension: 1, savings: 3 }
      },
      {
        value: "age_36_45",
        label_th: "36-45 ปี",
        label_en: "36-45 years",
        score: { pension: 2, savings: 2 }
      },
      {
        value: "age_46_55",
        label_th: "46-55 ปี",
        label_en: "46-55 years",
        score: { pension: 3, savings: 1 }
      },
      {
        value: "age_55_plus",
        label_th: "55 ปีขึ้นไป",
        label_en: "55+ years",
        score: { pension: 3, savings: 0 }
      }
    ],
    required: true,
    next_question: "easy_q3"
  },
  {
    id: "easy_q3",
    question: "คุณต้องการใช้เงินก้อนนี้เมื่อไหร่?",
    question_en: "When do you need to access this money?",
    type: "single_choice",
    options: [
      {
        value: "short",
        label_th: "ภายใน 5 ปี",
        label_en: "Within 5 years",
        score: { pension: 0, savings: 1 }
      },
      {
        value: "medium",
        label_th: "5-15 ปี",
        label_en: "5-15 years",
        score: { pension: 1, savings: 3 }
      },
      {
        value: "long",
        label_th: "15-30 ปี (จนเกษียณ)",
        label_en: "15-30 years (until retirement)",
        score: { pension: 3, savings: 2 }
      },
      {
        value: "retirement_income",
        label_th: "ต้องการรายได้ประจำหลังเกษียณ",
        label_en: "Want regular income after retirement",
        score: { pension: 3, savings: 0 }
      }
    ],
    required: true,
    next_question: "easy_q4"
  },
  {
    id: "easy_q4",
    question: "คุณรับความเสี่ยงได้มากแค่ไหน?",
    question_en: "How much risk can you tolerate?",
    type: "single_choice",
    options: [
      {
        value: "conservative",
        label_th: "ต่ำ - ต้องการความมั่นคง รับผลตอบแทนคงที่",
        label_en: "Low - Want stability, accept fixed returns",
        score: { pension: 3, savings: 2 }
      },
      {
        value: "moderate",
        label_th: "ปานกลาง - รับความผันผวนได้บ้าง เพื่อผลตอบแทนที่ดีกว่า",
        label_en: "Moderate - Accept some volatility for better returns",
        score: { pension: 2, savings: 3 }
      },
      {
        value: "aggressive",
        label_th: "สูง - ยอมรับความผันผวน เพื่อโอกาสผลตอบแทนสูง",
        label_en: "High - Accept volatility for high return potential",
        score: { pension: 1, savings: 3 }
      }
    ],
    required: true,
    next_question: "easy_q5"
  },
  {
    id: "easy_q5",
    question: "คุณมีภาระหนี้สินหรือผู้อยู่ในอุปการะหรือไม่?",
    question_en: "Do you have debts or dependents?",
    type: "single_choice",
    options: [
      {
        value: "yes_both",
        label_th: "มีทั้งหนี้สินและผู้อยู่ในอุปการะ",
        label_en: "Yes, both debts and dependents",
        score: { pension: 0, savings: 3 }
      },
      {
        value: "dependents_only",
        label_th: "มีผู้อยู่ในอุปการะ (ลูก/พ่อแม่)",
        label_en: "Have dependents (children/parents)",
        score: { pension: 1, savings: 3 }
      },
      {
        value: "debt_only",
        label_th: "มีหนี้สิน (บ้าน/รถ)",
        label_en: "Have debts (mortgage/car)",
        score: { pension: 1, savings: 2 }
      },
      {
        value: "none",
        label_th: "ไม่มี - อิสระทางการเงิน",
        label_en: "None - Financially independent",
        score: { pension: 2, savings: 2 }
      }
    ],
    required: true,
    next_question: "result"
  }
];

export const savingsPensionLongHook: WizardQuestion[] = [
  {
    id: "long_q1",
    question: "คุณอายุเท่าไหร่?",
    question_en: "How old are you?",
    type: "slider",
    config: {
      min: 20,
      max: 65,
      step: 1,
      default: 35,
      unit: "ปี / years"
    },
    required: true,
    next_question: "long_q2"
  },
  {
    id: "long_q2",
    question: "คุณต้องการเกษียณเมื่ออายุเท่าไหร่?",
    question_en: "At what age do you want to retire?",
    type: "single_choice",
    options: [
      { value: "retire_55", label_th: "55 ปี - เกษียณเร็ว", label_en: "55 - Early retirement", score: { pension: 3, savings: 2 } },
      { value: "retire_60", label_th: "60 ปี - เกษียณตามปกติ", label_en: "60 - Standard retirement", score: { pension: 3, savings: 2 } },
      { value: "retire_65", label_th: "65 ปี - ทำงานต่อ", label_en: "65 - Extended career", score: { pension: 2, savings: 2 } },
      { value: "no_plan", label_th: "ยังไม่แน่ใจ", label_en: "Not sure yet", score: { pension: 1, savings: 2 } }
    ],
    required: true,
    next_question: "long_q3"
  },
  {
    id: "long_q3",
    question: "รายได้ต่อเดือนของคุณอยู่ในช่วงใด?",
    question_en: "What is your monthly income range?",
    type: "single_choice",
    options: [
      { value: "income_under_30k", label_th: "ต่ำกว่า 30,000 บาท", label_en: "Below 30,000 THB", score: { pension: 1, savings: 2 } },
      { value: "income_30_50k", label_th: "30,000 - 50,000 บาท", label_en: "30,000 - 50,000 THB", score: { pension: 2, savings: 2 } },
      { value: "income_50_100k", label_th: "50,000 - 100,000 บาท", label_en: "50,000 - 100,000 THB", score: { pension: 2, savings: 3 } },
      { value: "income_100k_plus", label_th: "100,000 บาทขึ้นไป", label_en: "100,000+ THB", score: { pension: 3, savings: 3 } }
    ],
    required: true,
    next_question: "long_q4"
  },
  {
    id: "long_q4",
    question: "คุณมีเงินออมหรือการลงทุนรวมเท่าไหร่?",
    question_en: "What is your total savings/investments?",
    type: "single_choice",
    options: [
      { value: "savings_under_100k", label_th: "ต่ำกว่า 100,000 บาท", label_en: "Below 100,000 THB", score: { pension: 1, savings: 3 } },
      { value: "savings_100k_500k", label_th: "100,000 - 500,000 บาท", label_en: "100,000 - 500,000 THB", score: { pension: 2, savings: 2 } },
      { value: "savings_500k_2m", label_th: "500,000 - 2,000,000 บาท", label_en: "500,000 - 2,000,000 THB", score: { pension: 2, savings: 2 } },
      { value: "savings_2m_plus", label_th: "2,000,000 บาทขึ้นไป", label_en: "2,000,000+ THB", score: { pension: 3, savings: 2 } }
    ],
    required: true,
    next_question: "long_q5"
  },
  {
    id: "long_q5",
    question: "คุณสามารถออมเงินต่อเดือนได้เท่าไหร่?",
    question_en: "How much can you save monthly?",
    type: "slider",
    config: {
      min: 1000,
      max: 50000,
      step: 1000,
      default: 5000,
      unit: "บาท/เดือน (THB/month)"
    },
    required: true,
    next_question: "long_q6"
  },
  {
    id: "long_q6",
    question: "ความเสี่ยงที่คุณยอมรับได้?",
    question_en: "What is your risk tolerance?",
    type: "single_choice",
    options: [
      { value: "risk_very_low", label_th: "ต่ำมาก - ไม่ยอมขาดทุนเลย", label_en: "Very Low - Cannot accept any loss", score: { pension: 3, savings: 1 } },
      { value: "risk_low", label_th: "ต่ำ - รับขาดทุนได้ไม่เกิน 5%", label_en: "Low - Accept up to 5% loss", score: { pension: 3, savings: 2 } },
      { value: "risk_moderate", label_th: "ปานกลาง - รับขาดทุนได้ 5-15%", label_en: "Moderate - Accept 5-15% loss", score: { pension: 2, savings: 3 } },
      { value: "risk_high", label_th: "สูง - รับขาดทุนได้มากกว่า 15%", label_en: "High - Accept 15%+ loss", score: { pension: 1, savings: 3 } }
    ],
    required: true,
    next_question: "long_q7"
  },
  {
    id: "long_q7",
    question: "คุณต้องการลดหย่อนภาษีหรือไม่?",
    question_en: "Do you want tax deductions?",
    type: "single_choice",
    options: [
      { value: "tax_yes_max", label_th: "ใช่ ต้องการลดหย่อนสูงสุด", label_en: "Yes, want maximum deduction", score: { pension: 3, savings: 3 } },
      { value: "tax_yes_some", label_th: "ใช่ ต้องการลดหย่อนบ้าง", label_en: "Yes, want some deduction", score: { pension: 2, savings: 2 } },
      { value: "tax_no", label_th: "ไม่จำเป็น / ใช้สิทธิ์เต็มแล้ว", label_en: "No need / Already maxed out", score: { pension: 1, savings: 1 } }
    ],
    required: true,
    next_question: "long_q8"
  },
  {
    id: "long_q8",
    question: "คุณมีประกันชีวิตหรือแผนเกษียณอื่นๆ อยู่แล้วหรือไม่?",
    question_en: "Do you have existing life insurance or retirement plans?",
    type: "multiple_choice",
    options: [
      { value: "existing_ssf", label_th: "SSF (กองทุนรวมเพื่อการออม)", label_en: "SSF (Super Savings Fund)", score: { pension: 1, savings: 0 } },
      { value: "existing_rmf", label_th: "RMF (กองทุนรวมเพื่อการเลี้ยงชีพ)", label_en: "RMF (Retirement Mutual Fund)", score: { pension: 0, savings: 1 } },
      { value: "existing_provident", label_th: "กองทุนสำรองเลี้ยงชีพ", label_en: "Provident Fund", score: { pension: 0, savings: 1 } },
      { value: "existing_life", label_th: "ประกันชีวิต", label_en: "Life Insurance", score: { pension: 1, savings: -1 } },
      { value: "existing_none", label_th: "ยังไม่มี", label_en: "None yet", score: { pension: 2, savings: 2 } }
    ],
    required: true,
    next_question: "long_q9"
  },
  {
    id: "long_q9",
    question: "รายได้ของคุณมั่นคงแค่ไหน?",
    question_en: "How stable is your income?",
    type: "single_choice",
    options: [
      { value: "income_very_stable", label_th: "มั่นคงมาก - ข้าราชการ/พนักงานประจำบริษัทใหญ่", label_en: "Very Stable - Government/Large corporation", score: { pension: 3, savings: 2 } },
      { value: "income_stable", label_th: "มั่นคง - พนักงานประจำ", label_en: "Stable - Regular employee", score: { pension: 2, savings: 2 } },
      { value: "income_moderate", label_th: "ปานกลาง - มีรายได้เสริม/ฟรีแลนซ์บ้าง", label_en: "Moderate - Some freelance/side income", score: { pension: 1, savings: 2 } },
      { value: "income_variable", label_th: "ผันผวน - เจ้าของธุรกิจ/ฟรีแลนซ์เต็มตัว", label_en: "Variable - Business owner/Full-time freelance", score: { pension: 1, savings: 3 } }
    ],
    required: true,
    next_question: "long_q10"
  },
  {
    id: "long_q10",
    question: "คุณมีผู้อยู่ในอุปการะกี่คน?",
    question_en: "How many dependents do you have?",
    type: "single_choice",
    options: [
      { value: "dependents_0", label_th: "ไม่มี", label_en: "None", score: { pension: 2, savings: 1 } },
      { value: "dependents_1_2", label_th: "1-2 คน", label_en: "1-2 people", score: { pension: 1, savings: 3 } },
      { value: "dependents_3_plus", label_th: "3 คนขึ้นไป", label_en: "3+ people", score: { pension: 0, savings: 3 } }
    ],
    required: true,
    next_question: "long_q11"
  },
  {
    id: "long_q11",
    question: "หลังเกษียณ คุณต้องการรายได้ประมาณเท่าไหร่ต่อเดือน?",
    question_en: "How much monthly income do you want after retirement?",
    type: "single_choice",
    options: [
      { value: "retire_income_20k", label_th: "20,000 บาท - ใช้ชีวิตเรียบง่าย", label_en: "20,000 THB - Simple lifestyle", score: { pension: 2, savings: 2 } },
      { value: "retire_income_40k", label_th: "40,000 บาท - สบายพอประมาณ", label_en: "40,000 THB - Comfortable", score: { pension: 3, savings: 2 } },
      { value: "retire_income_60k", label_th: "60,000 บาท - ใช้ชีวิตสุขสบาย", label_en: "60,000 THB - Comfortable lifestyle", score: { pension: 3, savings: 2 } },
      { value: "retire_income_100k", label_th: "100,000+ บาท - ใช้ชีวิตหรูหรา", label_en: "100,000+ THB - Luxury lifestyle", score: { pension: 3, savings: 3 } }
    ],
    required: true,
    next_question: "long_q12"
  },
  {
    id: "long_q12",
    question: "คุณกังวลเรื่องอะไรมากที่สุดเกี่ยวกับอนาคต?",
    question_en: "What concerns you most about the future?",
    type: "multiple_choice",
    options: [
      { value: "concern_outlive", label_th: "เงินหมดก่อนตาย", label_en: "Outliving my savings", score: { pension: 3, savings: 0 } },
      { value: "concern_inflation", label_th: "เงินเฟ้อกัดกินเงินออม", label_en: "Inflation eroding savings", score: { pension: 1, savings: 3 } },
      { value: "concern_family", label_th: "ครอบครัวไม่มีใครดูแลหากจากไป", label_en: "Family left without support", score: { pension: 0, savings: 3 } },
      { value: "concern_health", label_th: "ค่ารักษาพยาบาลสูง", label_en: "High medical expenses", score: { pension: 2, savings: 2 } },
      { value: "concern_lifestyle", label_th: "คุณภาพชีวิตหลังเกษียณตกต่ำ", label_en: "Declining quality of life after retirement", score: { pension: 3, savings: 1 } }
    ],
    required: true,
    next_question: "result"
  }
];

export const savingsPensionProducts = {
  savings: {
    id: "savings",
    name_th: "My Double Plus",
    name_en: "My Double Plus",
    coverage: "115%",
    maturity_benefit: "140%",
    key_features_th: ["คุ้มครองชีวิต 115% ของทุนประกัน", "รับเงินคืน 140% เมื่อครบสัญญา", "ลดหย่อนภาษีได้สูงสุด 100,000 บาท", "Dynamic Asset Allocation ปรับพอร์ตอัตโนมัติ"],
    key_features_en: ["Life coverage 115% of sum insured", "140% maturity benefit", "Tax deduction up to 100,000 THB", "Dynamic Asset Allocation auto-rebalancing"],
    ideal_for_th: ["อายุน้อยกว่า 45 ปี", "ต้องการออม + คุ้มครองชีวิต", "ต้องการลดหย่อนภาษี", "สร้างความมั่งคั่งระยะกลาง"],
    ideal_for_en: ["Under 45 years old", "Want savings + life coverage", "Tax deduction seekers", "Medium-term wealth building"],
    premium_base: 12000
  },
  pension: {
    id: "pension",
    name_th: "Pension Plus 85A55",
    name_en: "Pension Plus 85A55",
    annuity_period: "55-85 years old",
    guaranteed_return: "10% per year + bonus",
    key_features_th: ["รับเงินบำนาญทุกปี ตั้งแต่อายุ 55-85 ปี", "การันตีผลตอบแทน 10% ต่อปี + โบนัส", "ลดหย่อนภาษีได้สูงสุด 200,000 บาท", "ไม่ต้องกังวลเรื่องเงินหมดก่อนตาย"],
    key_features_en: ["Annual pension from age 55-85", "Guaranteed 10% return/year + bonus", "Tax deduction up to 200,000 THB", "No worry about outliving savings"],
    ideal_for_th: ["อายุ 45-55 ปี", "ต้องการรายได้หลังเกษียณ", "วางแผนภาษีระยะยาว", "ต้องการผลตอบแทนที่แน่นอน"],
    ideal_for_en: ["Age 45-55", "Want guaranteed retirement income", "Long-term tax planning", "Want guaranteed returns"],
    premium_base: 20000
  }
};
