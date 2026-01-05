import { NextRequest, NextResponse } from "next/server";
import { insurancePlans } from "@/data/plans-config";

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// Extracted plan structure from PDF/text
interface ExtractedPlan {
  provider: string;
  planName: string;
  planType: "health" | "critical-illness" | "savings" | "life" | "unknown";
  annualPremium: number | null;
  roomAndBoard: {
    limit: number | null;
    isUnlimited: boolean;
  };
  opdCoverage: {
    covered: boolean;
    limit: number | null;
  };
  ipdCoverage: {
    covered: boolean;
    annualLimit: number | null;
  };
  criticalIllness: {
    covered: boolean;
    conditions: string[];
    sumInsured: number | null;
  };
  waitingPeriod: number | null; // days
  coPayment: number | null; // percentage
  deductible: number | null;
  keyBenefits: string[];
  limitations: string[];
  rawText?: string;
}

// Comparison result structure
interface ComparisonResult {
  extractedPlan: ExtractedPlan;
  recommendedPlans: {
    planId: string;
    planName: string;
    matchScore: number;
    advantages: string[];
    disadvantages: string[];
  }[];
  comparisonTable: {
    category: string;
    yourPlan: string;
    recommended: string;
    winner: "yours" | "recommended" | "tie";
    importance: "high" | "medium" | "low";
  }[];
  savings: {
    percentage: number;
    annualAmount: number | null;
  };
  gaps: string[];
}

// Extract text from PDF using pdf-parse v2
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const { PDFParse } = await import("pdf-parse");
    // Convert Buffer to Uint8Array for pdf-parse
    const data = new Uint8Array(buffer);
    const parser = new PDFParse({ data });
    const textResult = await parser.getText();
    await parser.destroy();
    return textResult.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to parse PDF file");
  }
}

