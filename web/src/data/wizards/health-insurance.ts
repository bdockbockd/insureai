// Health Insurance Wizard Data
// Products: First Class All Hospital 80/100 MB, Double Care All Hospital (8-30 MB), First Class BDMS 60/120 MB

export interface WizardQuestion {
  id: string;
  section?: string;
  question: string;
  question_en: string;
  type: 'single_choice' | 'multiple_choice' | 'slider' | 'text';
  options?: WizardOption[];
  config?: SliderConfig;
  required: boolean;
  next_question?: string;
  logic?: Record<string, string>;
}

export interface WizardOption {
  value: string;
  label_th: string;
  label_en: string;
  score: Record<string, number>;
  exclusive?: boolean;
}

export interface SliderConfig {
  min: number;
  max: number;
  step: number;
  default: number;
  unit: string;
}

export const healthInsuranceEasyHook: WizardQuestion[] = [
  {
    id: "easy_q1",
    question: "คุณต้องการความคุ้มครองระดับใด?",
    question_en: "What level of coverage do you need?",
    type: "single_choice",
    options: [
      {
        value: "standard",
        label_th: "มาตรฐาน - รักษาได้ทุกโรงพยาบาล",
        label_en: "Standard - Any hospital coverage",
        score: { all_hos: 3, platinum: 1, bdms: 1 }
      },
      {
        value: "premium",
        label_th: "พรีเมียม - วงเงินสูง ครอบคลุมทุกการรักษา",
        label_en: "Premium - High coverage, comprehensive",
        score: { all_hos: 1, platinum: 3, bdms: 2 }
      },
      {
        value: "vip",
        label_th: "VIP - โรงพยาบาลชั้นนำ บริการระดับสูงสุด",
        label_en: "VIP - Top hospitals, best service",
        score: { all_hos: 0, platinum: 2, bdms: 3 }
      }
    ],
    required: true,
    next_question: "easy_q2"
  },
  {
    id: "easy_q2",
    question: "งบประมาณค่าเบี้ยประกันต่อปีของคุณ?",
    question_en: "What's your annual premium budget?",
    type: "single_choice",
    options: [
      {
        value: "budget_low",
        label_th: "ไม่เกิน 50,000 บาท/ปี",
        label_en: "Up to 50,000 THB/year",
        score: { all_hos: 3, platinum: 1, bdms: 0 }
      },
      {
        value: "budget_mid",
        label_th: "50,000 - 100,000 บาท/ปี",
        label_en: "50,000 - 100,000 THB/year",
        score: { all_hos: 2, platinum: 3, bdms: 1 }
      },
      {
        value: "budget_high",
        label_th: "100,000 - 200,000 บาท/ปี",
        label_en: "100,000 - 200,000 THB/year",
        score: { all_hos: 1, platinum: 3, bdms: 2 }
      },
      {
        value: "budget_premium",
        label_th: "มากกว่า 200,000 บาท/ปี",
        label_en: "More than 200,000 THB/year",
        score: { all_hos: 0, platinum: 2, bdms: 3 }
      }
    ],
    required: true,
    next_question: "easy_q3"
  },
  {
    id: "easy_q3",
    question: "คุณมีโรงพยาบาลที่ชอบใช้บริการเป็นประจำหรือไม่?",
    question_en: "Do you have a preferred hospital?",
    type: "single_choice",
    options: [
      {
        value: "bdms_network",
        label_th: "ใช่ - โรงพยาบาลในเครือ BDMS (กรุงเทพ, สมิติเวช, BNH, พญาไท)",
        label_en: "Yes - BDMS hospitals (Bangkok, Samitivej, BNH, Phyathai)",
        score: { all_hos: 1, platinum: 2, bdms: 3 }
      },
      {
        value: "other_premium",
        label_th: "ใช่ - โรงพยาบาลชั้นนำอื่นๆ (บำรุงราษฎร์, เมดพาร์ค)",
        label_en: "Yes - Other premium hospitals (Bumrungrad, MedPark)",
        score: { all_hos: 1, platinum: 3, bdms: 1 }
      },
      {
        value: "flexible",
        label_th: "ไม่จำกัด - อยากเลือกได้ทุกโรงพยาบาล",
        label_en: "No preference - Want flexibility",
        score: { all_hos: 3, platinum: 2, bdms: 1 }
      }
    ],
    required: true,
    next_question: "easy_q4"
  },
  {
    id: "easy_q4",
    question: "คุณต้องการความคุ้มครอง OPD (ผู้ป่วยนอก) ด้วยหรือไม่?",
    question_en: "Do you need OPD (outpatient) coverage?",
    type: "single_choice",
    options: [
      {
        value: "opd_yes",
        label_th: "ต้องการ - ใช้บริการพบแพทย์บ่อย",
        label_en: "Yes - I visit doctors frequently",
        score: { all_hos: 1, platinum: 3, bdms: 3 }
      },
      {
        value: "opd_maybe",
        label_th: "อาจจะ - ไม่แน่ใจ",
        label_en: "Maybe - Not sure",
        score: { all_hos: 2, platinum: 2, bdms: 2 }
      },
      {
        value: "opd_no",
        label_th: "ไม่จำเป็น - เน้น IPD อย่างเดียว",
        label_en: "No - Focus on IPD only",
        score: { all_hos: 3, platinum: 1, bdms: 1 }
      }
    ],
    required: true,
    next_question: "easy_q5"
  },
  {
    id: "easy_q5",
    question: "อายุของคุณอยู่ในช่วงใด?",
    question_en: "What is your age range?",
    type: "single_choice",
    options: [
      {
        value: "age_young",
        label_th: "18-35 ปี",
        label_en: "18-35 years",
        score: { all_hos: 2, platinum: 2, bdms: 2 }
      },
      {
        value: "age_mid",
        label_th: "36-50 ปี",
        label_en: "36-50 years",
        score: { all_hos: 2, platinum: 2, bdms: 2 }
      },
      {
        value: "age_senior",
        label_th: "51-65 ปี",
        label_en: "51-65 years",
        score: { all_hos: 2, platinum: 2, bdms: 2 }
      },
      {
        value: "age_elder",
        label_th: "มากกว่า 65 ปี",
        label_en: "Over 65 years",
        score: { all_hos: 3, platinum: 1, bdms: 1 }
      }
    ],
    required: true,
    next_question: "result"
  }
];

