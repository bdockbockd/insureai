// Critical Illness Insurance Wizard Data
// Products: CI 48 Beyond (75 diseases), Multi Care (81 diseases, 840% payout)

import type { WizardQuestion, WizardOption, SliderConfig } from './health-insurance';

export const criticalIllnessEasyHook: WizardQuestion[] = [
  {
    id: "easy_q1",
    question: "ครอบครัวของคุณมีประวัติเป็นโรคร้ายแรงหรือไม่?",
    question_en: "Does your family have a history of serious illness?",
    type: "single_choice",
    options: [
      {
        value: "yes_multiple",
        label_th: "มี หลายคน/หลายโรค",
        label_en: "Yes, multiple family members or diseases",
        score: { risk: 3, multi_care: 2 }
      },
      {
        value: "yes_one",
        label_th: "มี 1 คน/1 โรค",
        label_en: "Yes, one family member or disease",
        score: { risk: 2, multi_care: 1 }
      },
      {
        value: "no",
        label_th: "ไม่มี",
        label_en: "No family history",
        score: { risk: 1, ci48: 1 }
      },
      {
        value: "unknown",
        label_th: "ไม่ทราบ",
        label_en: "Unknown",
        score: { risk: 1.5, ci48: 0.5, multi_care: 0.5 }
      }
    ],
    required: true,
    next_question: "easy_q2"
  },
  {
    id: "easy_q2",
    question: "ปัจจุบันคุณมีประกันโรคร้ายแรงอยู่แล้วหรือไม่?",
    question_en: "Do you currently have any Critical Illness insurance?",
    type: "single_choice",
    options: [
      {
        value: "none",
        label_th: "ยังไม่มีเลย",
        label_en: "No CI coverage at all",
        score: { urgency: 3, ci48: 2 }
      },
      {
        value: "basic",
        label_th: "มีแต่คุ้มครองน้อย (ต่ำกว่า 1 ล้านบาท)",
        label_en: "Have basic coverage (less than 1M THB)",
        score: { urgency: 2, multi_care: 2 }
      },
      {
        value: "moderate",
        label_th: "มีคุ้มครองพอสมควร (1-3 ล้านบาท)",
        label_en: "Have moderate coverage (1-3M THB)",
        score: { urgency: 1, multi_care: 1 }
      },
      {
        value: "good",
        label_th: "มีคุ้มครองเพียงพอแล้ว (มากกว่า 3 ล้านบาท)",
        label_en: "Have good coverage (more than 3M THB)",
        score: { urgency: 0.5 }
      }
    ],
    required: true,
    next_question: "easy_q3"
  },
  {
    id: "easy_q3",
    question: "คุณต้องการรับเงินชดเชยแบบไหนมากกว่า?",
    question_en: "Which payout style do you prefer?",
    type: "single_choice",
    options: [
      {
        value: "lump_sum",
        label_th: "รับก้อนเดียว เมื่อตรวจพบโรค",
        label_en: "Lump sum when diagnosed",
        score: { ci48: 2, multi_care: 0 }
      },
      {
        value: "multiple_claims",
        label_th: "รับได้หลายครั้ง หากเป็นหลายโรค",
        label_en: "Multiple claims for multiple diseases",
        score: { ci48: 1, multi_care: 2 }
      },
      {
        value: "reclaim",
        label_th: "สามารถเคลมซ้ำได้หากโรคกลับมา",
        label_en: "Re-claim if disease recurs",
        score: { ci48: 0, multi_care: 3 }
      },
      {
        value: "unsure",
        label_th: "ไม่แน่ใจ ขอคำแนะนำ",
        label_en: "Not sure, need advice",
        score: { ci48: 1, multi_care: 1 }
      }
    ],
    required: true,
    next_question: "easy_q4"
  },
  {
    id: "easy_q4",
    question: "งบประมาณสำหรับเบี้ยประกันโรคร้ายแรงต่อปี?",
    question_en: "Annual budget for CI insurance premium?",
    type: "single_choice",
    options: [
      {
        value: "low",
        label_th: "ต่ำกว่า 10,000 บาท/ปี",
        label_en: "Less than 10,000 THB/year",
        score: { ci48: 3, multi_care: 0 }
      },
      {
        value: "medium",
        label_th: "10,000 - 30,000 บาท/ปี",
        label_en: "10,000 - 30,000 THB/year",
        score: { ci48: 2, multi_care: 1 }
      },
      {
        value: "high",
        label_th: "30,000 - 50,000 บาท/ปี",
        label_en: "30,000 - 50,000 THB/year",
        score: { ci48: 1, multi_care: 2 }
      },
      {
        value: "premium",
        label_th: "มากกว่า 50,000 บาท/ปี",
        label_en: "More than 50,000 THB/year",
        score: { ci48: 0, multi_care: 3 }
      }
    ],
    required: true,
    next_question: "result"
  }
];

