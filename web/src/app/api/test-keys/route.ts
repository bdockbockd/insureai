import { NextRequest } from "next/server";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// Models to test (aligned with ai-assist fallback chain + extras)
const MODELS = [
  "gemini-2.0-flash-lite",    // Cheapest/fastest 2.0
  "gemini-2.0-flash",         // Stable 2.0 baseline
  "gemini-2.5-flash-lite",    // Newer lite version
  "gemini-2.5-flash",         // Balanced 2.5
  "gemini-3-flash-preview",   // Newest preview
];

interface KeyTestResult {
  keyIndex: number;
  keyPrefix: string;
  status: "valid" | "invalid" | "rate_limited" | "error";
  models: {
    name: string;
    status: "ok" | "not_found" | "error";
    message?: string;
  }[];
}

// Test a single API key with minimal token usage
async function testKey(apiKey: string, keyIndex: number): Promise<KeyTestResult> {
  const keyPrefix = apiKey.slice(0, 15) + "...";
  const modelResults: KeyTestResult["models"] = [];

  for (const model of MODELS) {
    try {
      // Use generateContent with minimal tokens
      const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Hi" }] }],
          generationConfig: {
            maxOutputTokens: 5,  // Minimal tokens
          },
        }),
      });

      if (response.ok) {
        modelResults.push({ name: model, status: "ok" });
      } else {
        const error = await response.json().catch(() => ({}));
        const errorMsg = error?.error?.message || `Status ${response.status}`;

        if (response.status === 404) {
          modelResults.push({ name: model, status: "not_found", message: "Model not available" });
        } else if (response.status === 429 || errorMsg.toLowerCase().includes("quota")) {
          modelResults.push({ name: model, status: "error", message: "Rate limited" });
        } else {
          modelResults.push({ name: model, status: "error", message: errorMsg });
        }
      }
    } catch (err) {
      modelResults.push({
        name: model,
        status: "error",
        message: err instanceof Error ? err.message : "Unknown error"
      });
    }
  }

  // Determine overall key status
  const hasValidModel = modelResults.some(m => m.status === "ok");
  const allRateLimited = modelResults.every(m => m.message?.includes("Rate limited"));

  return {
    keyIndex,
    keyPrefix,
    status: hasValidModel ? "valid" : allRateLimited ? "rate_limited" : "invalid",
    models: modelResults,
  };
}

export async function GET(request: NextRequest) {
  // Collect all API keys
  const keys: string[] = [];

  if (process.env.GEMINI_API_KEY) {
    keys.push(process.env.GEMINI_API_KEY);
  }

  if (process.env.GEMINI_KEY_RESERVES) {
    const reserves = process.env.GEMINI_KEY_RESERVES.split(",")
      .map(k => k.trim())
      .filter(k => k.length > 0);
    keys.push(...reserves);
  }

  if (keys.length === 0) {
    return Response.json({
      error: "No API keys configured",
      hint: "Set GEMINI_API_KEY and optionally GEMINI_KEY_RESERVES in .env",
    }, { status: 400 });
  }

  // Test each key
  const results: KeyTestResult[] = [];

  for (let i = 0; i < keys.length; i++) {
    console.log(`Testing key ${i + 1}/${keys.length}...`);
    const result = await testKey(keys[i], i + 1);
    results.push(result);
  }

  // Summary
  const summary = {
    totalKeys: keys.length,
    validKeys: results.filter(r => r.status === "valid").length,
    rateLimitedKeys: results.filter(r => r.status === "rate_limited").length,
    invalidKeys: results.filter(r => r.status === "invalid").length,
  };

  return Response.json({
    summary,
    testedModels: MODELS,
    results,
    timestamp: new Date().toISOString(),
  });
}
