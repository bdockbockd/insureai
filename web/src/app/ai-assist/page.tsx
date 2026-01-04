"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Loader2,
  BookOpen,
  RefreshCw,
  AlertCircle,
  Stethoscope,
  HelpCircle,
  MessageCircle,
  Phone,
  UserCheck,
  CheckCircle,
  User,
  LogIn,
  Lock,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PlanSelector } from "@/components/plan-selector";
import type { InsurancePlan } from "@/data/plans-config";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  planContext?: string;
  // CTA trigger info
  shouldTriggerCta?: boolean;
  ctaReason?: string;
}

interface RateLimitInfo {
  exceeded: boolean;
  remaining: number;
  total: number;
}

interface PresetQuestion {
  id: string;
  icon: React.ElementType;
  title_th: string;
  title_en: string;
  question_th: string;
  question_en: string;
  color: string;
}

const presetQuestions: PresetQuestion[] = [
  {
    id: "basics",
    icon: BookOpen,
    title_th: "พื้นฐานประกัน",
    title_en: "Insurance Basics",
    question_th: "ช่วยอธิบายพื้นฐานของประกันทุกประเภทให้หน่อย ประกันสุขภาพ ประกันโรคร้าย ประกันออมทรัพย์ และประกันบำนาญ ต่างกันยังไง?",
    question_en: "Can you explain the basics of all insurance types? How are health insurance, critical illness, savings, and pension plans different?",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "outdated-plan",
    icon: RefreshCw,
    title_th: "แผนเก่าเกินไป?",
    title_en: "Outdated Plan?",
    question_th: "แผนประกันที่ฉันมีอยู่เก่าเกินไป ควรรีบอัพเดตทำไม? มีข้อดีข้อเสียอะไรบ้าง?",
    question_en: "My current insurance plan is outdated - why should I update it urgently? What are the pros and cons?",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "unlimited-opd",
    icon: Stethoscope,
    title_th: "OPD ไม่จำกัด",
    title_en: "Unlimited OPD",
    question_th: "มีแผนประกันที่ให้ความคุ้มครอง OPD แบบไม่จำกัดบ้างไหม? ถ้ามี มีเงื่อนไขอะไรบ้าง?",
    question_en: "Are there any insurance plans that offer unlimited OPD coverage? If so, what are the conditions?",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "opd-case",
    icon: HelpCircle,
    title_th: "เคส OPD จริง",
    title_en: "Real OPD Case",
    question_th: "สมมติว่าฉันไปพบแพทย์ด้วยอาการปวดหัวเรื้อรัง หมอสั่งตรวจ CT Scan และให้ยา กรณีแบบนี้ OPD จะคุ้มครองไหม? ต้องเตรียมเอกสารอะไรบ้าง?",
    question_en: "If I visit a doctor for chronic headaches, get a CT scan and medication, will OPD cover this? What documents do I need?",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "copay",
    icon: AlertCircle,
    title_th: "Copay น่ากลัวแค่ไหน",
    title_en: "How Scary is Copay?",
    question_th: "Copay ในประกันสุขภาพคืออะไร? น่ากลัวแค่ไหน? มีวิธีหลีกเลี่ยงไหม?",
    question_en: "What is Copay in health insurance? How scary is it? Is there a way to avoid it?",
    color: "from-red-500 to-pink-500",
  },
];