export const criticalIllnessLongHook: WizardQuestion[] = [
  {
    id: "long_q1",
    question: "คุณอายุเท่าไหร่?",
    question_en: "What is your age?",
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
    question: "เพศของคุณ?",
    question_en: "What is your gender?",
    type: "single_choice",
    options: [
      { value: "male", label_th: "ชาย", label_en: "Male", score: { heart_risk: 1.2 } },
      { value: "female", label_th: "หญิง", label_en: "Female", score: { cancer_risk: 1.1 } }
    ],
    required: true,
    next_question: "long_q3"
  },
  {
    id: "long_q3",
    question: "ครอบครัวของคุณมีประวัติเป็นโรคใดบ้าง? (เลือกได้หลายข้อ)",
    question_en: "Which diseases run in your family? (Select all that apply)",
    type: "multiple_choice",
    options: [
      { value: "cancer", label_th: "มะเร็ง", label_en: "Cancer", score: { cancer_risk: 2, multi_care: 2 } },
      { value: "heart", label_th: "โรคหัวใจ", label_en: "Heart Disease", score: { heart_risk: 2, multi_care: 1.5 } },
      { value: "stroke", label_th: "โรคหลอดเลือดสมอง/อัมพฤกษ์", label_en: "Stroke", score: { stroke_risk: 2, multi_care: 1.5 } },
      { value: "diabetes", label_th: "เบาหวาน", label_en: "Diabetes", score: { diabetes_risk: 2 } },
      { value: "kidney", label_th: "โรคไต", label_en: "Kidney Disease", score: { kidney_risk: 2, multi_care: 1 } },
      { value: "none", label_th: "ไม่มีประวัติ", label_en: "No family history", score: { base_risk: 0, ci48: 1 }, exclusive: true }
    ],
    required: true,
    next_question: "long_q4"
  },
  {
    id: "long_q4",
    question: "คุณสูบบุหรี่หรือไม่?",
    question_en: "Do you smoke?",
    type: "single_choice",
    options: [
      { value: "never", label_th: "ไม่เคยสูบ", label_en: "Never smoked", score: { smoking_risk: 0 } },
      { value: "quit_5plus", label_th: "เลิกแล้วมากกว่า 5 ปี", label_en: "Quit more than 5 years ago", score: { smoking_risk: 0.5 } },
      { value: "quit_recent", label_th: "เลิกแล้วน้อยกว่า 5 ปี", label_en: "Quit less than 5 years ago", score: { smoking_risk: 1 } },
      { value: "occasional", label_th: "สูบเป็นครั้งคราว", label_en: "Occasional smoker", score: { smoking_risk: 1.5, multi_care: 1 } },
      { value: "regular", label_th: "สูบประจำ", label_en: "Regular smoker", score: { smoking_risk: 2, multi_care: 2 } }
    ],
    required: true,
    next_question: "long_q5"
  },
  {
    id: "long_q5",
    question: "คุณออกกำลังกายบ่อยแค่ไหน?",
    question_en: "How often do you exercise?",
    type: "single_choice",
    options: [
      { value: "daily", label_th: "ทุกวัน หรือเกือบทุกวัน", label_en: "Daily or almost daily", score: { fitness_bonus: -0.3 } },
      { value: "3_4_week", label_th: "3-4 ครั้งต่อสัปดาห์", label_en: "3-4 times per week", score: { fitness_bonus: -0.2 } },
      { value: "1_2_week", label_th: "1-2 ครั้งต่อสัปดาห์", label_en: "1-2 times per week", score: { fitness_bonus: -0.1 } },
      { value: "rarely", label_th: "นานๆ ครั้ง", label_en: "Rarely", score: { fitness_bonus: 0 } },
      { value: "never", label_th: "ไม่ออกกำลังกายเลย", label_en: "Never exercise", score: { fitness_bonus: 0.2, multi_care: 0.5 } }
    ],
    required: true,
    next_question: "long_q6"
  },
  {
    id: "long_q6",
    question: "ปัจจุบันคุณมีประกันอะไรบ้าง? (เลือกได้หลายข้อ)",
    question_en: "What insurance do you currently have? (Select all that apply)",
    type: "multiple_choice",
    options: [
      { value: "health", label_th: "ประกันสุขภาพ (ค่ารักษาพยาบาล)", label_en: "Health Insurance", score: { coverage_type: 1 } },
      { value: "life", label_th: "ประกันชีวิต", label_en: "Life Insurance", score: { coverage_type: 1 } },
      { value: "ci_basic", label_th: "ประกันโรคร้ายแรง (วงเงินต่ำกว่า 1 ล้าน)", label_en: "CI Insurance (less than 1M)", score: { ci_gap: 2 } },
      { value: "ci_good", label_th: "ประกันโรคร้ายแรง (วงเงิน 1-3 ล้าน)", label_en: "CI Insurance (1-3M)", score: { ci_gap: 1 } },
      { value: "social_security", label_th: "ประกันสังคมเท่านั้น", label_en: "Social Security only", score: { ci_gap: 3, ci48: 2 } },
      { value: "none", label_th: "ไม่มีประกันเลย", label_en: "No insurance", score: { ci_gap: 4, ci48: 2 }, exclusive: true }
    ],
    required: true,
    next_question: "long_q7"
  },
  {
    id: "long_q7",
    question: "รายได้ต่อเดือนของคุณประมาณเท่าไหร่?",
    question_en: "What is your approximate monthly income?",
    type: "single_choice",
    options: [
      { value: "under_30k", label_th: "ต่ำกว่า 30,000 บาท", label_en: "Less than 30,000 THB", score: { income_tier: 1, ci48: 2 } },
      { value: "30k_50k", label_th: "30,000 - 50,000 บาท", label_en: "30,000 - 50,000 THB", score: { income_tier: 2, ci48: 1 } },
      { value: "50k_100k", label_th: "50,000 - 100,000 บาท", label_en: "50,000 - 100,000 THB", score: { income_tier: 3, multi_care: 1 } },
      { value: "100k_200k", label_th: "100,000 - 200,000 บาท", label_en: "100,000 - 200,000 THB", score: { income_tier: 4, multi_care: 2 } },
      { value: "over_200k", label_th: "มากกว่า 200,000 บาท", label_en: "More than 200,000 THB", score: { income_tier: 5, multi_care: 3 } }
    ],
    required: true,
    next_question: "long_q8"
  },
  {
    id: "long_q8",
    question: "หากป่วยเป็นโรคร้ายแรง คุณต้องการเงินก้อนเพื่ออะไร? (เลือกได้หลายข้อ)",
    question_en: "If diagnosed with CI, what would you use the lump sum for?",
    type: "multiple_choice",
    options: [
      { value: "treatment", label_th: "ค่ารักษาพยาบาลเพิ่มเติม", label_en: "Additional treatment costs", score: { need_category: 1 } },
      { value: "income_replace", label_th: "ทดแทนรายได้ที่ขาดหายไป", label_en: "Replace lost income", score: { need_category: 2, multi_care: 1 } },
      { value: "debt", label_th: "ชำระหนี้สิน (บ้าน, รถ)", label_en: "Pay off debts (mortgage, car)", score: { need_category: 2, multi_care: 1 } },
      { value: "family", label_th: "ดูแลครอบครัว/บุตร", label_en: "Support family/children", score: { need_category: 1.5, multi_care: 1 } },
      { value: "alternative", label_th: "รักษาทางเลือก/ต่างประเทศ", label_en: "Alternative/overseas treatment", score: { need_category: 2.5, multi_care: 2 } }
    ],
    required: true,
    next_question: "long_q9"
  },
  {
    id: "long_q9",
    question: "คุณกังวลเรื่องใดมากที่สุด?",
    question_en: "What concerns you most?",
    type: "single_choice",
    options: [
      { value: "first_diagnosis", label_th: "กลัวเป็นโรคร้ายแรงครั้งแรก", label_en: "Fear of first CI diagnosis", score: { ci48: 2, multi_care: 1 } },
      { value: "recurrence", label_th: "กลัวโรคกลับมาเป็นซ้ำ", label_en: "Fear of disease recurrence", score: { ci48: 0, multi_care: 3 } },
      { value: "multiple_diseases", label_th: "กลัวเป็นหลายโรคพร้อมกัน", label_en: "Fear of multiple diseases", score: { ci48: 1, multi_care: 3 } },
      { value: "max_payout", label_th: "ต้องการวงเงินคุ้มครองสูงสุด", label_en: "Want maximum coverage payout", score: { ci48: 1, multi_care: 3 } },
      { value: "affordability", label_th: "กังวลเรื่องเบี้ยประกัน", label_en: "Concerned about premium cost", score: { ci48: 2, multi_care: 1 } }
    ],
    required: true,
    next_question: "long_q10"
  },
  {
    id: "long_q10",
    question: "งบประมาณสำหรับเบี้ยประกันโรคร้ายแรงต่อปี?",
    question_en: "Annual budget for CI insurance premium?",
    type: "slider",
    config: {
      min: 5000,
      max: 100000,
      step: 5000,
      default: 20000,
      unit: "บาท/ปี (THB/year)"
    },
    required: true,
    next_question: "result"
  }
];

