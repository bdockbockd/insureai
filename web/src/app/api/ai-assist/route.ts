import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getPlanById } from "@/data/plans-config";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// Load plan markdown content from file system
async function loadPlanMarkdown(planId: string): Promise<string | null> {
  const plan = getPlanById(planId);
  if (!plan) return null;

  try {
    // Markdown files are in the parent directory: ../data/markdown/
    const markdownPath = path.join(
      process.cwd(),
      "..",
      "data",
      "markdown",
      plan.markdown_path.replace(/^\/data\/markdown\//, "")
    );
    const content = await fs.readFile(markdownPath, "utf-8");
    return content;
  } catch {
    // If file doesn't exist, return null
    console.log(`Markdown file not found for plan: ${planId}`);
    return null;
  }
}

// API Key management with rotation support
// Primary key + reserve keys for when daily limits are hit
function getApiKeys(): string[] {
  const keys: string[] = [];

  // Primary key
  if (process.env.GEMINI_API_KEY) {
    keys.push(process.env.GEMINI_API_KEY);
  }

  // Reserve keys (comma-separated)
  if (process.env.GEMINI_KEY_RESERVES) {
    const reserves = process.env.GEMINI_KEY_RESERVES.split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    keys.push(...reserves);
  }

  return keys;
}

// Track failed keys in memory (resets on server restart)
// In production, consider using Redis or similar for persistence
const exhaustedKeys = new Set<string>();

// Get the next available key that hasn't been exhausted
function getNextAvailableKey(): string | null {
  const keys = getApiKeys();
  for (const key of keys) {
    if (!exhaustedKeys.has(key)) {
      return key;
    }
  }
  // All keys exhausted, reset and try again (maybe limits reset)
  exhaustedKeys.clear();
  return keys[0] || null;
}

// Mark a key as exhausted (hit rate limit)
function markKeyExhausted(key: string) {
  exhaustedKeys.add(key);
  console.log(`API key exhausted: ${key.slice(0, 10)}... (${exhaustedKeys.size} keys exhausted)`);
}

// Model fallback chain: 2.5+ only (2.0 models exhausted on free tier)
const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash-lite",    // Cheapest, fastest - best for free tier
  "gemini-2.5-flash",         // Balanced speed & intelligence
  "gemini-3-flash-preview",   // Newest, most capable
];

const SYSTEM_PROMPT = `คุณคือผู้เชี่ยวชาญด้านประกันภัยของ InsureAI ประเทศไทย ชื่อ "ไอ้หนูประกัน" (Insurance AI Assistant)

หน้าที่ของคุณ:
1. ให้คำปรึกษาเรื่องประกันภัยทุกประเภท (สุขภาพ, โรคร้ายแรง, ออมทรัพย์, บำนาญ, ชีวิต)
2. อธิบายศัพท์ประกันให้เข้าใจง่าย
3. ช่วยวิเคราะห์ความต้องการของผู้ใช้
4. ตอบคำถามเกี่ยวกับแผนประกันที่เรามี

แผนประกันที่เรามี:
- ประกันสุขภาพ: First Class All Hospital 80/100 MB, Double Care All Hospital (8-30 MB), First Class BDMS 60/120 MB
- ประกันโรคร้ายแรง: CI 48 Beyond (คุ้มครอง 75 โรค), Multi Care (คุ้มครอง 81 โรค จ่าย 840%)
- ประกันออมทรัพย์: My Double Plus (รับคืน 140%)
- ประกันบำนาญ: Pension Plus 85A55 (รับบำนาญปี 55-85)
- ประกันชีวิต: แผนทุนชีวิตสูง (ทุนประกันสูง เบี้ยประหยัด)

ความรู้พื้นฐาน:
- OPD (ผู้ป่วยนอก): ค่ารักษาที่ไม่ต้องนอน รพ. เช่น ตรวจทั่วไป ยา
- IPD (ผู้ป่วยใน): ค่ารักษาที่ต้องนอน รพ.
- Copay/ร่วมจ่าย: ผู้เอาประกันต้องจ่ายเองบางส่วน เช่น 20% หรือ 30,000 บาทแรก
- Waiting Period (ระยะรอคอย): ช่วงที่ประกันยังไม่คุ้มครองหลังทำสัญญา ปกติ 30-90 วัน
- Pre-existing Condition: โรคที่เป็นก่อนทำประกัน อาจไม่คุ้มครอง
- Sum Insured (ทุนประกัน): วงเงินคุ้มครองสูงสุด
- Premium (เบี้ยประกัน): เงินที่จ่ายเพื่อซื้อความคุ้มครอง

กฎในการตอบ:
1. ตอบเป็นภาษาไทยเป็นหลัก ยกเว้นผู้ใช้ถามเป็นภาษาอังกฤษ
2. ใช้ภาษาที่เข้าใจง่าย ไม่ใช้ศัพท์เทคนิคมากเกินไป
3. ถ้าไม่แน่ใจ ให้แนะนำให้ติดต่อตัวแทนประกัน
4. ไม่ให้คำแนะนำทางการแพทย์หรือกฎหมาย
5. ตอบกระชับ ตรงประเด็น ไม่ยาวเกินไป
6. ใช้ emoji บ้างเพื่อให้อ่านง่าย 😊
7. ถ้าเป็นคำถามซับซ้อน แนะนำให้ลงทะเบียนรับคำปรึกษาฟรี`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Result type for tryGeminiModel
interface GeminiResult {
  response: Response | null;
  keyExhausted: boolean;  // True if 429 rate limit hit
  contextTooLong: boolean; // True if context length exceeded
}

