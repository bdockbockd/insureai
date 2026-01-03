"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSearchParams } from "next/navigation";

type Language = "en" | "th";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.findPlan": "Find Plan",
    "nav.analyze": "Analyze Your Plan",
    "nav.compareTypes": "Compare Types",
    "nav.aiAssist": "AI Assist",
    "nav.blog": "Blog",
    "nav.getFreeQuote": "Get Free Quote",

    // Common
    "common.getStarted": "Get Started",
    "common.learnMore": "Learn More",
    "common.subscribe": "Subscribe",
    "common.loadMore": "Load More",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.next": "Next",
    "common.back": "Back",
    "common.continue": "Continue",
    "common.seeMyPlans": "See My Plans",
    "common.findMyPlan": "Find My Plan",
    "common.compareMyCurrentPlan": "Compare My Current Plan",
    "common.customersProtected": "Customers Protected",
    "common.rating": "Rating",
    "common.support": "Support",
    "common.getFreeQuoteNow": "Get Free Quote Now",
    "common.step": "Step",
    "common.complete": "Complete",
    "common.tellUsReach": "Tell us how to reach you",

    // Hero
    "hero.badge": "AI-Powered Insurance Comparison",
    "hero.title1": "Find Your Perfect",
    "hero.title2": "Insurance Plan",
    "hero.title3": "in 60 Seconds",
    "hero.subtitle": "AI-powered recommendations for you, your family, and loved ones. Compare your existing plan and discover better protection.",
    "hero.health": "Health",
    "hero.life": "Life",
    "hero.family": "Family",

    // Wizard - Step 0: Insurance Types
    "wizard.step0.title": "What type of insurance are you looking for?",
    "wizard.step0.subtitle": "Select the coverage that matters most to you",
    "wizard.insurance.health": "Health",
    "wizard.insurance.health.desc": "Medical expenses, hospital stays",
    "wizard.insurance.life": "Life",
    "wizard.insurance.life.desc": "Protect your loved ones",
    "wizard.insurance.criticalIllness": "Critical Illness",
    "wizard.insurance.criticalIllness.desc": "Cancer, heart disease, stroke",
    "wizard.insurance.motor": "Motor",
    "wizard.insurance.motor.desc": "Car and motorcycle",
    "wizard.insurance.travel": "Travel",
    "wizard.insurance.travel.desc": "Trip protection",
    "wizard.insurance.home": "Home",
    "wizard.insurance.home.desc": "Property protection",

    // Wizard - Step 1: Insurance For
    "wizard.step1.title": "Who is this insurance for?",
    "wizard.step1.subtitle": "Tell us who you want to protect",
    "wizard.for.myself": "Myself",
    "wizard.for.spouse": "My Spouse/Partner",
    "wizard.for.child": "My Child",
    "wizard.for.parent": "My Parent",
    "wizard.for.friend": "A Friend",

    // Wizard - Step 2: Personal Details
    "wizard.step2.titleSelf": "Tell us about yourself",
    "wizard.step2.titleOther": "Tell us about them",
    "wizard.step2.subtitle": "This helps us find the right plan",
    "wizard.age": "Age",
    "wizard.agePlaceholder": "Enter age (1-100)",
    "wizard.gender": "Gender",
    "wizard.gender.male": "Male",
    "wizard.gender.female": "Female",
    "wizard.gender.other": "Other",

    // Wizard - Step 3: Occupation
    "wizard.step3.titleSelf": "What is your occupation?",
    "wizard.step3.titleOther": "What is their occupation?",
    "wizard.step3.subtitle": "This affects plan eligibility and pricing",
    "wizard.occupation.officeWorker": "Office Worker",
    "wizard.occupation.businessOwner": "Business Owner",
    "wizard.occupation.healthcarePro": "Healthcare Professional",
    "wizard.occupation.engineer": "Engineer",
    "wizard.occupation.teacher": "Teacher/Educator",
    "wizard.occupation.selfEmployed": "Self-Employed",
    "wizard.occupation.freelancer": "Freelancer",
    "wizard.occupation.student": "Student",
    "wizard.occupation.retired": "Retired",
    "wizard.occupation.other": "Other",

    // Wizard - Step 4: Smoker
    "wizard.step4.titleSelf": "Do you smoke?",
    "wizard.step4.titleOther": "Do they smoke?",
    "wizard.step4.subtitle": "Including e-cigarettes or vaping",
    "wizard.smoker.yes": "I smoke or vape",
    "wizard.smoker.yesOther": "They smoke or vape",
    "wizard.smoker.no": "Non-smoker",

    // Wizard - Step 5: Health Conditions
    "wizard.step5.title": "Any pre-existing health conditions?",
    "wizard.step5.subtitle": "Select all that apply",
    "wizard.condition.diabetes": "Diabetes",
    "wizard.condition.highBloodPressure": "High Blood Pressure",
    "wizard.condition.heartDisease": "Heart Disease",
    "wizard.condition.cancer": "Cancer (past or current)",
    "wizard.condition.asthma": "Asthma",
    "wizard.condition.obesity": "Obesity",
    "wizard.condition.none": "None of the above",

    // Wizard - Step 6: Budget
    "wizard.step6.title": "What's your monthly budget?",
    "wizard.step6.subtitle": "We'll find plans that fit your budget",
    "wizard.budget.minimum": "Minimum (THB)",
    "wizard.budget.maximum": "Maximum (THB)",
    "wizard.budget.basic": "Basic",
    "wizard.budget.standard": "Standard",
    "wizard.budget.premium": "Premium",
    "wizard.budget.currency": "THB/mo",

    // Wizard - Results
    "wizard.results.title": "We Found Your Perfect Plans!",
    "wizard.results.subtitle": "Based on your profile, here are our top recommendations",
    "wizard.results.recommended": "RECOMMENDED",
    "wizard.results.bestValue": "BEST VALUE",
    "wizard.results.getThisPlan": "Get This Plan",
    "wizard.results.adjustPreferences": "Adjust My Preferences",
    "wizard.results.speakToAdvisor": "Speak to an Advisor",
    "wizard.results.almostThere": "Almost there!",
    "wizard.results.sendQuote": "Tell us how to reach you and we'll send your personalized quote.",
    "wizard.results.perMonth": "/mo",

    // Compare page
    "compare.title": "Compare Your Current Plan",
    "compare.subtitle": "See how your existing insurance stacks up against our recommended plans.",
    "compare.fullSubtitle": "See how your existing insurance stacks up against our recommended plans. Find gaps in coverage and potential savings.",
    "compare.provider": "Insurance Provider",
    "compare.planName": "Plan Name",
    "compare.selectProvider": "Select your insurance provider",
    "compare.selectPlan": "Select your plan",
    "compare.selectProviderFirst": "Select provider first",
    "compare.customPlan": "Other (Enter manually)",
    "compare.enterPlanName": "Enter Your Plan Name",
    "compare.enterPlanNamePlaceholder": "Enter your plan name",
    "compare.monthlyPremium": "Monthly Premium (THB)",
    "compare.roomBoard": "Room & Board (per day)",
    "compare.outpatient": "Outpatient (per year)",
    "compare.analyzeMyPlan": "Analyze My Plan",
    "compare.uploadPdf": "Upload PDF",
    "compare.uploadDescription": "Or upload your policy document and our AI will extract the details",
    "compare.analyzing": "Analyzing Your Plan...",
    "compare.aiAnalyzing": "Our AI is comparing your coverage against 50+ insurance plans",
    "compare.yourCurrentPlan": "Your Current Plan Details",
    "compare.extractingDetails": "Extracting coverage details",
    "compare.comparingBenefits": "Comparing benefits",
    "compare.findingBestMatch": "Finding the best match",
    "compare.potentialSavings": "Potential Savings",
    "compare.categoriesBetter": "Categories Better",
    "compare.coverageGaps": "Coverage Gaps Found",
    "compare.detailedComparison": "Detailed Comparison",
    "compare.category": "Category",
    "compare.yourPlan": "Your Plan",
    "compare.winner": "Winner",
    "compare.notIncluded": "Not Included",
    "compare.included": "Included",
    "compare.yes": "Yes",
    "compare.no": "No",
    "compare.tie": "Tie",
    "compare.allianz": "Recommended",
    "compare.yours": "Yours",
    "compare.important": "Important",
    "compare.criticalIllness": "Critical Illness Coverage",
    "compare.dentalCoverage": "Dental Coverage",
    "compare.waitingPeriod": "Waiting Period",
    "compare.worldwideCoverage": "Worldwide Coverage",
    "compare.readyToUpgrade": "Ready to Upgrade Your Coverage?",
    "compare.upgradeDescription": "Upgrade to a better plan and get improved coverage at competitive prices. Our advisor will help you make the transition seamless.",
    "compare.getMyUpgrade": "Get My Upgrade",
    "compare.compareAnother": "Compare Another Plan",
    "compare.getYourUpgrade": "Get Your Upgrade",
    "compare.advisorContact": "Our advisor will contact you with next steps",

    // Blog
    "blog.title": "Insurance Insights Blog",
    "blog.subtitle": "Expert advice, industry news, and tips to help you make better insurance decisions.",
    "blog.loadMore": "Load More Articles",
    "blog.stayUpdated": "Stay Updated",
    "blog.newsletterText": "Get the latest insurance tips, news, and exclusive offers delivered to your inbox.",
    "blog.enterEmail": "Enter your email",
    "blog.featured": "Featured",
    "blog.minRead": "min read",
    "blog.all": "All",
    "blog.healthInsurance": "Health Insurance",
    "blog.lifeInsurance": "Life Insurance",
    "blog.news": "News",
    "blog.technology": "Technology",
    "blog.familyPlanning": "Family Planning",
    "blog.expatGuide": "Expat Guide",

    // CTA Section
    "cta.badge": "Start protecting your family today",
    "cta.title": "Ready to Find Your",
    "cta.titleLine2": "Perfect Insurance Plan?",
    "cta.getStarted": "Get Started - It's Free",
    "cta.requestCallback": "Request a Callback",
    "cta.joinFamilies": "Join 50,000+ families who found better protection with InsureAI",
    "cta.benefit1": "Free personalized recommendations",
    "cta.benefit2": "Compare 100+ insurance plans",
    "cta.benefit3": "Expert advisors available 24/7",
    "cta.benefit4": "No obligation to purchase",

    // Features Section
    "features.title": "Why Choose InsureAI?",
    "features.subtitle": "We combine cutting-edge AI technology with human expertise to find you the best protection.",
    "features.aiMatching": "AI-Powered Matching",
    "features.aiMatchingDesc": "Our intelligent algorithm analyzes your profile to find the perfect insurance match from 100+ plans.",
    "features.comparison": "Side-by-Side Comparison",
    "features.comparisonDesc": "Compare benefits, premiums, and coverage limits across multiple insurers in one view.",
    "features.results": "60-Second Results",
    "features.resultsDesc": "Get personalized insurance recommendations in under a minute. No lengthy forms or waiting.",
    "features.allianzBacked": "Trusted Partners",
    "features.allianzBackedDesc": "Partnered with leading insurers with decades of experience protecting families.",
    "features.easyClaims": "Easy Claims",
    "features.easyClaimsDesc": "Streamlined claims process with digital submission and real-time tracking.",
    "features.experts": "Expert Advisors",
    "features.expertsDesc": "Get help from licensed insurance advisors whenever you need it.",

    // How It Works Section
    "howItWorks.title": "How It Works",
    "howItWorks.subtitle": "From finding the right plan to getting covered - we make it simple.",
    "howItWorks.step1": "Tell Us About You",
    "howItWorks.step1Desc": "Answer a few simple questions about your needs, budget, and preferences.",
    "howItWorks.step2": "Get Smart Recommendations",
    "howItWorks.step2Desc": "Our AI analyzes 100+ plans to find the best matches for your profile.",
    "howItWorks.step3": "Compare & Choose",
    "howItWorks.step3Desc": "Review side-by-side comparisons and pick the plan that's right for you.",
    "howItWorks.step4": "Get Protected",
    "howItWorks.step4Desc": "Complete your application online and get covered within 24 hours.",

    // Trust Section
    "trust.title": "Trusted by 50,000+ Families",
    "trust.subtitle": "Protecting lives across Thailand, Southeast Asia, and beyond.",
    "trust.spRating": "S&P Rating",
    "trust.yearsExperience": "Years Experience",
    "trust.countries": "Countries",

    // Testimonials Section
    "testimonials.title": "Loved by Thousands of Families",
    "testimonials.subtitle": "See what our customers have to say about their experience with InsureAI.",

    // Footer
    "footer.products": "Products",
    "footer.healthInsurance": "Health Insurance",
    "footer.lifeInsurance": "Life Insurance",
    "footer.criticalIllness": "Critical Illness",
    "footer.motorInsurance": "Motor Insurance",
    "footer.travelInsurance": "Travel Insurance",
    "footer.company": "Company",
    "footer.aboutUs": "About Us",
    "footer.blog": "Blog",
    "footer.careers": "Careers",
    "footer.contact": "Contact",
    "footer.partnerWithUs": "Partner With Us",
    "footer.support": "Support",
    "footer.faq": "FAQ",
    "footer.claims": "Claims",
    "footer.policyPortal": "Policy Portal",
    "footer.findHospital": "Find a Hospital",
    "footer.contactUs": "Contact Us",
    "footer.hotline": "1378 (24/7)",
    "footer.brandDescription": "AI-powered insurance recommendations to help you find the perfect coverage.",
    "footer.allRightsReserved": "All rights reserved.",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsOfService": "Terms of Service",
    "footer.cookiePolicy": "Cookie Policy",
    "footer.legalDisclaimer": "InsureAI provides insurance comparison and recommendation services. Insurance products are underwritten by licensed insurance companies in Thailand.",

    // Lead Capture Form
    "form.yourName": "Your name",
    "form.contactMethod": "How would you like us to contact you?",
    "form.line": "LINE",
    "form.phone": "Phone",
    "form.email": "Email",
    "form.lineId": "LINE ID",
    "form.phoneNumber": "Phone number",
    "form.emailAddress": "Email address",
    "form.submitting": "Submitting...",
    "form.getMyFreeQuote": "Get My Free Quote",
    "form.thankYou": "Thank You!",
    "form.advisorContact": "Our insurance advisor will contact you within 24 hours.",
    "form.disclaimer": "By submitting, you agree to be contacted by our insurance advisors. Your information is secure and will never be shared.",
    "form.validation.name": "Please enter your name",
    "form.validation.email": "Invalid email",
    "form.validation.phone": "Invalid phone number",
    "form.validation.line": "Invalid LINE ID",
    "form.validation.contactMethod": "Please provide at least one contact method",
  },
  th: {
    // Navigation
    "nav.home": "หน้าแรก",
    "nav.findPlan": "ค้นหาแผน",
    "nav.analyze": "วิเคราะห์แผนของคุณ",
    "nav.compareTypes": "เปรียบเทียบประเภท",
    "nav.aiAssist": "ถาม AI",
    "nav.blog": "บทความ",
    "nav.getFreeQuote": "ขอใบเสนอราคา",

    // Common
    "common.getStarted": "เริ่มต้นใช้งาน",
    "common.learnMore": "เรียนรู้เพิ่มเติม",
    "common.subscribe": "สมัครรับข่าวสาร",
    "common.loadMore": "โหลดเพิ่มเติม",
    "common.submit": "ส่ง",
    "common.cancel": "ยกเลิก",
    "common.next": "ถัดไป",
    "common.back": "กลับ",
    "common.continue": "ดำเนินการต่อ",
    "common.seeMyPlans": "ดูแผนของฉัน",
    "common.poweredByAI": "ขับเคลื่อนโดย AI",
    "common.findMyPlan": "ค้นหาแผนของฉัน",
    "common.compareMyCurrentPlan": "เปรียบเทียบแผนปัจจุบัน",
    "common.customersProtected": "ลูกค้าได้รับการคุ้มครอง",
    "common.rating": "คะแนน",
    "common.support": "บริการ",
    "common.getFreeQuoteNow": "ขอใบเสนอราคาฟรี",
    "common.step": "ขั้นตอน",
    "common.complete": "เสร็จสิ้น",
    "common.tellUsReach": "บอกเราว่าจะติดต่อคุณได้อย่างไร",

    // Hero
    "hero.badge": "เปรียบเทียบประกันด้วย AI อัจฉริยะ",
    "hero.title1": "ค้นหาแผนประกัน",
    "hero.title2": "ที่สมบูรณ์แบบ",
    "hero.title3": "ใน 60 วินาที",
    "hero.subtitle": "คำแนะนำจาก AI สำหรับคุณ ครอบครัว และคนที่คุณรัก เปรียบเทียบแผนปัจจุบันและค้นพบการคุ้มครองที่ดีกว่า",
    "hero.health": "สุขภาพ",
    "hero.life": "ชีวิต",
    "hero.family": "ครอบครัว",

    // Wizard - Step 0: Insurance Types
    "wizard.step0.title": "คุณกำลังมองหาประกันประเภทใด?",
    "wizard.step0.subtitle": "เลือกความคุ้มครองที่สำคัญที่สุดสำหรับคุณ",
    "wizard.insurance.health": "สุขภาพ",
    "wizard.insurance.health.desc": "ค่ารักษาพยาบาล ค่าห้องพัก",
    "wizard.insurance.life": "ชีวิต",
    "wizard.insurance.life.desc": "คุ้มครองคนที่คุณรัก",
    "wizard.insurance.criticalIllness": "โรคร้ายแรง",
    "wizard.insurance.criticalIllness.desc": "มะเร็ง โรคหัวใจ โรคหลอดเลือดสมอง",
    "wizard.insurance.motor": "รถยนต์",
    "wizard.insurance.motor.desc": "รถยนต์และจักรยานยนต์",
    "wizard.insurance.travel": "การเดินทาง",
    "wizard.insurance.travel.desc": "คุ้มครองการเดินทาง",
    "wizard.insurance.home": "บ้าน",
    "wizard.insurance.home.desc": "คุ้มครองทรัพย์สิน",

    // Wizard - Step 1: Insurance For
    "wizard.step1.title": "ประกันนี้สำหรับใคร?",
    "wizard.step1.subtitle": "บอกเราว่าคุณต้องการคุ้มครองใคร",
    "wizard.for.myself": "ตัวเอง",
    "wizard.for.spouse": "คู่สมรส/คู่ครอง",
    "wizard.for.child": "ลูก",
    "wizard.for.parent": "พ่อแม่",
    "wizard.for.friend": "เพื่อน",

    // Wizard - Step 2: Personal Details
    "wizard.step2.titleSelf": "บอกเราเกี่ยวกับตัวคุณ",
    "wizard.step2.titleOther": "บอกเราเกี่ยวกับพวกเขา",
    "wizard.step2.subtitle": "ข้อมูลนี้ช่วยให้เราหาแผนที่เหมาะสม",
    "wizard.age": "อายุ",
    "wizard.agePlaceholder": "กรอกอายุ (1-100)",
    "wizard.gender": "เพศ",
    "wizard.gender.male": "ชาย",
    "wizard.gender.female": "หญิง",
    "wizard.gender.other": "อื่นๆ",

    // Wizard - Step 3: Occupation
    "wizard.step3.titleSelf": "อาชีพของคุณคืออะไร?",
    "wizard.step3.titleOther": "อาชีพของพวกเขาคืออะไร?",
    "wizard.step3.subtitle": "มีผลต่อคุณสมบัติและราคาแผน",
    "wizard.occupation.officeWorker": "พนักงานออฟฟิศ",
    "wizard.occupation.businessOwner": "เจ้าของธุรกิจ",
    "wizard.occupation.healthcarePro": "บุคลากรทางการแพทย์",
    "wizard.occupation.engineer": "วิศวกร",
    "wizard.occupation.teacher": "ครู/อาจารย์",
    "wizard.occupation.selfEmployed": "ประกอบอาชีพอิสระ",
    "wizard.occupation.freelancer": "ฟรีแลนซ์",
    "wizard.occupation.student": "นักศึกษา",
    "wizard.occupation.retired": "เกษียณ",
    "wizard.occupation.other": "อื่นๆ",

    // Wizard - Step 4: Smoker
    "wizard.step4.titleSelf": "คุณสูบบุหรี่หรือไม่?",
    "wizard.step4.titleOther": "พวกเขาสูบบุหรี่หรือไม่?",
    "wizard.step4.subtitle": "รวมถึงบุหรี่ไฟฟ้าหรือ vape",
    "wizard.smoker.yes": "ฉันสูบบุหรี่หรือ vape",
    "wizard.smoker.yesOther": "พวกเขาสูบบุหรี่หรือ vape",
    "wizard.smoker.no": "ไม่สูบบุหรี่",

    // Wizard - Step 5: Health Conditions
    "wizard.step5.title": "มีโรคประจำตัวหรือไม่?",
    "wizard.step5.subtitle": "เลือกทั้งหมดที่ตรง",
    "wizard.condition.diabetes": "เบาหวาน",
    "wizard.condition.highBloodPressure": "ความดันโลหิตสูง",
    "wizard.condition.heartDisease": "โรคหัวใจ",
    "wizard.condition.cancer": "มะเร็ง (อดีตหรือปัจจุบัน)",
    "wizard.condition.asthma": "หอบหืด",
    "wizard.condition.obesity": "โรคอ้วน",
    "wizard.condition.none": "ไม่มีข้างต้น",

    // Wizard - Step 6: Budget
    "wizard.step6.title": "งบประมาณรายเดือนของคุณ?",
    "wizard.step6.subtitle": "เราจะหาแผนที่เหมาะกับงบของคุณ",
    "wizard.budget.minimum": "ขั้นต่ำ (บาท)",
    "wizard.budget.maximum": "สูงสุด (บาท)",
    "wizard.budget.basic": "พื้นฐาน",
    "wizard.budget.standard": "มาตรฐาน",
    "wizard.budget.premium": "พรีเมียม",
    "wizard.budget.currency": "บาท/เดือน",

    // Wizard - Results
    "wizard.results.title": "เราพบแผนที่เหมาะสมสำหรับคุณ!",
    "wizard.results.subtitle": "จากโปรไฟล์ของคุณ นี่คือแผนที่แนะนำ",
    "wizard.results.recommended": "แนะนำ",
    "wizard.results.bestValue": "คุ้มค่าที่สุด",
    "wizard.results.getThisPlan": "เลือกแผนนี้",
    "wizard.results.adjustPreferences": "ปรับเงื่อนไข",
    "wizard.results.speakToAdvisor": "พูดคุยกับที่ปรึกษา",
    "wizard.results.almostThere": "เกือบเสร็จแล้ว!",
    "wizard.results.sendQuote": "บอกเราว่าจะติดต่อคุณได้อย่างไร เราจะส่งใบเสนอราคาให้",
    "wizard.results.perMonth": "/เดือน",

    // Compare page
    "compare.title": "เปรียบเทียบแผนปัจจุบันของคุณ",
    "compare.subtitle": "ดูว่าประกันที่คุณมีเทียบกับแผนที่แนะนำเป็นอย่างไร",
    "compare.fullSubtitle": "ดูว่าประกันที่คุณมีเทียบกับแผนที่แนะนำเป็นอย่างไร ค้นหาช่องว่างในความคุ้มครองและโอกาสประหยัด",
    "compare.provider": "บริษัทประกัน",
    "compare.planName": "ชื่อแผน",
    "compare.selectProvider": "เลือกบริษัทประกันของคุณ",
    "compare.selectPlan": "เลือกแผนของคุณ",
    "compare.selectProviderFirst": "กรุณาเลือกบริษัทประกันก่อน",
    "compare.customPlan": "อื่นๆ (กรอกเอง)",
    "compare.enterPlanName": "กรอกชื่อแผนของคุณ",
    "compare.enterPlanNamePlaceholder": "กรอกชื่อแผนของคุณ",
    "compare.monthlyPremium": "เบี้ยประกันรายเดือน (บาท)",
    "compare.roomBoard": "ค่าห้องและอาหาร (ต่อวัน)",
    "compare.outpatient": "ผู้ป่วยนอก (ต่อปี)",
    "compare.analyzeMyPlan": "วิเคราะห์แผนของฉัน",
    "compare.uploadPdf": "อัปโหลด PDF",
    "compare.uploadDescription": "หรืออัปโหลดเอกสารกรมธรรม์ของคุณ AI จะดึงข้อมูลให้อัตโนมัติ",
    "compare.analyzing": "กำลังวิเคราะห์แผนของคุณ...",
    "compare.aiAnalyzing": "AI ของเรากำลังเปรียบเทียบความคุ้มครองของคุณกับแผนประกันมากกว่า 50 แผน",
    "compare.yourCurrentPlan": "รายละเอียดแผนปัจจุบันของคุณ",
    "compare.extractingDetails": "กำลังดึงรายละเอียดความคุ้มครอง",
    "compare.comparingBenefits": "กำลังเปรียบเทียบผลประโยชน์",
    "compare.findingBestMatch": "กำลังค้นหาแผนที่ดีที่สุด",
    "compare.potentialSavings": "ประหยัดได้",
    "compare.categoriesBetter": "หมวดที่ดีกว่า",
    "compare.coverageGaps": "ช่องว่างความคุ้มครอง",
    "compare.detailedComparison": "เปรียบเทียบละเอียด",
    "compare.category": "หมวด",
    "compare.yourPlan": "แผนของคุณ",
    "compare.winner": "ผู้ชนะ",
    "compare.notIncluded": "ไม่รวม",
    "compare.included": "รวม",
    "compare.yes": "ใช่",
    "compare.no": "ไม่",
    "compare.tie": "เสมอ",
    "compare.allianz": "แผนแนะนำ",
    "compare.yours": "ของคุณ",
    "compare.important": "สำคัญ",
    "compare.criticalIllness": "ความคุ้มครองโรคร้ายแรง",
    "compare.dentalCoverage": "ความคุ้มครองทันตกรรม",
    "compare.waitingPeriod": "ระยะเวลารอคอย",
    "compare.worldwideCoverage": "ความคุ้มครองทั่วโลก",
    "compare.readyToUpgrade": "พร้อมอัปเกรดความคุ้มครองหรือยัง?",
    "compare.upgradeDescription": "อัปเกรดเป็นแผนที่ดีกว่า รับความคุ้มครองที่ดีขึ้นในราคาที่แข่งขันได้ ที่ปรึกษาของเราจะช่วยให้การเปลี่ยนแปลงเป็นไปอย่างราบรื่น",
    "compare.getMyUpgrade": "รับการอัปเกรด",
    "compare.compareAnother": "เปรียบเทียบแผนอื่น",
    "compare.getYourUpgrade": "รับการอัปเกรดของคุณ",
    "compare.advisorContact": "ที่ปรึกษาจะติดต่อคุณพร้อมขั้นตอนถัดไป",

    // Blog
    "blog.title": "บล็อกข้อมูลประกัน",
    "blog.subtitle": "คำแนะนำจากผู้เชี่ยวชาญ ข่าวอุตสาหกรรม และเคล็ดลับเพื่อช่วยให้คุณตัดสินใจเรื่องประกันได้ดีขึ้น",
    "blog.loadMore": "โหลดบทความเพิ่มเติม",
    "blog.stayUpdated": "ติดตามข่าวสาร",
    "blog.newsletterText": "รับเคล็ดลับประกัน ข่าวสาร และข้อเสนอพิเศษส่งตรงถึงอีเมลของคุณ",
    "blog.enterEmail": "กรอกอีเมลของคุณ",
    "blog.featured": "แนะนำ",
    "blog.minRead": "นาทีอ่าน",
    "blog.all": "ทั้งหมด",
    "blog.healthInsurance": "ประกันสุขภาพ",
    "blog.lifeInsurance": "ประกันชีวิต",
    "blog.news": "ข่าวสาร",
    "blog.technology": "เทคโนโลยี",
    "blog.familyPlanning": "การวางแผนครอบครัว",
    "blog.expatGuide": "คู่มือชาวต่างชาติ",

    // CTA Section
    "cta.badge": "เริ่มปกป้องครอบครัวของคุณวันนี้",
    "cta.title": "พร้อมที่จะค้นหา",
    "cta.titleLine2": "แผนประกันที่สมบูรณ์แบบ?",
    "cta.getStarted": "เริ่มต้นใช้งาน - ฟรี",
    "cta.requestCallback": "ขอให้โทรกลับ",
    "cta.joinFamilies": "เข้าร่วมกับครอบครัวกว่า 50,000 ครอบครัวที่พบการคุ้มครองที่ดีกว่ากับ InsureAI",
    "cta.benefit1": "คำแนะนำส่วนบุคคลฟรี",
    "cta.benefit2": "เปรียบเทียบแผนประกันกว่า 100 แผน",
    "cta.benefit3": "ที่ปรึกษาพร้อมให้บริการ 24/7",
    "cta.benefit4": "ไม่มีภาระผูกพันในการซื้อ",

    // Features Section
    "features.title": "ทำไมต้อง InsureAI?",
    "features.subtitle": "เรารวม AI ล้ำสมัยกับความเชี่ยวชาญเพื่อหาการคุ้มครองที่ดีที่สุดให้คุณ",
    "features.aiMatching": "AI จับคู่อัจฉริยะ",
    "features.aiMatchingDesc": "อัลกอริทึมอัจฉริยะวิเคราะห์โปรไฟล์เพื่อหาประกันที่เหมาะสมจากกว่า 100 แผน",
    "features.comparison": "เปรียบเทียบแบบเคียงข้าง",
    "features.comparisonDesc": "เปรียบเทียบผลประโยชน์ เบี้ย และวงเงินคุ้มครองจากหลายบริษัทในหน้าเดียว",
    "features.results": "ผลลัพธ์ใน 60 วินาที",
    "features.resultsDesc": "รับคำแนะนำประกันส่วนบุคคลภายในไม่ถึงนาที ไม่ต้องกรอกฟอร์มยาว",
    "features.allianzBacked": "พันธมิตรที่เชื่อถือได้",
    "features.allianzBackedDesc": "ร่วมมือกับบริษัทประกันชั้นนำที่มีประสบการณ์ยาวนานในการคุ้มครองครอบครัว",
    "features.easyClaims": "เคลมง่าย",
    "features.easyClaimsDesc": "กระบวนการเคลมที่คล่องตัว ยื่นออนไลน์และติดตามสถานะได้ทันที",
    "features.experts": "ที่ปรึกษาผู้เชี่ยวชาญ",
    "features.expertsDesc": "รับความช่วยเหลือจากที่ปรึกษาประกันที่มีใบอนุญาตเมื่อต้องการ",

    // How It Works Section
    "howItWorks.title": "วิธีการทำงาน",
    "howItWorks.subtitle": "ตั้งแต่หาแผนที่ใช่จนถึงได้รับความคุ้มครอง - เราทำให้ง่าย",
    "howItWorks.step1": "บอกเราเกี่ยวกับคุณ",
    "howItWorks.step1Desc": "ตอบคำถามง่ายๆ เกี่ยวกับความต้องการ งบประมาณ และความชอบของคุณ",
    "howItWorks.step2": "รับคำแนะนำอัจฉริยะ",
    "howItWorks.step2Desc": "AI ของเราวิเคราะห์กว่า 100 แผนเพื่อหาแผนที่เหมาะกับโปรไฟล์ของคุณ",
    "howItWorks.step3": "เปรียบเทียบ & เลือก",
    "howItWorks.step3Desc": "ดูการเปรียบเทียบแบบเคียงข้างและเลือกแผนที่เหมาะกับคุณ",
    "howItWorks.step4": "รับความคุ้มครอง",
    "howItWorks.step4Desc": "กรอกใบสมัครออนไลน์และได้รับความคุ้มครองภายใน 24 ชั่วโมง",

    // Trust Section
    "trust.title": "ได้รับความไว้วางใจจากกว่า 50,000 ครอบครัว",
    "trust.subtitle": "คุ้มครองชีวิตทั่วประเทศไทย เอเชียตะวันออกเฉียงใต้ และทั่วโลก",
    "trust.spRating": "S&P Rating",
    "trust.yearsExperience": "ปีประสบการณ์",
    "trust.countries": "ประเทศ",

    // Testimonials Section
    "testimonials.title": "เป็นที่รักของหลายพันครอบครัว",
    "testimonials.subtitle": "ดูความคิดเห็นของลูกค้าเกี่ยวกับประสบการณ์กับ InsureAI",

    // Footer
    "footer.products": "ผลิตภัณฑ์",
    "footer.healthInsurance": "ประกันสุขภาพ",
    "footer.lifeInsurance": "ประกันชีวิต",
    "footer.criticalIllness": "โรคร้ายแรง",
    "footer.motorInsurance": "ประกันรถยนต์",
    "footer.travelInsurance": "ประกันการเดินทาง",
    "footer.company": "บริษัท",
    "footer.aboutUs": "เกี่ยวกับเรา",
    "footer.blog": "บล็อก",
    "footer.careers": "ร่วมงานกับเรา",
    "footer.contact": "ติดต่อ",
    "footer.partnerWithUs": "เป็นพันธมิตรกับเรา",
    "footer.support": "สนับสนุน",
    "footer.faq": "คำถามที่พบบ่อย",
    "footer.claims": "เคลม",
    "footer.policyPortal": "พอร์ทัลกรมธรรม์",
    "footer.findHospital": "ค้นหาโรงพยาบาล",
    "footer.contactUs": "ติดต่อเรา",
    "footer.hotline": "1378 (24/7)",
    "footer.brandDescription": "คำแนะนำประกันจาก AI เพื่อช่วยคุณค้นหาความคุ้มครองที่สมบูรณ์แบบ",
    "footer.allRightsReserved": "สงวนลิขสิทธิ์",
    "footer.privacyPolicy": "นโยบายความเป็นส่วนตัว",
    "footer.termsOfService": "ข้อกำหนดการให้บริการ",
    "footer.cookiePolicy": "นโยบายคุกกี้",
    "footer.legalDisclaimer": "InsureAI ให้บริการเปรียบเทียบและแนะนำประกัน ผลิตภัณฑ์ประกันรับประกันโดยบริษัทประกันที่ได้รับใบอนุญาตในประเทศไทย",

    // Lead Capture Form
    "form.yourName": "ชื่อของคุณ",
    "form.contactMethod": "คุณต้องการให้เราติดต่อคุณอย่างไร?",
    "form.line": "LINE",
    "form.phone": "โทรศัพท์",
    "form.email": "อีเมล",
    "form.lineId": "LINE ID",
    "form.phoneNumber": "เบอร์โทรศัพท์",
    "form.emailAddress": "ที่อยู่อีเมล",
    "form.submitting": "กำลังส่ง...",
    "form.getMyFreeQuote": "รับใบเสนอราคาฟรี",
    "form.thankYou": "ขอบคุณ!",
    "form.advisorContact": "ที่ปรึกษาประกันของเราจะติดต่อคุณภายใน 24 ชั่วโมง",
    "form.disclaimer": "เมื่อส่งข้อมูล คุณยินยอมให้ที่ปรึกษาประกันติดต่อคุณ ข้อมูลของคุณปลอดภัยและจะไม่ถูกแชร์",
    "form.validation.name": "กรุณากรอกชื่อ",
    "form.validation.email": "อีเมลไม่ถูกต้อง",
    "form.validation.phone": "เบอร์โทรไม่ถูกต้อง",
    "form.validation.line": "LINE ID ไม่ถูกต้อง",
    "form.validation.contactMethod": "กรุณาระบุช่องทางติดต่ออย่างน้อย 1 ช่องทาง",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>("th"); // Default to Thai

  useEffect(() => {
    // Check URL parameter first - support both ?lang= and ?la= for compatibility
    const langParam = (searchParams.get("lang") || searchParams.get("la")) as Language;
    if (langParam && (langParam === "en" || langParam === "th")) {
      setLanguage(langParam);
      localStorage.setItem("insureai-lang", langParam);
      return;
    }

    // Check localStorage for saved preference
    const savedLang = localStorage.getItem("insureai-lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "th")) {
      setLanguage(savedLang);
    }
    // If no saved preference and no URL param, default is already "th"
  }, [searchParams]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("insureai-lang", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
