// Wizard Data Index
export * from './health-insurance';
export * from './critical-illness';
export * from './savings-pension';

export type InsuranceCategory = 'health' | 'critical-illness' | 'savings' | 'pension';

export interface WizardConfig {
  id: string;
  name_th: string;
  name_en: string;
  description_th: string;
  description_en: string;
  icon: string;
  color: string;
  estimated_time_easy: string;
  estimated_time_long: string;
  easy_questions_count: number;
  long_questions_count: number;
}

export const wizardConfigs: Record<InsuranceCategory, WizardConfig> = {
  health: {
    id: 'health',
    name_th: 'ประกันสุขภาพ',
    name_en: 'Health Insurance',
    description_th: 'ค้นหาแผนประกันสุขภาพที่เหมาะกับคุณ - Platinum, All Hos Platinum, BDMS First Class',
    description_en: 'Find the perfect health insurance plan - Platinum, All Hos Platinum, BDMS First Class',
    icon: 'Shield',
    color: 'from-blue-500 to-cyan-500',
    estimated_time_easy: '30-60 วินาที',
    estimated_time_long: '2-3 นาที',
    easy_questions_count: 5,
    long_questions_count: 10
  },
  'critical-illness': {
    id: 'critical-illness',
    name_th: 'ประกันโรคร้ายแรง',
    name_en: 'Critical Illness Insurance',
    description_th: 'ค้นหาแผนคุ้มครองโรคร้ายแรง - CI 48 Beyond, Multi Care',
    description_en: 'Find critical illness coverage - CI 48 Beyond, Multi Care',
    icon: 'Activity',
    color: 'from-purple-500 to-indigo-500',
    estimated_time_easy: '30-60 วินาที',
    estimated_time_long: '2-3 นาที',
    easy_questions_count: 4,
    long_questions_count: 10
  },
  savings: {
    id: 'savings',
    name_th: 'ประกันออมทรัพย์',
    name_en: 'Savings Insurance',
    description_th: 'สะสมความมั่งคั่งด้วย My Double Plus - คุ้มครอง 115% รับคืน 140%',
    description_en: 'Build wealth with My Double Plus - 115% coverage, 140% maturity',
    icon: 'PiggyBank',
    color: 'from-green-500 to-emerald-500',
    estimated_time_easy: '30-60 วินาที',
    estimated_time_long: '2-3 นาที',
    easy_questions_count: 5,
    long_questions_count: 12
  },
  pension: {
    id: 'pension',
    name_th: 'ประกันบำนาญ',
    name_en: 'Pension Insurance',
    description_th: 'วางแผนเกษียณด้วย Pension Plus 85A55 - รับเงินบำนาญถึงอายุ 85',
    description_en: 'Plan retirement with Pension Plus 85A55 - Annuity until age 85',
    icon: 'Landmark',
    color: 'from-amber-500 to-orange-500',
    estimated_time_easy: '30-60 วินาที',
    estimated_time_long: '2-3 นาที',
    easy_questions_count: 5,
    long_questions_count: 12
  }
};
