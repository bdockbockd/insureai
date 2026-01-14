/**
 * Centralized Gemini AI Service
 *
 * Provides unified AI functionality across the application with:
 * - Model fallback chain (pro first, then flash variants)
 * - API key rotation for handling rate limits
 * - Support for both streaming and non-streaming requests
 */

const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

// Model fallback chain: Pro first (best quality), then Flash variants
// User explicitly wants pro first since it's free tier and cost doesn't matter
export const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-pro", // Best quality, use first
  "gemini-2.5-flash", // Balanced speed & intelligence
  "gemini-2.5-flash-lite", // Faster, cheaper fallback
] as const;

export type GeminiModel = (typeof MODEL_FALLBACK_CHAIN)[number];

// API Key Management
let apiKeysCache: string[] | null = null;
const exhaustedKeys = new Set<string>();

/**
 * Get all configured API keys (primary + reserves)
 */
export function getApiKeys(): string[] {
  if (apiKeysCache) return apiKeysCache;

  const keys: string[] = [];

  if (process.env.GEMINI_API_KEY) {
    keys.push(process.env.GEMINI_API_KEY);
  }

  if (process.env.GEMINI_KEY_RESERVES) {
    const reserves = process.env.GEMINI_KEY_RESERVES.split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    keys.push(...reserves);
  }

  apiKeysCache = keys;
  return keys;
}

/**
 * Get the next available API key that hasn't been exhausted
 */
export function getNextAvailableKey(): string | null {
  const keys = getApiKeys();
  for (const key of keys) {
    if (!exhaustedKeys.has(key)) {
      return key;
    }
  }
  // All keys exhausted, reset and try again (limits may have reset)
  exhaustedKeys.clear();
  return keys[0] || null;
}

/**
 * Mark a key as exhausted (hit rate limit)
 */
export function markKeyExhausted(key: string): void {
  exhaustedKeys.add(key);
  console.log(
    `API key exhausted: ${key.slice(0, 10)}... (${exhaustedKeys.size} keys exhausted)`
  );
}

/**
 * Reset exhausted keys (for testing or when limits reset)
 */
export function resetExhaustedKeys(): void {
  exhaustedKeys.clear();
}

/**
 * Get the count of exhausted keys
 */
export function getExhaustedKeyCount(): number {
  return exhaustedKeys.size;
}

// Types
export interface GeminiContent {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

export interface GeminiGenerationConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
}

export interface GeminiSafetySettings {
  category: string;
  threshold: string;
}

export interface GeminiRequestOptions {
  contents: GeminiContent[];
  generationConfig?: GeminiGenerationConfig;
  safetySettings?: GeminiSafetySettings[];
  stream?: boolean;
}

export interface GeminiCallResult {
  response: Response | null;
  model: string;
  apiKeyIndex: number;
  keyExhausted: boolean;
  contextTooLong: boolean;
  error?: string;
}

// Default generation config
export const DEFAULT_GENERATION_CONFIG: GeminiGenerationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 8192,
};

// Default safety settings
export const DEFAULT_SAFETY_SETTINGS: GeminiSafetySettings[] = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
];

/**
 * Try calling Gemini with a specific model and API key
 */