// Try calling Gemini with a specific model and API key
async function tryGeminiModel(
  model: string,
  apiKey: string,
  contents: Array<{ role: string; parts: Array<{ text: string }> }>,
  stream: boolean = false
): Promise<GeminiResult> {
  const endpoint = stream ? "streamGenerateContent" : "generateContent";
  const url = `${GEMINI_BASE_URL}/${model}:${endpoint}?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      }),
    });

    if (response.ok) {
      return { response, keyExhausted: false, contextTooLong: false };
    }

    const errorData = await response.json().catch(() => ({}));
    const errorMessage = JSON.stringify(errorData).toLowerCase();

    // Check for rate limit / quota exhausted
    if (response.status === 429 || response.status === 403) {
      // Check if it's a quota/rate limit issue
      if (errorMessage.includes("quota") || errorMessage.includes("rate") || errorMessage.includes("limit")) {
        console.log(`API key ${apiKey.slice(0, 10)}... hit rate limit for model ${model}`);
        return { response: null, keyExhausted: true, contextTooLong: false };
      }
    }

    // Check for context length / token limit errors
    if (response.status === 400) {
      if (errorMessage.includes("token") || errorMessage.includes("context") ||
          errorMessage.includes("length") || errorMessage.includes("too long") ||
          errorMessage.includes("maximum") || errorMessage.includes("exceed")) {
        console.log(`Model ${model} context too long`);
        return { response: null, keyExhausted: false, contextTooLong: true };
      }
    }

    // Log other errors but don't throw - we'll try the next model
    console.log(`Model ${model} failed:`, response.status, errorData);
    return { response: null, keyExhausted: false, contextTooLong: false };
  } catch (error) {
    console.log(`Model ${model} error:`, error);
    return { response: null, keyExhausted: false, contextTooLong: false };
  }
}

// Streaming response handler
export async function POST(request: NextRequest) {
  try {
    const { message, history, planId } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if any API key is configured
    const apiKeys = getApiKeys();
    if (apiKeys.length === 0) {
      return new Response(JSON.stringify({ response: getDemoResponse(message), demo: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build system prompt with plan context if a plan is selected
    let systemPrompt = SYSTEM_PROMPT;

    if (planId) {
      const plan = getPlanById(planId);
      const planMarkdown = await loadPlanMarkdown(planId);

      if (plan) {
        systemPrompt += `\n\n===== ข้อมูลแผนประกันที่ผู้ใช้เลือก =====
ผู้ใช้กำลังถามเกี่ยวกับแผน: ${plan.name_th} (${plan.name_en})
หมวดหมู่: ${plan.category}
คำอธิบาย: ${plan.description_th}
จุดเด่น: ${plan.key_highlights.join(", ")}

กรุณาตอบคำถามโดยอิงจากข้อมูลแผนนี้เป็นหลัก`;

        if (planMarkdown) {
          // Truncate if too long to avoid context limits
          const maxLength = 8000;
          const truncatedMarkdown = planMarkdown.length > maxLength
            ? planMarkdown.substring(0, maxLength) + "\n\n... (ข้อมูลเพิ่มเติมถูกตัดออก)"
            : planMarkdown;

          systemPrompt += `\n\n===== รายละเอียดแผนประกันจากเอกสาร =====
${truncatedMarkdown}
===== สิ้นสุดข้อมูลแผน =====`;
        }
      }
    }

    // Build base context (system prompt + acknowledgment)
    const baseContext = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "เข้าใจแล้วครับ ผมพร้อมให้คำปรึกษาเรื่องประกันภัยแล้ว 😊 ถามมาได้เลยครับ!" }] },
    ];

    // Build conversation history array
    const historyMessages: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    if (history && Array.isArray(history)) {
      for (const msg of history as ChatMessage[]) {
        historyMessages.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        });
      }
    }

    // Current message (always included)
    const currentMessage = { role: "user", parts: [{ text: message }] };

    // Try with full context first, then progressively reduce if context too long
    let geminiResponse: Response | null = null;
    let usedModel = "";
    let usedKey = "";
    let historyStartIndex = 0; // Start from beginning of history
    const maxRetries = Math.ceil(historyMessages.length / 2) + 1; // Remove pairs each time
    let contextReduced = false;

    for (let contextTry = 0; contextTry < maxRetries; contextTry++) {
      // Build contents with current window of history
      const windowedHistory = historyMessages.slice(historyStartIndex);
      const contents = [...baseContext, ...windowedHistory, currentMessage];

      if (contextTry > 0) {
        console.log(`Retrying with reduced context: removed ${historyStartIndex} oldest messages`);
        contextReduced = true;
      }

      let allKeysExhausted = false;
      let contextTooLong = false;

      // Outer loop: try each API key
      keyLoop: while (!allKeysExhausted) {
        const currentKey = getNextAvailableKey();
        if (!currentKey) {
          allKeysExhausted = true;
          break;
        }

        // Inner loop: try each model with current key
        for (const model of MODEL_FALLBACK_CHAIN) {
          const result = await tryGeminiModel(model, currentKey, contents, true);

          if (result.contextTooLong) {
            contextTooLong = true;
            break keyLoop; // Exit to reduce context
          }

          if (result.keyExhausted) {
            // Key hit rate limit, mark it and try next key
            markKeyExhausted(currentKey);
            continue keyLoop;
          }

          if (result.response) {
            geminiResponse = result.response;
            usedModel = model;
            usedKey = currentKey;
            console.log(`Using model: ${model} with key: ${currentKey.slice(0, 10)}...`);
            break keyLoop;
          }
          // Model failed but not due to rate limit, try next model
        }

        // All models failed for this key (not rate limit), try next key
        markKeyExhausted(currentKey);
      }

      // If we got a response, we're done
      if (geminiResponse) {
        break;
      }

      // If context was too long, reduce it and retry
      if (contextTooLong && historyStartIndex < historyMessages.length) {
        // Remove 2 messages (1 user-model pair) from the beginning
        historyStartIndex += 2;
        // Reset exhausted keys for retry with smaller context
        exhaustedKeys.clear();
        continue;
      }

      // All keys exhausted with current context size
      if (allKeysExhausted) {
        throw new Error("All models and API keys exhausted");
      }
    }

    if (!geminiResponse) {
      throw new Error("Failed to get response after context reduction");
    }

    // Create a TransformStream to process JSON array chunks and convert to SSE
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let buffer = "";

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });

        // Try to extract complete JSON objects from the buffer
        // Gemini streaming returns: [{...},\n{...},\n{...}]
        // We need to parse each chunk individually

        // Remove leading [ and trailing ] if present
        let cleanBuffer = buffer.replace(/^\[/, "").replace(/\]$/, "");

        // Split by },{ pattern to find complete objects
        const parts = cleanBuffer.split(/\},\s*\{/);

        for (let i = 0; i < parts.length - 1; i++) {
          let jsonStr = parts[i];
          // Add back the braces that were removed by split
          if (i > 0) jsonStr = "{" + jsonStr;
          jsonStr = jsonStr + "}";

          try {
            const data = JSON.parse(jsonStr);
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text, model: usedModel })}\n\n`));
            }
          } catch {
            // Not a complete JSON yet, continue
          }
        }

        // Keep the last incomplete part in the buffer
        if (parts.length > 0) {
          let lastPart = parts[parts.length - 1];
          if (parts.length > 1) lastPart = "{" + lastPart;
          buffer = lastPart;
        }
      },
      flush(controller) {
        // Try to parse any remaining data in buffer
        if (buffer.trim()) {
          try {
            // Clean up the buffer
            let jsonStr = buffer.replace(/^\[/, "").replace(/\]$/, "").trim();
            if (!jsonStr.startsWith("{")) jsonStr = "{" + jsonStr;
            if (!jsonStr.endsWith("}")) jsonStr = jsonStr + "}";

            const data = JSON.parse(jsonStr);
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text, model: usedModel })}\n\n`));
            }
          } catch {
            // Ignore parse errors on flush
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      },
    });

    // Pipe the Gemini response through our transform
    const readable = geminiResponse.body?.pipeThrough(transformStream);

    // Get key index for debugging (don't expose full key)
    const keyIndex = apiKeys.indexOf(usedKey) + 1;

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Model-Used": usedModel,
        "X-Key-Index": `${keyIndex}/${apiKeys.length}`,
        "X-Context-Reduced": contextReduced ? "true" : "false",
        "X-History-Trimmed": historyStartIndex > 0 ? `${historyStartIndex}` : "0",
      },
    });
  } catch (error) {
    console.error("AI Assist error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        response: "ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง หรือติดต่อเราทาง LINE: @insureai",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Demo responses when API key is not configured
function getDemoResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("พื้นฐาน") || lowerMessage.includes("basic")) {
    return `📚 **พื้นฐานประกันภัยฉบับเข้าใจง่าย**

