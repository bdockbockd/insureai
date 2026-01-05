import { MODEL_FALLBACK_CHAIN, getApiKeys } from "@/lib/gemini";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// Models to test - using centralized chain plus extras for diagnostics
const MODELS = [
  ...MODEL_FALLBACK_CHAIN,    // Pro first, then flash variants (from centralized service)
  "gemini-3-flash-preview",   // Preview model for testing availability
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

export async function GET() {
  // Use centralized API key management
  const keys = getApiKeys();

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