export const criticalIllnessProducts = {
  ci48: {
    id: "ci48",
    name_th: "CI 48 Beyond",
    name_en: "CI 48 Beyond",
    brochure_path: "/brochures/critical-illness/ci-48-beyond.pdf",
    diseases_covered: 75,
    max_payout: "170%",
    key_features_th: ["คุ้มครอง 75 โรค/ภาวะ", "จ่ายสูงสุด 170%", "เคลมได้หลายกลุ่มโรค", "เบี้ยประหยัด"],
    key_features_en: ["75 diseases/conditions covered", "Up to 170% payout", "Multiple claims for different disease groups", "Lower premium"],
    ideal_for_th: ["ผู้เริ่มทำประกันโรคร้าย", "งบประมาณจำกัด", "ต้องการความคุ้มครองกว้าง", "อายุน้อยกว่า 40"],
    ideal_for_en: ["First-time CI insurance buyers", "Budget-conscious", "Want broad coverage", "Under 40 years old"],
    premium_base: 8000
  },
  multi_care: {
    id: "multi_care",
    name_th: "Multi Care",
    name_en: "Multi Care",
    brochure_path: "/brochures/critical-illness/multi-care.pdf",
    diseases_covered: 81,
    max_payout: "840%",
    key_features_th: ["คุ้มครอง 81 โรค", "จ่ายสูงสุด 840%", "เคลมซ้ำได้ 3 โรคหลัก", "คุ้มครองโรคกลับมาเป็นซ้ำ"],
    key_features_en: ["81 diseases covered", "Up to 840% payout", "Re-claim feature for top 3 diseases", "Multiple payouts for recurring disease"],
    ideal_for_th: ["มีประวัติครอบครัวเป็นโรคร้าย", "กังวลเรื่องโรคกลับมา", "รายได้สูง", "ต้องการความคุ้มครองสูงสุด"],
    ideal_for_en: ["High family history of CI", "Concerned about recurrence", "Higher income earners", "Maximum protection seekers"],
    premium_base: 15000
  }
};
