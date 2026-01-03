// Unified Insurance Plans Configuration
// Used for plan selection dropdown in AI Assist and Admin

export interface InsurancePlan {
  id: string;
  category: 'health' | 'critical-illness' | 'savings' | 'pension' | 'life';
  name_th: string;
  name_en: string;
  short_name_th: string;
  short_name_en: string;
  brochure_path: string;
  markdown_path: string;
  description_th: string;
  description_en: string;
  key_highlights: string[];
}

export interface PlanCategory {
  id: string;
  name_th: string;
  name_en: string;
  icon: string;
  color: string;
  plans: InsurancePlan[];
}

export const insurancePlans: InsurancePlan[] = [
  // Health Insurance Plans
  {
    id: 'platinum-80-100',
    category: 'health',
    name_th: 'First Class All Hospital 80/100 MB',
    name_en: 'First Class All Hospital 80/100 MB',
    short_name_th: 'Platinum 80/100',
    short_name_en: 'Platinum 80/100',
    brochure_path: '/brochures/health/first-class-all-hospital.pdf',
    markdown_path: '/data/markdown/health-insurance/platinum-80mb-100mb.md',
    description_th: 'วงเงินสูงสุด 80-100 ล้านบาท/ปี ครอบคลุม OPD วัคซีน ทันตกรรม',
    description_en: 'Up to 80-100M THB/year, includes OPD, vaccines, dental',
    key_highlights: ['80-100M THB/year', 'OPD included', 'Vaccines', 'Dental', 'Annual checkup']
  },
  {
    id: 'all-hos-platinum',
    category: 'health',
    name_th: 'Double Care All Hospital (8-30 MB)',
    name_en: 'Double Care All Hospital (8-30 MB)',
    short_name_th: 'All Hos 8-30',
    short_name_en: 'All Hos 8-30',
    brochure_path: '/brochures/health/double-care-all-hospital.pdf',
    markdown_path: '/data/markdown/health-insurance/all-hos-platinum.md',
    description_th: 'เลือกโรงพยาบาลได้ทุกแห่ง วงเงิน 8-30 ล้านบาท เบี้ยประหยัด',
    description_en: 'Flexible hospital choice, 8-30M THB, cost-effective',
    key_highlights: ['8-30M THB/year', 'All hospitals', 'IPD focused', 'Budget-friendly']
  },
  {
    id: 'bdms-first-class',
    category: 'health',
    name_th: 'First Class BDMS 60/120 MB',
    name_en: 'First Class BDMS 60/120 MB',
    short_name_th: 'BDMS 60/120',
    short_name_en: 'BDMS 60/120',
    brochure_path: '/brochures/health/first-class-bdms.pdf',
    markdown_path: '/data/markdown/health-insurance/bdms-first-class.md',
    description_th: 'โรงพยาบาลเครือ BDMS วงเงิน 60-120 ล้านบาท บริการ VIP',
    description_en: 'BDMS network exclusive, 60-120M THB, VIP benefits',
    key_highlights: ['60-120M THB/year', 'BDMS exclusive', 'OPD included', 'VIP service']
  },

  // Critical Illness Plans
  {
    id: 'ci-48-beyond',
    category: 'critical-illness',
    name_th: 'CI 48 Beyond',
    name_en: 'CI 48 Beyond',
    short_name_th: 'CI 48',
    short_name_en: 'CI 48',
    brochure_path: '/brochures/critical-illness/ci-48-beyond.pdf',
    markdown_path: '/data/markdown/critical-illness/ci-48-beyond.md',
    description_th: 'คุ้มครอง 75 โรค จ่ายสูงสุด 170% เบี้ยประหยัด',
    description_en: '75 diseases covered, up to 170% payout, lower premium',
    key_highlights: ['75 diseases', '170% max payout', 'Multiple claims', 'Affordable']
  },
  {
    id: 'multi-care',
    category: 'critical-illness',
    name_th: 'Multi Care',
    name_en: 'Multi Care',
    short_name_th: 'Multi Care',
    short_name_en: 'Multi Care',
    brochure_path: '/brochures/critical-illness/multi-care.pdf',
    markdown_path: '/data/markdown/critical-illness/multi-care.md',
    description_th: 'คุ้มครอง 81 โรค จ่ายสูงสุด 840% เคลมซ้ำได้',
    description_en: '81 diseases covered, up to 840% payout, re-claim feature',
    key_highlights: ['81 diseases', '840% max payout', 'Re-claim feature', 'Comprehensive']
  },

  // Savings Plans
  {
    id: 'my-double-plus',
    category: 'savings',
    name_th: 'My Double Plus',
    name_en: 'My Double Plus',
    short_name_th: 'Double Plus',
    short_name_en: 'Double Plus',
    brochure_path: '/brochures/savings-pension/my-double-plus.pdf',
    markdown_path: '/data/markdown/savings-investment/my-double-plus.md',
    description_th: 'ออมทรัพย์ คุ้มครอง 115% รับคืน 140% ลดหย่อนภาษี',
    description_en: 'Savings with 115% coverage, 140% maturity, tax deduction',
    key_highlights: ['115% coverage', '140% maturity', 'Tax deduction', 'Auto-rebalancing']
  },

  // Pension Plans
  {
    id: 'pension-plus-85a55',
    category: 'pension',
    name_th: 'Pension Plus 85A55',
    name_en: 'Pension Plus 85A55',
    short_name_th: 'Pension 85A55',
    short_name_en: 'Pension 85A55',
    brochure_path: '/brochures/savings-pension/pension-plus-85a55.pdf',
    markdown_path: '/data/markdown/pension-annuity/pension-plus-85a55.md',
    description_th: 'บำนาญรายปี อายุ 55-85 การันตี 10%/ปี ลดหย่อนภาษี 200,000',
    description_en: 'Annual pension age 55-85, guaranteed 10%/year, 200K tax deduction',
    key_highlights: ['Pension 55-85', '10% guaranteed', '200K tax deduction', 'Lifetime income']
  },

  // Life Insurance Plans
  {
    id: 'high-capital-life',
    category: 'life',
    name_th: 'แผนทุนชีวิตสูง',
    name_en: 'High Capital Life Plan',
    short_name_th: 'ทุนสูง',
    short_name_en: 'High Capital',
    brochure_path: '/brochures/life-insurance/high-capital-life.pdf',
    markdown_path: '/data/markdown/life-insurance/high-capital-life.md',
    description_th: 'ทุนประกันสูงถึง 50 ล้าน เบี้ยประหยัด คุ้มครองครอบครัว',
    description_en: 'Up to 50M coverage, cost-effective, family protection',
    key_highlights: ['Up to 50M', 'Low premium', 'Tax deduction', 'Maturity benefit']
  }
];