async function tryGeminiModel(
  model: string,
  apiKey: string,
  options: GeminiRequestOptions
): Promise<GeminiCallResult> {
  const stream = options.stream ?? false;
  const endpoint = stream ? "streamGenerateContent" : "generateContent";
  const url = stream
    ? `${GEMINI_BASE_URL}/${model}:${endpoint}?alt=sse&key=${apiKey}`
    : `${GEMINI_BASE_URL}/${model}:${endpoint}?key=${apiKey}`;

  const apiKeyIndex = getApiKeys().indexOf(apiKey) + 1;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: options.contents,
        generationConfig: {
          ...DEFAULT_GENERATION_CONFIG,
          ...options.generationConfig,
        },
        safetySettings: options.safetySettings || DEFAULT_SAFETY_SETTINGS,
      }),
    });

    if (response.ok) {
      return {
        response,
        model,
        apiKeyIndex,
        keyExhausted: false,
        contextTooLong: false,
      };
    }

    const errorData = await response.json().catch(() => ({}));
    const errorMessage = JSON.stringify(errorData).toLowerCase();

    // Check for rate limit / quota exhausted
    if (response.status === 429 || response.status === 403) {
      if (
        errorMessage.includes("quota") ||
        errorMessage.includes("rate") ||
        errorMessage.includes("limit")
      ) {
        console.log(
          `API key ${apiKey.slice(0, 10)}... hit rate limit for model ${model}`
        );
        return {
          response: null,
          model,
          apiKeyIndex,
          keyExhausted: true,
          contextTooLong: false,
        };
      }
    }

    // Check for context length / token limit errors
    if (response.status === 400) {
      if (
        errorMessage.includes("token") ||
        errorMessage.includes("context") ||
        errorMessage.includes("length") ||
        errorMessage.includes("too long") ||
        errorMessage.includes("maximum") ||
        errorMessage.includes("exceed")
      ) {
        console.log(`Model ${model} context too long`);
        return {
          response: null,
          model,
          apiKeyIndex,
          keyExhausted: false,
          contextTooLong: true,
        };
      }
    }

    // Log other errors
    console.log(`Model ${model} failed:`, response.status, errorData);
    return {
      response: null,
      model,
      apiKeyIndex,
      keyExhausted: false,
      contextTooLong: false,
      error: `${response.status}: ${JSON.stringify(errorData)}`,
    };
  } catch (error) {
    console.log(`Model ${model} error:`, error);
    return {
      response: null,
      model,
      apiKeyIndex,
      keyExhausted: false,
      contextTooLong: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Call Gemini API with automatic model and key fallback
 *
 * Tries models in order: pro -> flash -> flash-lite
 * Automatically rotates API keys on rate limits
 */
export async function callGemini(
  options: GeminiRequestOptions
): Promise<GeminiCallResult> {
  const keys = getApiKeys();
  if (keys.length === 0) {
    return {
      response: null,
      model: "",
      apiKeyIndex: 0,
      keyExhausted: false,
      contextTooLong: false,
      error: "No API keys configured",
    };
  }

  let lastResult: GeminiCallResult | null = null;

  // Outer loop: try each API key
  while (true) {
    const currentKey = getNextAvailableKey();
    if (!currentKey) {
      // All keys exhausted
      return (
        lastResult || {
          response: null,
          model: "",
          apiKeyIndex: 0,
          keyExhausted: true,
          contextTooLong: false,
          error: "All API keys exhausted",
        }
      );
    }

    // Inner loop: try each model with current key
    let allModelsRateLimited = true;
    for (const model of MODEL_FALLBACK_CHAIN) {
      console.log(`[FALLBACK] Trying model: ${model} with key: ${currentKey.slice(0, 10)}...`);
      const result = await tryGeminiModel(model, currentKey, options);
      lastResult = result;

      if (result.response) {
        console.log(
          `Using model: ${model} with key: ${currentKey.slice(0, 10)}...`
        );
        return result;
      }

      if (result.keyExhausted) {
        // Model hit rate limit, try next model in fallback chain
        console.log(
          `API key ${currentKey.slice(0, 10)}... hit rate limit for model ${model}`
        );
        continue; // Try next model instead of breaking
      }

      if (result.contextTooLong) {
        // Context too long, this won't be fixed by changing model/key
        return result;
      }

      // Model failed but not due to rate limit
      allModelsRateLimited = false;
    }

    // If all models in the chain hit rate limits for this key, mark key exhausted
    if (allModelsRateLimited) {
      markKeyExhausted(currentKey);
      continue;
    }

    // All models failed for this key (not rate limit), mark key and try next
    markKeyExhausted(currentKey);
  }
}

/**
 * Simple text generation (non-streaming)
 */
export async function generateText(
  prompt: string,
  options?: Partial<GeminiGenerationConfig>
): Promise<{ text: string; model: string } | null> {
  const result = await callGemini({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: options,
    stream: false,
  });

  if (!result.response) {
    console.error("Gemini generateText failed:", result.error);
    return null;
  }

  try {
    const data = await result.response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return { text, model: result.model };
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return null;
  }
}

/**
 * JSON generation with automatic parsing
 */
export async function generateJSON<T = unknown>(
  prompt: string,
  options?: Partial<GeminiGenerationConfig>
): Promise<{ data: T; model: string } | null> {
  const result = await callGemini({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      ...options,
      responseMimeType: "application/json",
    },
    stream: false,
  });

  if (!result.response) {
    console.error("Gemini generateJSON failed:", result.error);
    return null;
  }

  try {
    const responseData = await result.response.json();
    const text = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse the JSON response
    let jsonStr = text;

    // Try to extract JSON from code block
    const codeBlockMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      jsonStr = codeBlockMatch[1];
    } else {
      // Try to find raw JSON object
      const jsonObjMatch = text.match(/\{[\s\S]*\}/);
      if (jsonObjMatch) {
        jsonStr = jsonObjMatch[0];
      }
    }

    // Clean up common JSON issues
    jsonStr = jsonStr.trim();
    jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1"); // Remove trailing commas
    jsonStr = jsonStr.replace(/\/\/.*$/gm, ""); // Remove comments

    const data = JSON.parse(jsonStr) as T;
    return { data, model: result.model };
  } catch (error) {
    console.error("Failed to parse Gemini JSON response:", error);
    return null;
  }
}

/**
 * Chat with conversation history (streaming)
 */
export async function streamChat(
  contents: GeminiContent[],
  options?: Partial<GeminiGenerationConfig>
): Promise<GeminiCallResult> {
  return callGemini({
    contents,
    generationConfig: options,
    stream: true,
  });
}

/**
 * Build conversation contents from history
 */
export function buildConversationContents(
  systemPrompt: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  currentMessage: string
): GeminiContent[] {
  const contents: GeminiContent[] = [
    { role: "user", parts: [{ text: systemPrompt }] },
    {
      role: "model",
      parts: [
        {
          text: "เข้าใจแล้วครับ ผมพร้อมให้คำปรึกษาเรื่องประกันภัยแล้ว ถามมาได้เลยครับ!",
        },
      ],
    },
  ];

  // Add history
  for (const msg of history) {
    contents.push({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    });
  }

  // Add current message
  contents.push({
    role: "user",
    parts: [{ text: currentMessage }],
  });

  return contents;
}