// Use Gemini to extract structured plan data from text
async function extractPlanWithGemini(text: string): Promise<ExtractedPlan> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  const prompt = `You are an expert Thai insurance policy analyzer. Analyze the following insurance policy document text and extract structured information.

IMPORTANT: The text may be in Thai or English. Extract all relevant information accurately.

Document Text:
---
${text.slice(0, 15000)}
---

Extract the following information and return as a valid JSON object:

{
  "provider": "Insurance company name (e.g., AIA, Bangkok Life, Muang Thai)",
  "planName": "Plan/Product name",
  "planType": "health" | "critical-illness" | "savings" | "life" | "unknown",
  "annualPremium": number or null,
  "roomAndBoard": {
    "limit": daily limit in THB or null,
    "isUnlimited": true/false
  },
  "opdCoverage": {
    "covered": true/false,
    "limit": annual/per-visit limit in THB or null
  },
  "ipdCoverage": {
    "covered": true/false,
    "annualLimit": annual limit in THB or null
  },
  "criticalIllness": {
    "covered": true/false,
    "conditions": ["list of covered conditions"],
    "sumInsured": coverage amount in THB or null
  },
  "waitingPeriod": days or null,
  "coPayment": percentage (0-100) or null,
  "deductible": amount in THB or null,
  "keyBenefits": ["list of key benefits in Thai or English"],
  "limitations": ["list of limitations/exclusions"]
}

Notes:
- For Thai currency, look for "บาท" or "THB"
- For room limits, look for "ค่าห้อง" or "room"
- For OPD, look for "ผู้ป่วยนอก" or "outpatient"
- For IPD, look for "ผู้ป่วยใน" or "inpatient"
- If a value cannot be determined, use null
- Return ONLY the JSON object, no other text`;

  try {
    const response = await fetch(
      `${GEMINI_BASE_URL}/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    // Clean up and parse
    jsonStr = jsonStr.trim();
    const extracted = JSON.parse(jsonStr);

    return {
      ...extracted,
      rawText: text.slice(0, 500), // Store preview of original text
    };
  } catch (error) {
    console.error("Gemini extraction error:", error);
    // Return a default structure if extraction fails
    return {
      provider: "Unknown",
      planName: "Unknown Plan",
      planType: "unknown",
      annualPremium: null,
      roomAndBoard: { limit: null, isUnlimited: false },
      opdCoverage: { covered: false, limit: null },
      ipdCoverage: { covered: true, annualLimit: null },
      criticalIllness: { covered: false, conditions: [], sumInsured: null },
      waitingPeriod: null,
      coPayment: null,
      deductible: null,
      keyBenefits: [],
      limitations: [],
      rawText: text.slice(0, 500),
    };
  }
}

// Compare extracted plan with our recommended plans
function compareWithOurPlans(extracted: ExtractedPlan): ComparisonResult {
  // Find best matching plans from our catalog
  const healthPlans = insurancePlans.filter(p => p.category === "health");

  // Score each plan based on how much better it is
  const scoredPlans = healthPlans.map(plan => {
    let score = 0;
    const advantages: string[] = [];
    const disadvantages: string[] = [];

    // Check room limit - our plans are typically unlimited
    if (!extracted.roomAndBoard.isUnlimited) {
      score += 20;
      advantages.push("ค่าห้องไม่จำกัด (Unlimited room)");
    }

    // Check OPD coverage
    if (!extracted.opdCoverage.covered) {
      score += 15;
      advantages.push("ครอบคลุม OPD (OPD covered)");
    }

    // Check annual limit
    if (extracted.ipdCoverage.annualLimit && extracted.ipdCoverage.annualLimit < 50000000) {
      score += 25;
      advantages.push("วงเงินสูงกว่า 80-100 ล้าน (Higher limit 80-100M)");
    }

    // Check critical illness
    if (!extracted.criticalIllness.covered) {
      score += 20;
      advantages.push("รวมโรคร้ายแรง (CI included)");
    }

    return {
      planId: plan.id,
      planName: plan.name_th,
      matchScore: Math.min(score, 100),
      advantages,
      disadvantages,
    };
  });

  // Sort by score
  scoredPlans.sort((a, b) => b.matchScore - a.matchScore);

  // Build comparison table
  type ComparisonRow = {
    category: string;
    yourPlan: string;
    recommended: string;
    winner: "yours" | "recommended" | "tie";
    importance: "high" | "medium" | "low";
  };

  const comparisonTable: ComparisonRow[] = [
    {
      category: "ค่าห้อง ICU/Room",
      yourPlan: extracted.roomAndBoard.isUnlimited
        ? "ไม่จำกัด"
        : extracted.roomAndBoard.limit
          ? `${extracted.roomAndBoard.limit.toLocaleString()} บาท/วัน`
          : "ไม่ระบุ",
      recommended: "ไม่จำกัด (เหมาจ่าย)",
      winner: extracted.roomAndBoard.isUnlimited ? "tie" : "recommended",
      importance: "high",
    },
    {
      category: "วงเงินต่อปี / Annual Limit",
      yourPlan: extracted.ipdCoverage.annualLimit
        ? `${(extracted.ipdCoverage.annualLimit / 1000000).toFixed(0)} ล้านบาท`
        : "ไม่ระบุ",
      recommended: "80-100 ล้านบาท",
      winner: (extracted.ipdCoverage.annualLimit && extracted.ipdCoverage.annualLimit >= 80000000)
        ? "tie" : "recommended",
      importance: "high",
    },
    {
      category: "ผู้ป่วยนอก (OPD)",
      yourPlan: extracted.opdCoverage.covered ? "คุ้มครอง" : "ไม่คุ้มครอง",
      recommended: "เหมาจ่าย",
      winner: extracted.opdCoverage.covered ? "tie" : "recommended",
      importance: "high",
    },
    {
      category: "โรคร้ายแรง / Critical Illness",
      yourPlan: extracted.criticalIllness.covered ? "คุ้มครอง" : "ไม่คุ้มครอง",
      recommended: "รวมในแผน",
      winner: extracted.criticalIllness.covered ? "tie" : "recommended",
      importance: "high",
    },
    {
      category: "ระยะรอคอย / Waiting Period",
      yourPlan: extracted.waitingPeriod ? `${extracted.waitingPeriod} วัน` : "30 วัน",
      recommended: "30 วัน",
      winner: "tie",
      importance: "medium",
    },
    {
      category: "Co-payment",
      yourPlan: extracted.coPayment ? `${extracted.coPayment}%` : "ไม่มี",
      recommended: "ไม่มี หรือ 10-30%",
      winner: "tie",
      importance: "medium",
    },
  ];

  // Calculate gaps
  const gaps: string[] = [];
  if (!extracted.roomAndBoard.isUnlimited) {
    gaps.push("ค่าห้องถูกล็อค อาจไม่พอสำหรับ รพ.ชั้นนำ");
  }
  if (!extracted.opdCoverage.covered) {
    gaps.push("ไม่ครอบคลุมการรักษาผู้ป่วยนอก");
  }
  if (!extracted.criticalIllness.covered) {
    gaps.push("ไม่ครอบคลุมโรคร้ายแรง มะเร็ง หัวใจ");
  }
  if (extracted.ipdCoverage.annualLimit && extracted.ipdCoverage.annualLimit < 20000000) {
    gaps.push("วงเงินต่อปีต่ำ อาจไม่พอสำหรับการรักษาพยาบาลระยะยาว");
  }

  // Calculate potential savings (estimate)
  const winsForRecommended = comparisonTable.filter(c => c.winner === "recommended").length;
  const savingsPercentage = Math.min(winsForRecommended * 5 + 5, 25); // 5-25%

  return {
    extractedPlan: extracted,
    recommendedPlans: scoredPlans.slice(0, 3),
    comparisonTable,
    savings: {
      percentage: savingsPercentage,
      annualAmount: extracted.annualPremium
        ? Math.round(extracted.annualPremium * savingsPercentage / 100)
        : null,
    },
    gaps,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const manualText = formData.get("text") as string | null;

    let textContent = "";

    if (file) {
      // Handle file upload
      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.type === "application/pdf") {
        textContent = await extractTextFromPDF(buffer);
      } else if (file.type.startsWith("image/")) {
        // For images, we could use Gemini's vision API in the future
        // For now, return an error
        return NextResponse.json(
          { error: "Image analysis not yet supported. Please upload a PDF or enter text manually." },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: "Unsupported file type. Please upload a PDF." },
          { status: 400 }
        );
      }
    } else if (manualText) {
      textContent = manualText;
    } else {
      return NextResponse.json(
        { error: "No file or text provided" },
        { status: 400 }
      );
    }

    if (textContent.length < 50) {
      return NextResponse.json(
        { error: "Not enough text content to analyze" },
        { status: 400 }
      );
    }

    // Extract structured data using Gemini
    const extractedPlan = await extractPlanWithGemini(textContent);

    // Compare with our plans
    const comparison = compareWithOurPlans(extractedPlan);

    return NextResponse.json({
      success: true,
      ...comparison,
    });

  } catch (error) {
    console.error("Compare analyze error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