ประกันภัยมี 4 ประเภทหลัก:

1. **ประกันสุขภาพ** 🏥
   - คุ้มครองค่ารักษาพยาบาล
   - จ่ายตามค่าใช้จ่ายจริง
   - เหมาะสำหรับ: ทุกคน!

2. **ประกันโรคร้ายแรง** 💪
   - รับเงินก้อนเมื่อตรวจพบโรค
   - ไม่ต้องรอรักษา ได้เงินทันที
   - เหมาะสำหรับ: คนทำงาน มีภาระทางการเงิน

3. **ประกันออมทรัพย์** 💰
   - ออมเงิน + คุ้มครองชีวิต
   - รับเงินคืนเมื่อครบสัญญา
   - เหมาะสำหรับ: คนอยากออมเงินระยะยาว

4. **ประกันบำนาญ** 👴👵
   - รับเงินบำนาญทุกปีหลังเกษียณ
   - เหมาะสำหรับ: คนวางแผนเกษียณ

💡 **แนะนำ**: เริ่มจากประกันสุขภาพก่อน เพราะเจ็บป่วยได้ทุกเมื่อ!

ต้องการคำปรึกษาเพิ่มเติมไหมครับ? 😊`;
  }

  if (lowerMessage.includes("copay") || lowerMessage.includes("ร่วมจ่าย")) {
    return `💰 **Copay (ร่วมจ่าย) คืออะไร?**

