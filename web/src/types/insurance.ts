export type InsuranceType = "health" | "life" | "motor" | "travel" | "home" | "critical-illness";

export type InsuranceFor = "self" | "spouse" | "child" | "parent" | "friend";

export interface UserProfile {
  age: number;
  gender: "male" | "female" | "other";
  occupation: string;
  smoker: boolean;
  healthConditions: string[];
  insuranceFor: InsuranceFor;
  relationshipAge?: number;
  budget: {
    min: number;
    max: number;
  };
  existingPlans: ExistingPlan[];
}

export interface ExistingPlan {
  id: string;
  provider: string;
  planName: string;
  type: InsuranceType;
  premium: number;
  premiumFrequency: "monthly" | "quarterly" | "yearly";
  coverage: {
    [key: string]: number | string | boolean;
  };
  startDate: Date;
  endDate?: Date;
}

export interface InsurancePlan {
  id: string;
  name: string;
  type: InsuranceType;
  provider: string;
  providerLogo?: string;
  description: string;
  premium: {
    monthly: number;
    yearly: number;
  };
  coverage: Coverage;
  benefits: Benefit[];
  eligibility: Eligibility;
  highlights: string[];
  rating: number;
  reviewCount: number;
  isRecommended?: boolean;
  isBestValue?: boolean;
}

export interface Coverage {
  hospitalRoom: number;
  outpatient: number;
  dental?: number;
  vision?: number;
  lifeInsured?: number;
  criticalIllness?: number;
  accidentDeath?: number;
  permanentDisability?: number;
  deductible?: number;
  coPayment?: number;
  maxAnnualBenefit?: number;
  worldwideCoverage?: boolean;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
  value?: string;
}

export interface Eligibility {
  minAge: number;
  maxAge: number;
  preExistingConditions: boolean;
  waitingPeriod: number; // days
}

export interface Lead {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  lineId?: string;
  preferredContact: "email" | "phone" | "line";
  interestedPlans: string[];
  userProfile?: UserProfile;
  source: string;
  createdAt: Date;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
}

export interface ComparisonResult {
  category: string;
  yourPlan: string | number | boolean;
  allianzPlan: string | number | boolean;
  winner: "yours" | "allianz" | "tie";
  explanation: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  publishedAt: Date;
  readTime: number;
}
