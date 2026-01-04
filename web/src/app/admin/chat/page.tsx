"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  MessageCircle,
  User,
  Bot,
  Clock,
  AlertCircle,
  CheckCircle,
  Send,
  RefreshCw,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessage {
  role: "user" | "assistant" | "admin";
  content: string;
  timestamp: string;
  ctaTriggered?: boolean;
  ctaReason?: string;
}

interface Conversation {
  _id: string;
  sessionId: string;
  messages: ChatMessage[];
  planId?: string;
  planName?: string;
  ctaTriggered?: boolean;
  ctaReason?: string;
  agentRequested?: boolean;
  agentRequestedAt?: string;
  adminResponded?: boolean;
  adminRespondedAt?: string;
  adminResponse?: string;
  metadata: {
    ip?: string;
    country?: string;
    city?: string;
    userAgent?: string;
    language?: string;
    model?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [filter, setFilter] = useState<"all" | "agent-requested">("agent-requested");

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter === "agent-requested") {
        params.set("filter", "agent-requested");
      }
      const response = await fetch(`/api/admin/chat?${params}`);
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [filter]);

  const handleSendResponse = async () => {
    if (!selectedConversation || !responseText.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedConversation.sessionId,
          response: responseText,
        }),
      });

      if (response.ok) {
        setResponseText("");
        fetchConversations();
        // Update selected conversation
        setSelectedConversation((prev) =>
          prev
            ? {
                ...prev,
                adminResponded: true,
                adminResponse: responseText,
                messages: [
                  ...prev.messages,
                  {
                    role: "admin" as const,
                    content: responseText,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : null
        );
      }
    } catch (error) {
      console.error("Failed to send response:", error);
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Chat Conversations</h1>
              <p className="text-sm text-gray-500">
                Manage customer conversations and agent requests
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | "agent-requested")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="agent-requested">Agent Requested</option>
              <option value="all">All Conversations</option>
            </select>
            <Button variant="outline" size="sm" onClick={fetchConversations} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Conversations List */}
          <div className="lg:col-span-1 space-y-2">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {filter === "agent-requested" ? "Pending Agent Requests" : "All Conversations"}
              <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {conversations.length}
              </span>
            </h2>

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No conversations found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {conversations.map((conv) => (
                  <Card
                    key={conv._id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedConversation?.sessionId === conv.sessionId
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {conv.agentRequested && !conv.adminResponded ? (
                            <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3" />
                              Needs Response
                            </span>
                          ) : conv.adminResponded ? (
                            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              Responded
                            </span>
                          ) : null}
                        </div>
                        <span className="text-xs text-gray-400">
                          {conv.messages.length} msgs
                        </span>
                      </div>

                      <p className="text-sm text-gray-800 line-clamp-2 mb-2">
                        {conv.messages[0]?.content || "No messages"}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatDate(conv.updatedAt)}
                        {conv.planName && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded">
                            {conv.planName}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Conversation Detail */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <Card className="h-[calc(100vh-150px)] flex flex-col">
                <CardHeader className="border-b shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Session: {selectedConversation.sessionId.slice(0, 20)}...
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.metadata.country && (
                          <span>{selectedConversation.metadata.country} • </span>
                        )}
                        {selectedConversation.metadata.model && (
                          <span>Model: {selectedConversation.metadata.model}</span>
                        )}
                      </p>
                    </div>
                    {selectedConversation.ctaTriggered && (
                      <div className="text-right">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          CTA Triggered
                        </span>
                        {selectedConversation.ctaReason && (
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedConversation.ctaReason}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        msg.role === "user"
                          ? "justify-end"
                          : msg.role === "admin"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-blue-500 text-white"
                            : msg.role === "admin"
                            ? "bg-green-500 text-white"
                            : "bg-white border border-gray-200 text-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1 text-xs opacity-75">
                          {msg.role === "user" ? (
                            <>
                              <User className="w-3 h-3" />
                              Customer
                            </>
                          ) : msg.role === "admin" ? (
                            <>
                              <User className="w-3 h-3" />
                              Admin
                            </>
                          ) : (
                            <>
                              <Bot className="w-3 h-3" />
                              AI
                            </>
                          )}
                          <span>{formatDate(msg.timestamp)}</span>
                        </div>
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        )}
                        {msg.ctaTriggered && (
                          <div className="mt-2 text-xs opacity-75">
                            ⚠️ CTA Triggered: {msg.ctaReason}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Response Input */}
                {selectedConversation.agentRequested && !selectedConversation.adminResponded && (
                  <div className="border-t p-4 shrink-0">
                    <div className="flex gap-2">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Type your response to the customer..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 resize-none text-sm"
                        rows={3}
                      />
                      <Button
                        onClick={handleSendResponse}
                        disabled={!responseText.trim() || isSending}
                        className="self-end"
                      >
                        {isSending ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      This response will be visible to the customer and added to the conversation.
                    </p>
                  </div>
                )}

                {selectedConversation.adminResponded && (
                  <div className="border-t p-4 shrink-0 bg-green-50">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Response sent on {formatDate(selectedConversation.adminRespondedAt || "")}
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="h-[calc(100vh-150px)] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Click on a conversation to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