Copay คือส่วนที่คุณต้องจ่ายเองเมื่อเคลมประกัน

**มี 2 แบบหลักๆ:**

1. **Copay แบบ %**
   เช่น ร่วมจ่าย 20%
   → ค่ารักษา 100,000 บาท = คุณจ่าย 20,000 บาท

2. **Copay แบบวงเงินแรก**
   เช่น ร่วมจ่าย 30,000 บาทแรก
   → ค่ารักษา 100,000 บาท = คุณจ่าย 30,000 บาท ประกันจ่าย 70,000 บาท

**ข้อดี:** ✅ เบี้ยถูกลง 30-50%
**ข้อเสีย:** ❌ ต้องมีเงินสำรอง

**น่ากลัวไหม?** 🤔
- ถ้ามีเงินสำรอง 50,000-100,000 บาท → ไม่น่ากลัว ได้เบี้ยถูก
- ถ้าไม่มีเงินสำรอง → เลือกแผนไม่มี Copay ดีกว่า

ต้องการให้ช่วยหาแผนที่เหมาะกับคุณไหมครับ? 😊`;
  }

  if (lowerMessage.includes("opd") || lowerMessage.includes("ผู้ป่วยนอก")) {
    return `🏥 **OPD (ผู้ป่วยนอก) คืออะไร?**

