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
    "nav.compare": "Compare",
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
    "common.poweredByAllianz": "Powered by Allianz",
    "common.findMyPlan": "Find My Plan",
    "common.compareMyCurrentPlan": "Compare My Current Plan",
    "common.customersProtected": "Customers Protected",
    "common.rating": "Rating",
    "common.support": "Support",
    "common.getFreeQuoteNow": "Get Free Quote Now",

    // Hero
    "hero.badge": "Powered by Allianz - World's #1 Insurer",
    "hero.title1": "Find Your Perfect",
    "hero.title2": "Insurance Plan",
    "hero.title3": "in 60 Seconds",
    "hero.subtitle": "AI-powered recommendations for you, your family, and loved ones. Compare your existing plan and discover better protection.",
    "hero.health": "Health",
    "hero.life": "Life",
    "hero.family": "Family",

    // Compare
    "compare.title": "Compare Your Current Plan",
    "compare.subtitle": "See how your existing insurance stacks up against Allianz plans.",
    "compare.provider": "Insurance Provider",
    "compare.planName": "Plan Name",
    "compare.selectProvider": "Select your insurance provider",
    "compare.selectPlan": "Select your plan",
    "compare.selectProviderFirst": "Select provider first",
    "compare.customPlan": "Other (Enter manually)",
    "compare.enterPlanName": "Enter Your Plan Name",
    "compare.monthlyPremium": "Monthly Premium (THB)",
    "compare.roomBoard": "Room & Board (per day)",
    "compare.outpatient": "Outpatient (per year)",
    "compare.analyzeMyPlan": "Analyze My Plan",
    "compare.uploadPdf": "Upload PDF",
    "compare.analyzing": "Analyzing Your Plan...",
    "compare.aiAnalyzing": "Our AI is comparing your coverage against 50+ Allianz plans",

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

    // CTA
    "cta.badge": "Start protecting your family today",
    "cta.title": "Ready to Find Your",
    "cta.titleLine2": "Perfect Insurance Plan?",
    "cta.getStarted": "Get Started - It's Free",
    "cta.requestCallback": "Request a Callback",
    "cta.joinFamilies": "Join 50,000+ families who found better protection with InsureAI",
  },
  th: {
    // Navigation
    "nav.home": "หน้าแรก",
    "nav.findPlan": "ค้นหาแผน",
    "nav.compare": "เปรียบเทียบ",
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
    "common.poweredByAllianz": "ขับเคลื่อนโดย Allianz",
    "common.findMyPlan": "ค้นหาแผนของฉัน",
    "common.compareMyCurrentPlan": "เปรียบเทียบแผนปัจจุบัน",
    "common.customersProtected": "ลูกค้าได้รับการคุ้มครอง",
    "common.rating": "คะแนน",
    "common.support": "บริการ",
    "common.getFreeQuoteNow": "ขอใบเสนอราคาฟรี",

    // Hero
    "hero.badge": "ขับเคลื่อนโดย Allianz - บริษัทประกันอันดับ 1 ของโลก",
    "hero.title1": "ค้นหาแผนประกัน",
    "hero.title2": "ที่สมบูรณ์แบบ",
    "hero.title3": "ใน 60 วินาที",
    "hero.subtitle": "คำแนะนำจาก AI สำหรับคุณ ครอบครัว และคนที่คุณรัก เปรียบเทียบแผนปัจจุบันและค้นพบการคุ้มครองที่ดีกว่า",
    "hero.health": "สุขภาพ",
    "hero.life": "ชีวิต",
    "hero.family": "ครอบครัว",

    // Compare
    "compare.title": "เปรียบเทียบแผนปัจจุบันของคุณ",
    "compare.subtitle": "ดูว่าประกันที่คุณมีเทียบกับแผน Allianz เป็นอย่างไร",
    "compare.provider": "บริษัทประกัน",
    "compare.planName": "ชื่อแผน",
    "compare.selectProvider": "เลือกบริษัทประกันของคุณ",
    "compare.selectPlan": "เลือกแผนของคุณ",
    "compare.selectProviderFirst": "กรุณาเลือกบริษัทประกันก่อน",
    "compare.customPlan": "อื่นๆ (กรอกเอง)",
    "compare.enterPlanName": "กรอกชื่อแผนของคุณ",
    "compare.monthlyPremium": "เบี้ยประกันรายเดือน (บาท)",
    "compare.roomBoard": "ค่าห้องและอาหาร (ต่อวัน)",
    "compare.outpatient": "ผู้ป่วยนอก (ต่อปี)",
    "compare.analyzeMyPlan": "วิเคราะห์แผนของฉัน",
    "compare.uploadPdf": "อัปโหลด PDF",
    "compare.analyzing": "กำลังวิเคราะห์แผนของคุณ...",
    "compare.aiAnalyzing": "AI ของเรากำลังเปรียบเทียบความคุ้มครองของคุณกับแผน Allianz มากกว่า 50 แผน",

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

    // CTA
    "cta.badge": "เริ่มปกป้องครอบครัวของคุณวันนี้",
    "cta.title": "พร้อมที่จะค้นหา",
    "cta.titleLine2": "แผนประกันที่สมบูรณ์แบบ?",
    "cta.getStarted": "เริ่มต้นใช้งาน - ฟรี",
    "cta.requestCallback": "ขอให้โทรกลับ",
    "cta.joinFamilies": "เข้าร่วมกับครอบครัวกว่า 50,000 ครอบครัวที่พบการคุ้มครองที่ดีกว่ากับ InsureAI",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>("th"); // Default to Thai

  useEffect(() => {
    // Check URL parameter first (?la=en or ?la=th)
    const langParam = searchParams.get("la") as Language;
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
