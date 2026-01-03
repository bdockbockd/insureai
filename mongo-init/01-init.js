// Initialize InsureAI database with sample data

db = db.getSiblingDB('insureai');

// Create collections
db.createCollection('leads');
db.createCollection('insurance_plans');
db.createCollection('blog_posts');

// Create indexes
db.leads.createIndex({ email: 1 });
db.leads.createIndex({ phone: 1 });
db.leads.createIndex({ lineId: 1 });
db.leads.createIndex({ createdAt: -1 });
db.leads.createIndex({ status: 1 });

db.insurance_plans.createIndex({ type: 1 });
db.insurance_plans.createIndex({ "premium.monthly": 1 });
db.insurance_plans.createIndex({ rating: -1 });

db.blog_posts.createIndex({ slug: 1 }, { unique: true });
db.blog_posts.createIndex({ publishedAt: -1 });
db.blog_posts.createIndex({ category: 1 });

// Insert sample insurance plans
db.insurance_plans.insertMany([
  {
    _id: ObjectId(),
    id: "health-essential",
    name: "Allianz Health Essential",
    type: "health",
    provider: "Allianz Ayudhya",
    description: "Basic health coverage for individuals and families",
    premium: { monthly: 1200, yearly: 12960 },
    coverage: {
      hospitalRoom: 3000,
      outpatient: 20000,
      dental: 5000,
      maxAnnualBenefit: 1000000,
      deductible: 0
    },
    benefits: [
      { title: "Room & Board", value: "3,000 THB/day", description: "Standard room coverage" },
      { title: "Outpatient", value: "20,000 THB/year", description: "Doctor visits and treatments" },
      { title: "Emergency Care", value: "Covered", description: "24/7 emergency room access" }
    ],
    eligibility: { minAge: 0, maxAge: 65, preExistingConditions: false, waitingPeriod: 30 },
    highlights: ["No waiting period for accidents", "Cashless at 500+ hospitals", "Free annual checkup"],
    rating: 4.3,
    reviewCount: 1250,
    active: true,
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    id: "health-plus",
    name: "Allianz Health Plus",
    type: "health",
    provider: "Allianz Ayudhya",
    description: "Enhanced health coverage with dental and OPD benefits",
    premium: { monthly: 2500, yearly: 27000 },
    coverage: {
      hospitalRoom: 5000,
      outpatient: 40000,
      dental: 15000,
      vision: 5000,
      maxAnnualBenefit: 3000000,
      deductible: 0
    },
    benefits: [
      { title: "Room & Board", value: "5,000 THB/day", description: "Private room coverage" },
      { title: "Outpatient", value: "40,000 THB/year", description: "Enhanced OPD coverage" },
      { title: "Dental", value: "15,000 THB/year", description: "Dental treatments included" },
      { title: "Vision", value: "5,000 THB/year", description: "Eye care and glasses" }
    ],
    eligibility: { minAge: 0, maxAge: 70, preExistingConditions: true, waitingPeriod: 30 },
    highlights: ["Dental & Vision included", "Higher OPD coverage", "Worldwide emergency coverage"],
    rating: 4.6,
    reviewCount: 2340,
    isRecommended: true,
    active: true,
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    id: "health-premium",
    name: "Allianz Health Premium",
    type: "health",
    provider: "Allianz Ayudhya",
    description: "Premium health coverage with worldwide benefits",
    premium: { monthly: 5500, yearly: 59400 },
    coverage: {
      hospitalRoom: 15000,
      outpatient: 100000,
      dental: 30000,
      vision: 15000,
      maxAnnualBenefit: 10000000,
      worldwideCoverage: true,
      deductible: 0
    },
    benefits: [
      { title: "Room & Board", value: "15,000 THB/day", description: "VIP room coverage" },
      { title: "Outpatient", value: "100,000 THB/year", description: "Unlimited OPD visits" },
      { title: "Worldwide", value: "Included", description: "Coverage in any country" },
      { title: "Executive Checkup", value: "Annual", description: "Comprehensive health screening" }
    ],
    eligibility: { minAge: 18, maxAge: 75, preExistingConditions: true, waitingPeriod: 0 },
    highlights: ["Worldwide coverage", "No waiting period", "VIP hospital access", "Telemedicine included"],
    rating: 4.8,
    reviewCount: 890,
    isBestValue: true,
    active: true,
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    id: "life-secure",
    name: "Allianz Life Secure",
    type: "life",
    provider: "Allianz Ayudhya",
    description: "Term life insurance for financial protection",
    premium: { monthly: 800, yearly: 8640 },
    coverage: {
      lifeInsured: 1000000,
      accidentDeath: 2000000,
      permanentDisability: 1000000
    },
    benefits: [
      { title: "Life Coverage", value: "1,000,000 THB", description: "Death benefit for beneficiaries" },
      { title: "Accident Death", value: "2,000,000 THB", description: "Double payout for accidents" },
      { title: "Disability", value: "1,000,000 THB", description: "Permanent disability coverage" }
    ],
    eligibility: { minAge: 18, maxAge: 60, preExistingConditions: false, waitingPeriod: 0 },
    highlights: ["Affordable premiums", "Quick approval", "Flexible beneficiary options"],
    rating: 4.4,
    reviewCount: 1567,
    active: true,
    createdAt: new Date()
  },
  {
    _id: ObjectId(),
    id: "critical-shield",
    name: "Allianz Critical Shield",
    type: "critical-illness",
    provider: "Allianz Ayudhya",
    description: "Protection against major critical illnesses",
    premium: { monthly: 1500, yearly: 16200 },
    coverage: { criticalIllness: 500000 },
    benefits: [
      { title: "Critical Illness", value: "500,000 THB", description: "Lump sum on diagnosis" },
      { title: "Covers 36 conditions", value: "Included", description: "Cancer, heart attack, stroke & more" },
      { title: "Early Stage Cancer", value: "150,000 THB", description: "Partial payout for early detection" }
    ],
    eligibility: { minAge: 18, maxAge: 55, preExistingConditions: false, waitingPeriod: 90 },
    highlights: ["Covers 36 critical conditions", "Lump sum payout", "Renewable until age 75"],
    rating: 4.5,
    reviewCount: 678,
    active: true,
    createdAt: new Date()
  }
]);

// Insert sample blog posts
db.blog_posts.insertMany([
  {
    _id: ObjectId(),
    slug: "health-insurance-guide-thailand-2026",
    title: "Complete Guide to Health Insurance in Thailand 2026",
    excerpt: "Everything you need to know about health insurance in Thailand - from government schemes to private coverage options.",
    content: "# Health Insurance in Thailand\n\nThailand offers various health insurance options...",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    category: "Health Insurance",
    tags: ["Thailand", "Health", "Guide"],
    author: { name: "Dr. Somchai Prasert", avatar: "SP" },
    publishedAt: new Date("2026-01-02"),
    readTime: 8,
    published: true,
    featured: true
  },
  {
    _id: ObjectId(),
    slug: "critical-illness-young-adults",
    title: "Why Young Adults Need Critical Illness Coverage",
    excerpt: "Think you're too young for critical illness insurance? Here's why millennials and Gen Z should consider it now.",
    content: "# Critical Illness Coverage\n\nMany young adults believe...",
    coverImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
    category: "Life Insurance",
    tags: ["Critical Illness", "Young Adults", "Prevention"],
    author: { name: "Nattaya Suthikul", avatar: "NS" },
    publishedAt: new Date("2025-12-20"),
    readTime: 6,
    published: true,
    featured: false
  }
]);

print('InsureAI database initialized successfully!');