export const healthInsuranceLongHook: WizardQuestion[] = [
  {
    id: "long_q1",
    section: "personal_info",
    question: "อายุของคุณ?",
    question_en: "What is your age?",
    type: "slider",
    config: {
      min: 18,
      max: 80,
      step: 1,
      default: 35,
      unit: "ปี / years"
    },
    required: true,
    next_question: "long_q2"
  },
  {
    id: "long_q2",
    section: "personal_info",
    question: "คุณต้องการทำประกันให้ใครบ้าง?",
    question_en: "Who do you want to insure?",
    type: "multiple_choice",
    options: [
      { value: "self", label_th: "ตัวเอง", label_en: "Myself", score: { base: 1 } },
      { value: "spouse", label_th: "คู่สมรส", label_en: "Spouse", score: { family_plan: 2 } },
      { value: "children", label_th: "บุตร", label_en: "Children", score: { family_plan: 2, platinum: 1 } },
      { value: "parents", label_th: "บิดา/มารดา", label_en: "Parents", score: { all_hos: 2, platinum: 1 } }
    ],
    required: true,
    next_question: "long_q3"
  },
  {
    id: "long_q3",
    section: "personal_info",
    question: "อาชีพของคุณ?",
    question_en: "What is your occupation?",
    type: "single_choice",
    options: [
      { value: "employee", label_th: "พนักงานบริษัท", label_en: "Company Employee", score: { all_hos: 2, platinum: 2, bdms: 2 } },
      { value: "executive", label_th: "ผู้บริหาร", label_en: "Executive", score: { all_hos: 1, platinum: 2, bdms: 3 } },
      { value: "business_owner", label_th: "เจ้าของธุรกิจ", label_en: "Business Owner", score: { all_hos: 1, platinum: 3, bdms: 3 } },
      { value: "freelance", label_th: "ฟรีแลนซ์ / อาชีพอิสระ", label_en: "Freelance / Self-employed", score: { all_hos: 3, platinum: 2, bdms: 1 } },
      { value: "government", label_th: "ข้าราชการ / รัฐวิสาหกิจ", label_en: "Government Officer", score: { all_hos: 3, platinum: 1, bdms: 1 } },
      { value: "retired", label_th: "เกษียณแล้ว", label_en: "Retired", score: { all_hos: 2, platinum: 2, bdms: 2 } }
    ],
    required: true,
    next_question: "long_q4"
  },
  {
    id: "long_q4",
    section: "health_status",
    question: "ปัจจุบันคุณมีโรคประจำตัวหรือไม่?",
    question_en: "Do you have any pre-existing conditions?",
    type: "multiple_choice",
    options: [
      { value: "none", label_th: "ไม่มีโรคประจำตัว", label_en: "No pre-existing conditions", score: { all_hos: 2, platinum: 2, bdms: 2 }, exclusive: true },
      { value: "diabetes", label_th: "เบาหวาน", label_en: "Diabetes", score: { platinum: 2, bdms: 2 } },
      { value: "hypertension", label_th: "ความดันโลหิตสูง", label_en: "Hypertension", score: { platinum: 2, bdms: 2 } },
      { value: "heart_disease", label_th: "โรคหัวใจ", label_en: "Heart Disease", score: { platinum: 3, bdms: 3 } },
      { value: "cancer_history", label_th: "ประวัติโรคมะเร็ง", label_en: "Cancer History", score: { platinum: 3, bdms: 3 } }
    ],
    required: true,
    next_question: "long_q5"
  },
  {
    id: "long_q5",
    section: "health_status",
    question: "ปีที่ผ่านมา คุณใช้บริการโรงพยาบาลบ่อยแค่ไหน?",
    question_en: "How often did you visit hospitals in the past year?",
    type: "single_choice",
    options: [
      { value: "rarely", label_th: "แทบไม่ได้ใช้ (0-1 ครั้ง)", label_en: "Rarely (0-1 times)", score: { all_hos: 3, platinum: 1, bdms: 1 } },
      { value: "sometimes", label_th: "บางครั้ง (2-4 ครั้ง)", label_en: "Sometimes (2-4 times)", score: { all_hos: 2, platinum: 2, bdms: 2 } },
      { value: "regular", label_th: "สม่ำเสมอ (5-10 ครั้ง)", label_en: "Regular (5-10 times)", score: { all_hos: 1, platinum: 3, bdms: 2 } },
      { value: "frequent", label_th: "บ่อยมาก (มากกว่า 10 ครั้ง)", label_en: "Frequent (more than 10 times)", score: { all_hos: 0, platinum: 3, bdms: 3 } }
    ],
    required: true,
    next_question: "long_q6"
  },
  {
    id: "long_q6",
    section: "health_status",
    question: "ปัจจุบันคุณมีประกันสุขภาพอยู่แล้วหรือไม่?",
    question_en: "Do you currently have health insurance?",
    type: "single_choice",
    options: [
      { value: "no_insurance", label_th: "ไม่มี", label_en: "No insurance", score: { urgency: 3 } },
      { value: "company_only", label_th: "มีเฉพาะประกันกลุ่มจากบริษัท", label_en: "Company group insurance only", score: { urgency: 2, platinum: 2, bdms: 2 } },
      { value: "basic_personal", label_th: "มีประกันส่วนตัว วงเงินไม่สูง", label_en: "Basic personal insurance", score: { upgrade_need: 2, platinum: 2, bdms: 2 } },
      { value: "comprehensive", label_th: "มีประกันครอบคลุมแล้ว ต้องการเปรียบเทียบ", label_en: "Have comprehensive, want to compare", score: { platinum: 2, bdms: 3 } }
    ],
    required: true,
    next_question: "long_q7"
  },
  {
    id: "long_q7",
    section: "coverage_needs",
    question: "ความคุ้มครองใดที่สำคัญที่สุดสำหรับคุณ? (เลือกได้หลายข้อ)",
    question_en: "Which coverages are most important to you? (Select multiple)",
    type: "multiple_choice",
    options: [
      { value: "ipd", label_th: "IPD ผู้ป่วยใน - ค่าห้อง ค่าผ่าตัด", label_en: "IPD - Room, Surgery", score: { all_hos: 2, platinum: 2, bdms: 2 } },
      { value: "opd", label_th: "OPD ผู้ป่วยนอก - พบแพทย์ทั่วไป", label_en: "OPD - General consultation", score: { all_hos: 1, platinum: 3, bdms: 3 } },
      { value: "dental", label_th: "ทันตกรรม", label_en: "Dental", score: { platinum: 2, bdms: 2 } },
      { value: "maternity", label_th: "คลอดบุตร", label_en: "Maternity", score: { platinum: 3, bdms: 3 } },
      { value: "vaccine", label_th: "วัคซีน", label_en: "Vaccines", score: { platinum: 3, bdms: 2 } },
      { value: "checkup", label_th: "ตรวจสุขภาพประจำปี", label_en: "Annual checkup", score: { platinum: 3, bdms: 3 } }
    ],
    required: true,
    next_question: "long_q8"
  },
  {
    id: "long_q8",
    section: "coverage_needs",
    question: "วงเงินความคุ้มครองต่อปีที่คุณต้องการ?",
    question_en: "What annual coverage limit do you need?",
    type: "single_choice",
    options: [
      { value: "5m", label_th: "5 ล้านบาท - เพียงพอสำหรับการรักษาทั่วไป", label_en: "5M THB - Sufficient for general treatment", score: { all_hos: 3, platinum: 0, bdms: 0 } },
      { value: "10m", label_th: "10 ล้านบาท - ครอบคลุมโรคร้ายแรง", label_en: "10M THB - Covers critical illness", score: { all_hos: 3, platinum: 1, bdms: 0 } },
      { value: "30m", label_th: "30 ล้านบาท - ความมั่นใจระดับสูง", label_en: "30M THB - High confidence level", score: { all_hos: 2, platinum: 2, bdms: 1 } },
      { value: "60m", label_th: "60 ล้านบาท - ความคุ้มครองระดับพรีเมียม", label_en: "60M THB - Premium coverage", score: { all_hos: 0, platinum: 2, bdms: 3 } },
      { value: "80m_plus", label_th: "80-100 ล้านบาท - ความคุ้มครองสูงสุด", label_en: "80-100M THB - Maximum coverage", score: { all_hos: 0, platinum: 3, bdms: 2 } }
    ],
    required: true,
    next_question: "long_q9"
  },
  {
    id: "long_q9",
    section: "preferences",
    question: "คุณชอบใช้บริการโรงพยาบาลประเภทใด?",
    question_en: "Which type of hospital do you prefer?",
    type: "single_choice",
    options: [
      { value: "bdms_exclusive", label_th: "เครือ BDMS เท่านั้น (กรุงเทพ, สมิติเวช, BNH, พญาไท)", label_en: "BDMS network only", score: { all_hos: 0, platinum: 1, bdms: 3 } },
      { value: "premium_any", label_th: "โรงพยาบาลเอกชนชั้นนำทุกแห่ง", label_en: "Any premium private hospital", score: { all_hos: 1, platinum: 3, bdms: 2 } },
      { value: "flexible", label_th: "ยืดหยุ่น - รพ.เอกชนและรัฐ", label_en: "Flexible - Private and Public", score: { all_hos: 3, platinum: 2, bdms: 1 } },
      { value: "international", label_th: "ต้องการใช้ได้ทั้งในและต่างประเทศ", label_en: "Need coverage in Thailand and abroad", score: { all_hos: 0, platinum: 3, bdms: 2 } }
    ],
    required: true,
    next_question: "long_q10"
  },
  {
    id: "long_q10",
    section: "preferences",
    question: "งบประมาณค่าเบี้ยประกันต่อปีของคุณ?",
    question_en: "What is your annual premium budget?",
    type: "slider",
    config: {
      min: 20000,
      max: 500000,
      step: 10000,
      default: 80000,
      unit: "บาท/ปี (THB/year)"
    },
    required: true,
    next_question: "result"
  }
];