// Generate a unique session ID for conversation tracking
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export default function AIAssistPage() {
  const { language, t } = useLanguage();
  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);
  const [sessionId] = useState(() => generateSessionId()); // Persist session ID for this chat
  const [agentRequested, setAgentRequested] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>({ exceeded: false, remaining: 3, total: 3 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Handle requesting an agent
  const handleRequestAgent = async () => {
    try {
      const response = await fetch("/api/ai-assist/request-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (response.ok) {
        setAgentRequested(true);
      }
    } catch (error) {
      console.error("Failed to request agent:", error);
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    const assistantMessageId = (Date.now() + 1).toString();

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Add empty assistant message for streaming
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      },
    ]);

    try {
      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          planId: selectedPlan?.id || null,
          sessionId, // Include session ID for conversation tracking
          userId: session?.user?.id || null, // Link to authenticated user
        }),
        signal: abortControllerRef.current.signal,
      });

      // Check if response is JSON (demo mode, error, or rate limit)
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data = await response.json();

        // Handle rate limit exceeded
        if (response.status === 429 && data.error === "rate_limit_exceeded") {
          setRateLimit({
            exceeded: true,
            remaining: data.remaining || 0,
            total: data.total || 3,
          });
          // Remove the assistant message placeholder
          setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
          setIsLoading(false);
          return;
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? { ...m, content: data.response || data.error, isStreaming: false }
              : m
          )
        );
        setIsLoading(false);
        return;
      }

      // Update rate limit info from response headers (if available)
      const remainingHeader = response.headers.get("X-RateLimit-Remaining");
      if (remainingHeader && !session?.user) {
        setRateLimit(prev => ({
          ...prev,
          remaining: parseInt(remainingHeader, 10),
        }));
      }

      // Handle streaming SSE response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let fullContent = "";
      let structuredResponse: { answer?: string; shouldTriggerCta?: boolean; ctaReason?: string } | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);

              // Check if this is the final structured response
              if (parsed.done && parsed.structured) {
                structuredResponse = parsed.structured;
                // Update with the clean parsed answer
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? {
                          ...m,
                          content: parsed.structured.answer || fullContent,
                          shouldTriggerCta: parsed.structured.shouldTriggerCta,
                          ctaReason: parsed.structured.ctaReason,
                          isStreaming: false,
                        }
                      : m
                  )
                );
              } else if (parsed.text) {
                fullContent += parsed.text;
                // Update message with accumulated content (raw streaming)
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: fullContent }
                      : m
                  )
                );
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Mark streaming as complete if structured response wasn't received
      if (!structuredResponse) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? { ...m, isStreaming: false }
              : m
          )
        );
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        // Request was cancelled, clean up
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
      } else {
        // Update message with error
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? {
                  ...m,
                  content:
                    language === "th"
                      ? "ขออภัย ไม่สามารถเชื่อมต่อกับ AI ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง"
                      : "Sorry, unable to connect to AI at the moment. Please try again.",
                  isStreaming: false,
                }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handlePresetClick = (question: PresetQuestion) => {
    const content = language === "th" ? question.question_th : question.question_en;
    handleSendMessage(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const resetChat = () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setInputValue("");
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="shrink-0 px-4 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            {language === "th" ? "กลับหน้าหลัก" : "Back to Home"}
          </Link>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">AI Assistant</span>
            </div>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={resetChat} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                {language === "th" ? "เริ่มใหม่" : "Reset"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            /* Welcome + Preset Questions */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {language === "th" ? "ถามอะไรก็ได้เรื่องประกัน" : "Ask Anything About Insurance"}
                </h1>
                <p className="text-gray-600">
                  {language === "th"
                    ? "ผู้ช่วย AI พร้อมตอบทุกคำถามเกี่ยวกับประกัน 24/7"
                    : "AI Assistant ready to answer all your insurance questions 24/7"}
                </p>
              </div>

              <p className="text-center text-gray-500 mb-6">
                {language === "th" ? "เลือกคำถามด้านล่าง หรือพิมพ์คำถามของคุณ" : "Choose a question below, or type your own"}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {presetQuestions.map((question, index) => {
                  const Icon = question.icon;
                  return (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <button
                        onClick={() => handlePresetClick(question)}
                        className="w-full text-left outline-none"
                        disabled={isLoading}
                      >
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-blue-200 cursor-pointer group">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${question.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 mb-1">
                                  {language === "th" ? question.title_th : question.title_en}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                  {language === "th" ? question.question_th : question.question_en}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* Messages */
            <div className="space-y-4 pb-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                          : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-2 text-blue-600">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-xs font-medium">AI Assistant</span>
                          {message.isStreaming && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                            </span>
                          )}
                        </div>
                      )}
                      {message.role === "assistant" ? (
                        message.content ? (
                          <>
                            <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2 prose-p:text-gray-700 prose-p:my-2 prose-li:text-gray-700 prose-li:my-0.5 prose-strong:text-gray-900 prose-ul:my-2 prose-ol:my-2">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                            </div>

                            {/* CTA Buttons - Show when AI triggers */}
                            {message.shouldTriggerCta && !message.isStreaming && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 pt-4 border-t border-gray-200"
                              >
                                <p className="text-sm text-gray-600 mb-3">
                                  {language === "th"
                                    ? "ต้องการความช่วยเหลือเพิ่มเติม?"
                                    : "Need more help?"}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {agentRequested ? (
                                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                                      <CheckCircle className="w-4 h-4" />
                                      <span className="text-sm font-medium">
                                        {language === "th"
                                          ? "ตัวแทนได้รับแจ้งแล้ว จะติดต่อกลับเร็วๆ นี้"
                                          : "Agent notified. They will contact you soon."}
                                      </span>
                                    </div>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                                      onClick={handleRequestAgent}
                                    >
                                      <UserCheck className="w-4 h-4" />
                                      {language === "th"
                                        ? "ขอให้ตัวแทนช่วยตอบ"
                                        : "Request Agent Help"}
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 border-green-200 text-green-700 hover:bg-green-50"
                                    onClick={() => setShowContactModal(true)}
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                    {language === "th"
                                      ? "ติดต่อตัวแทนโดยตรง"
                                      : "Contact Agent Directly"}
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </>
                        ) : (
                          <span className="flex items-center gap-2 text-gray-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {language === "th" ? "กำลังคิด..." : "Thinking..."}
                          </span>
                        )
                      ) : (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Rate Limit Exceeded Banner */}
      <AnimatePresence>
        {rateLimit.exceeded && !session?.user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="shrink-0 bg-gradient-to-r from-orange-500 to-red-500 text-white"
          >
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {language === "th"
                        ? "คุณใช้ AI ครบ 3 ครั้งแล้ววันนี้"
                        : "You've used your 3 free AI chats today"}
                    </p>
                    <p className="text-sm text-white/80">
                      {language === "th"
                        ? "สมัครสมาชิกฟรีเพื่อใช้งานไม่จำกัด!"
                        : "Sign up free for unlimited access!"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-white text-orange-600 hover:bg-white/90 gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  {language === "th" ? "เข้าสู่ระบบ" : "Login"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest Usage Counter */}
      {!session?.user && !rateLimit.exceeded && messages.length > 0 && (
        <div className="shrink-0 bg-blue-50 border-t border-blue-100">
          <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <MessageCircle className="w-4 h-4" />
              <span>
                {language === "th"
                  ? `เหลือ ${rateLimit.remaining} ครั้งวันนี้`
                  : `${rateLimit.remaining} free chats remaining today`}
              </span>
            </div>
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              <LogIn className="w-3 h-3" />
              {language === "th" ? "เข้าสู่ระบบเพื่อใช้ไม่จำกัด" : "Login for unlimited"}
            </Link>
          </div>
        </div>
      )}

      {/* Input Area - Fixed at bottom */}
      <div className="shrink-0 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Card className={`border-2 shadow-lg ${rateLimit.exceeded && !session?.user ? 'border-gray-300 opacity-60' : 'border-gray-200'}`}>
            <CardContent className="p-3">
              {/* Plan Selector Row */}
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                <PlanSelector
                  selectedPlan={selectedPlan}
                  onSelectPlan={setSelectedPlan}
                  disabled={isLoading || (rateLimit.exceeded && !session?.user)}
                />
                {selectedPlan && (
                  <span className="text-xs text-gray-500">
                    {language === "th"
                      ? "AI จะตอบโดยอิงจากข้อมูลแผนนี้"
                      : "AI will answer based on this plan"}
                  </span>
                )}
              </div>

              {/* Input Row */}
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      rateLimit.exceeded && !session?.user
                        ? (language === "th"
                            ? "เข้าสู่ระบบเพื่อถามต่อ..."
                            : "Login to continue chatting...")
                        : selectedPlan
                          ? (language === "th"
                              ? `ถามเกี่ยวกับ ${selectedPlan.short_name_th}...`
                              : `Ask about ${selectedPlan.short_name_en}...`)
                          : (language === "th" ? "พิมพ์คำถามของคุณ..." : "Type your question...")
                    }
                    className="w-full resize-none border-0 focus:ring-0 focus:outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm min-h-[44px] max-h-[120px] py-2"
                    rows={1}
                    disabled={isLoading || (rateLimit.exceeded && !session?.user)}
                  />
                </div>
                <Button
                  onClick={() => rateLimit.exceeded && !session?.user ? router.push("/login") : handleSendMessage(inputValue)}
                  disabled={(!inputValue.trim() || isLoading) && !(rateLimit.exceeded && !session?.user)}
                  variant="gradient"
                  size="icon"
                  className="flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : rateLimit.exceeded && !session?.user ? (
                    <LogIn className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          <p className="text-center text-xs text-gray-400 mt-2">
            {language === "th"
              ? "AI อาจให้ข้อมูลที่ไม่ถูกต้อง กรุณาตรวจสอบกับตัวแทนประกันก่อนตัดสินใจ"
              : "AI may provide inaccurate information. Please verify with an insurance agent before deciding."}
          </p>
        </div>
      </div>

      {/* Contact Agent Modal */}
      <ContactAgentModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        language={language}
        sessionId={sessionId}
      />
    </div>
  );
}

// Contact Agent Modal Component with Phone Callback
function ContactAgentModal({
  isOpen,
  onClose,
  language,
  sessionId,
}: {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  sessionId: string;
}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) return;

    setIsSubmitting(true);
    try {
      // Submit callback request
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Callback Request",
          phone: phoneNumber,
          preferredContact: "phone",
          source: "ai-assist-callback",
          userProfile: { sessionId },
        }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit callback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber("");
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {language === "th" ? "ติดต่อตัวแทนประกัน" : "Contact Insurance Agent"}
          </h3>

          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {language === "th" ? "ส่งคำขอเรียบร้อย!" : "Request Submitted!"}
              </h4>
              <p className="text-gray-600 text-sm">
                {language === "th"
                  ? "เราจะโทรกลับหาคุณในเร็วๆ นี้"
                  : "We'll call you back shortly"}
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4 text-sm">
                {language === "th"
                  ? "เลือกช่องทางที่สะดวกเพื่อติดต่อตัวแทนประกันของเรา"
                  : "Choose your preferred channel to contact our insurance agent"}
              </p>

              {/* Phone Callback Option */}
              <div className="mb-4 p-4 rounded-xl border-2 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {language === "th" ? "ให้เราโทรกลับ" : "Request Callback"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === "th" ? "ใส่เบอร์โทรแล้วเราโทรหา" : "Enter your number, we'll call you"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9-]/g, ""))}
                    placeholder={language === "th" ? "08x-xxx-xxxx" : "08x-xxx-xxxx"}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    maxLength={12}
                  />
                  <Button
                    onClick={handlePhoneSubmit}
                    disabled={!phoneNumber.trim() || isSubmitting}
                    size="sm"
                    className="px-4"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      language === "th" ? "ส่ง" : "Send"
                    )}
                  </Button>
                </div>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">
                    {language === "th" ? "หรือ" : "or"}
                  </span>
                </div>
              </div>

              {/* Other contact options */}
              <div className="space-y-2">
                <a
                  href="https://line.me/R/ti/p/@insureai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border-2 border-green-200 hover:bg-green-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">LINE</p>
                    <p className="text-xs text-gray-500">@insureai</p>
                  </div>
                </a>

                <a
                  href="tel:+66812345678"
                  className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {language === "th" ? "โทรหาเราเลย" : "Call Us Now"}
                    </p>
                    <p className="text-xs text-gray-500">081-234-5678</p>
                  </div>
                </a>
              </div>
            </>
          )}

          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={handleClose}
          >
            {language === "th" ? "ปิด" : "Close"}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
