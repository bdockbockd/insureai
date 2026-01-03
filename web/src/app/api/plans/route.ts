import { NextRequest, NextResponse } from "next/server";

// Allianz Insurance Plans Data
// In production, this would come from a database or external API

const insurancePlans = [
  // Health Insurance Plans
  {
    id: "health-essential",
    name: "Allianz Health Essential",
    type: "health",
    provider: "Allianz Ayudhya",
    description: "Basic health coverage for individuals and families",
    premium: {
      monthly: 1200,
      yearly: 12960,
    },
    coverage: {
      hospitalRoom: 3000,
      outpatient: 20000,
      dental: 5000,
      maxAnnualBenefit: 1000000,
      deductible: 0,
    },
    benefits: [
      { title: "Room & Board", value: "3,000 THB/day", description: "Standard room coverage" },
      { title: "Outpatient", value: "20,000 THB/year", description: "Doctor visits and treatments" },
      { title: "Emergency Care", value: "Covered", description: "24/7 emergency room access" },
    ],
    eligibility: {
      minAge: 0,
      maxAge: 65,
      preExistingConditions: false,
      waitingPeriod: 30,
    },
    highlights: ["No waiting period for accidents", "Cashless at 500+ hospitals", "Free annual checkup"],
    rating: 4.3,
    reviewCount: 1250,
  },
  {
    id: "health-plus",
    name: "Allianz Health Plus",
    type: "health",
    provider: "Allianz Ayudhya",
    description: "Enhanced health coverage with dental and OPD benefits",
    premium: {
      monthly: 2500,
      yearly: 27000,
    },
    coverage: {
      hospitalRoom: 5000,
      outpatient: 40000,
      dental: 15000,
      vision: 5000,
      maxAnnualBenefit: 3000000,
      deductible: 0,
    },
    benefits: [
      { title: "Room & Board", value: "5,000 THB/day", description: "Private room coverage" },
      { title: "Outpatient", value: "40,000 THB/year", description: "Enhanced OPD coverage" },
      { title: "Dental", value: "15,000 THB/year", description: "Dental treatments included" },
      { title: "Vision", value: "5,000 THB/year", description: "Eye care and glasses" },
    ],
    eligibility: {
      minAge: 0,
      maxAge: 70,
      preExistingConditions: true,
      waitingPeriod: 30,
    },
    highlights: ["Dental & Vision included", "Higher OPD coverage", "Worldwide emergency coverage"],
    rating: 4.6,
    reviewCount: 2340,
    isRecommended: true,
  },
  {
    id: "health-premium",
    name: "Allianz Health Premium",
    type: "health",
    provider: "Allianz Ayudhya",
    description: "Premium health coverage with worldwide benefits",
    premium: {
      monthly: 5500,
      yearly: 59400,
    },
    coverage: {
      hospitalRoom: 15000,
      outpatient: 100000,
      dental: 30000,
      vision: 15000,
      maxAnnualBenefit: 10000000,
      worldwideCoverage: true,
      deductible: 0,
    },
    benefits: [
      { title: "Room & Board", value: "15,000 THB/day", description: "VIP room coverage" },
      { title: "Outpatient", value: "100,000 THB/year", description: "Unlimited OPD visits" },
      { title: "Worldwide", value: "Included", description: "Coverage in any country" },
      { title: "Executive Checkup", value: "Annual", description: "Comprehensive health screening" },
    ],
    eligibility: {
      minAge: 18,
      maxAge: 75,
      preExistingConditions: true,
      waitingPeriod: 0,
    },
    highlights: ["Worldwide coverage", "No waiting period", "VIP hospital access", "Telemedicine included"],
    rating: 4.8,
    reviewCount: 890,
    isBestValue: true,
  },

  // Life Insurance Plans
  {
    id: "life-secure",
    name: "Allianz Life Secure",
    type: "life",
    provider: "Allianz Ayudhya",
    description: "Term life insurance for financial protection",
    premium: {
      monthly: 800,
      yearly: 8640,
    },
    coverage: {
      lifeInsured: 1000000,
      accidentDeath: 2000000,
      permanentDisability: 1000000,
    },
    benefits: [
      { title: "Life Coverage", value: "1,000,000 THB", description: "Death benefit for beneficiaries" },
      { title: "Accident Death", value: "2,000,000 THB", description: "Double payout for accidents" },
      { title: "Disability", value: "1,000,000 THB", description: "Permanent disability coverage" },
    ],
    eligibility: {
      minAge: 18,
      maxAge: 60,
      preExistingConditions: false,
      waitingPeriod: 0,
    },
    highlights: ["Affordable premiums", "Quick approval", "Flexible beneficiary options"],
    rating: 4.4,
    reviewCount: 1567,
  },

  // Critical Illness Plans
  {
    id: "critical-shield",
    name: "Allianz Critical Shield",
    type: "critical-illness",
    provider: "Allianz Ayudhya",
    description: "Protection against major critical illnesses",
    premium: {
      monthly: 1500,
      yearly: 16200,
    },
    coverage: {
      criticalIllness: 500000,
    },
    benefits: [
      { title: "Critical Illness", value: "500,000 THB", description: "Lump sum on diagnosis" },
      { title: "Covers 36 conditions", value: "Included", description: "Cancer, heart attack, stroke & more" },
      { title: "Early Stage Cancer", value: "150,000 THB", description: "Partial payout for early detection" },
    ],
    eligibility: {
      minAge: 18,
      maxAge: 55,
      preExistingConditions: false,
      waitingPeriod: 90,
    },
    highlights: ["Covers 36 critical conditions", "Lump sum payout", "Renewable until age 75"],
    rating: 4.5,
    reviewCount: 678,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Filter parameters
  const type = searchParams.get("type");
  const minBudget = parseInt(searchParams.get("minBudget") || "0");
  const maxBudget = parseInt(searchParams.get("maxBudget") || "999999");
  const age = parseInt(searchParams.get("age") || "30");

  let filteredPlans = insurancePlans;

  // Filter by type
  if (type) {
    filteredPlans = filteredPlans.filter((plan) => plan.type === type);
  }

  // Filter by budget (monthly premium)
  filteredPlans = filteredPlans.filter(
    (plan) => plan.premium.monthly >= minBudget && plan.premium.monthly <= maxBudget
  );

  // Filter by age eligibility
  filteredPlans = filteredPlans.filter(
    (plan) => age >= plan.eligibility.minAge && age <= plan.eligibility.maxAge
  );

  // Sort by recommendation and rating
  filteredPlans.sort((a, b) => {
    if (a.isRecommended && !b.isRecommended) return -1;
    if (!a.isRecommended && b.isRecommended) return 1;
    return b.rating - a.rating;
  });

  return NextResponse.json({
    total: filteredPlans.length,
    plans: filteredPlans,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // AI-powered plan recommendation
    // In production, this would use Claude API for intelligent matching
    const { insuranceType, age, budget, healthConditions, smoker } = body;

    let recommendations = insurancePlans.filter((plan) => {
      if (insuranceType && plan.type !== insuranceType) return false;
      if (age && (age < plan.eligibility.minAge || age > plan.eligibility.maxAge)) return false;
      if (budget && plan.premium.monthly > budget.max) return false;
      return true;
    });

    // Score and rank plans
    recommendations = recommendations.map((plan) => ({
      ...plan,
      matchScore: calculateMatchScore(plan, body),
    }));

    recommendations.sort((a: any, b: any) => b.matchScore - a.matchScore);

    return NextResponse.json({
      recommendations: recommendations.slice(0, 3),
      totalMatches: recommendations.length,
    });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}

function calculateMatchScore(plan: typeof insurancePlans[0], userProfile: any): number {
  let score = 50; // Base score

  // Budget fit (higher score if plan is within budget)
  if (userProfile.budget) {
    const { min, max } = userProfile.budget;
    if (plan.premium.monthly >= min && plan.premium.monthly <= max) {
      score += 20;
    } else if (plan.premium.monthly < min) {
      score += 10; // Under budget is still good
    }
  }

  // Health conditions compatibility
  if (userProfile.healthConditions?.length > 0 && userProfile.healthConditions[0] !== "None of the above") {
    if (plan.eligibility.preExistingConditions) {
      score += 15;
    }
  }

  // Smoker penalty for certain plans
  if (userProfile.smoker && plan.type === "life") {
    score -= 10;
  }

  // Rating bonus
  score += plan.rating * 2;

  // Recommendation/best value bonus
  if (plan.isRecommended) score += 10;
  if (plan.isBestValue) score += 5;

  return score;
}