export const healthInsuranceProducts = {
  platinum: {
    id: "platinum",
    name_th: "First Class All Hospital 80/100 MB",
    name_en: "First Class All Hospital 80/100 MB",
    brochure_path: "/brochures/health/first-class-all-hospital.pdf",
    coverage_limit: "80-100M THB/year",
    key_features_th: ["IPD สูงสุด 80-100 ล้านบาท/ปี", "OPD ครอบคลุม", "วัคซีน", "ตรวจสุขภาพประจำปี", "ทันตกรรม"],
    key_features_en: ["IPD up to 80-100M THB/year", "Comprehensive OPD", "Vaccines", "Annual checkup", "Dental"],
    ideal_for_th: ["ต้องการความคุ้มครองสูงสุด", "ใช้บริการโรงพยาบาลบ่อย", "ครอบครัว"],
    ideal_for_en: ["High coverage seekers", "Frequent hospital users", "Families"],
    premium_base: 60000
  },
  all_hos: {
    id: "all_hos",
    name_th: "Double Care All Hospital (8-30 MB)",
    name_en: "Double Care All Hospital (8-30 MB)",
    brochure_path: "/brochures/health/double-care-all-hospital.pdf",
    coverage_limit: "8-30M THB/year",
    key_features_th: ["เลือกโรงพยาบาลได้ทุกแห่ง", "IPD ครอบคลุม", "เบี้ยประหยัด", "ยืดหยุ่นสูง"],
    key_features_en: ["Flexible hospital choice", "IPD focused", "Cost-effective", "High flexibility"],
    ideal_for_th: ["คนรักความคุ้มค่า", "ต้องการความยืดหยุ่น", "งบประมาณจำกัด"],
    ideal_for_en: ["Budget conscious", "Flexibility seekers", "Limited budget"],
    premium_base: 35000
  },
  bdms: {
    id: "bdms",
    name_th: "First Class BDMS 60/120 MB",
    name_en: "First Class BDMS 60/120 MB",
    brochure_path: "/brochures/health/first-class-bdms.pdf",
    coverage_limit: "60-120M THB/year",
    key_features_th: ["โรงพยาบาลเครือ BDMS", "วงเงิน 60-120 ล้านบาท/ปี", "OPD รวม", "บริการ VIP"],
    key_features_en: ["BDMS network exclusive", "60-120M THB/year", "OPD included", "VIP benefits"],
    ideal_for_th: ["ใช้บริการ BDMS เป็นประจำ", "ต้องการบริการระดับพรีเมียม", "ผู้บริหาร"],
    ideal_for_en: ["BDMS hospital loyalists", "Premium service seekers", "Executives"],
    premium_base: 70000
  }
};