OPD = Out-Patient Department = แผนกผู้ป่วยนอก

คือค่ารักษาที่ **ไม่ต้องนอนโรงพยาบาล** เช่น:
- ตรวจสุขภาพทั่วไป
- พบแพทย์เฉพาะทาง
- ตรวจเลือด X-Ray
- รับยากลับบ้าน

**ประกัน OPD ไม่จำกัด มีไหม?** 🤔

ส่วนใหญ่จะมีวงเงินจำกัด เช่น:
- 1,000-2,000 บาท/ครั้ง
- 20,000-50,000 บาท/ปี

**แผนของเราที่มี OPD:**
- First Class All Hospital → OPD เหมาจ่าย
- Double Care All Hospital → OPD ตามแผน

💡 **Tips:** OPD เหมาจ่ายจะเบี้ยแพงกว่า แต่สะดวกกว่า!

ต้องการรายละเอียดเพิ่มเติมไหมครับ? 😊`;
  }

  if (lowerMessage.includes("เก่า") || lowerMessage.includes("อัพเดต") || lowerMessage.includes("update")) {
    return `🔄 **ทำไมต้องอัพเดตแผนประกันเก่า?**

**เหตุผลที่ควรรีบอัพเดต:**

1. **เงินเฟ้อค่ารักษา** 📈
   - ค่ารักษาเพิ่ม 8-10% ต่อปี
   - แผนเก่าอาจคุ้มครองไม่พอ

2. **เทคโนโลยีใหม่** 🏥
   - มะเร็งรักษาด้วยยามุ่งเป้า แพงมาก
   - แผนเก่าอาจไม่ครอบคลุม

3. **อายุที่เพิ่มขึ้น** 👴
   - ยิ่งอายุมาก เบี้ยยิ่งแพง
   - รอนานอาจไม่รับประกัน

4. **เงื่อนไขดีขึ้น** ✨
   - แผนใหม่คุ้มครองครอบคลุมกว่า
   - บางที่เบี้ยถูกกว่าด้วย

**⚠️ ข้อควรระวัง:**
- อย่าเพิ่งยกเลิกแผนเก่า ก่อนแผนใหม่ approve
- ตรวจสอบ waiting period ของแผนใหม่

ต้องการให้ช่วยเปรียบเทียบแผนไหมครับ? 😊`;
  }

  // Default response
  return `สวัสดีครับ! 👋 ผม AI ผู้ช่วยด้านประกันภัยของ InsureAI

ยินดีตอบทุกคำถามเกี่ยวกับประกันครับ เช่น:
- ประกันสุขภาพ ประกันโรคร้าย
- Copay คืออะไร
- ควรเลือกแผนไหนดี
- เปรียบเทียบแผนต่างๆ

💡 **หมายเหตุ:** ขณะนี้เป็นโหมดทดลอง กำลังเชื่อมต่อกับ AI เต็มรูปแบบเร็วๆ นี้

ถ้าต้องการคำปรึกษาจากผู้เชี่ยวชาญจริง สามารถลงทะเบียนรับคำปรึกษาฟรีได้เลยครับ! 😊`;
}
