"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
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

export default function AIAssistPage() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
        }),
        signal: abortControllerRef.current.signal,
      });

      // Check if response is JSON (demo mode or error)
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data = await response.json();
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

      // Handle streaming SSE response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let fullContent = "";

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
              if (parsed.text) {
                fullContent += parsed.text;
                // Update message with accumulated content
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

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? { ...m, isStreaming: false }
            : m
        )
      );
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            {language === "th" ? "กลับหน้าหลัก" : "Back to Home"}
          </Link>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={resetChat} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              {language === "th" ? "เริ่มใหม่" : "Reset"}
            </Button>
          )}
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">AI Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {language === "th" ? "ถามอะไรก็ได้เรื่องประกัน" : "Ask Anything About Insurance"}
          </h1>
          <p className="text-gray-600">
            {language === "th"
              ? "ผู้ช่วย AI พร้อมตอบทุกคำถามเกี่ยวกับประกัน 24/7"
              : "AI Assistant ready to answer all your insurance questions 24/7"}
          </p>
        </motion.div>

        {/* Chat Area */}
        {messages.length === 0 ? (
          /* Preset Questions */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
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
                      className="w-full text-left"
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
          <div className="space-y-4 mb-4 max-h-[50vh] overflow-y-auto px-2">
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
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content || (
                        <span className="flex items-center gap-2 text-gray-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {language === "th" ? "กำลังคิด..." : "Thinking..."}
                        </span>
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sticky bottom-4 mt-6"
        >
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={language === "th" ? "พิมพ์คำถามของคุณ..." : "Type your question..."}
                    className="w-full resize-none border-0 focus:ring-0 focus:outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm min-h-[44px] max-h-[120px] py-2"
                    rows={1}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  variant="gradient"
                  size="icon"
                  className="flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          <p className="text-center text-xs text-gray-400 mt-3">
            {language === "th"
              ? "AI อาจให้ข้อมูลที่ไม่ถูกต้อง กรุณาตรวจสอบกับตัวแทนประกันก่อนตัดสินใจ"
              : "AI may provide inaccurate information. Please verify with an insurance agent before deciding."}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