export const planCategories: PlanCategory[] = [
  {
    id: 'health',
    name_th: 'ประกันสุขภาพ',
    name_en: 'Health Insurance',
    icon: 'Shield',
    color: 'from-blue-500 to-cyan-500',
    plans: insurancePlans.filter(p => p.category === 'health')
  },
  {
    id: 'critical-illness',
    name_th: 'ประกันโรคร้ายแรง',
    name_en: 'Critical Illness',
    icon: 'Activity',
    color: 'from-purple-500 to-indigo-500',
    plans: insurancePlans.filter(p => p.category === 'critical-illness')
  },
  {
    id: 'savings',
    name_th: 'ประกันออมทรัพย์',
    name_en: 'Savings Insurance',
    icon: 'PiggyBank',
    color: 'from-green-500 to-emerald-500',
    plans: insurancePlans.filter(p => p.category === 'savings')
  },
  {
    id: 'pension',
    name_th: 'ประกันบำนาญ',
    name_en: 'Pension Insurance',
    icon: 'Landmark',
    color: 'from-amber-500 to-orange-500',
    plans: insurancePlans.filter(p => p.category === 'pension')
  },
  {
    id: 'life',
    name_th: 'ประกันชีวิต',
    name_en: 'Life Insurance',
    icon: 'Heart',
    color: 'from-red-500 to-pink-500',
    plans: insurancePlans.filter(p => p.category === 'life')
  }
];

export function getPlanById(id: string): InsurancePlan | undefined {
  return insurancePlans.find(p => p.id === id);
}

export function getPlansByCategory(category: string): InsurancePlan[] {
  return insurancePlans.filter(p => p.category === category);
}
