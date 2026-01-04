"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Search,
  Sparkles,
  BookOpen,
  MessageCircle,
  Heart,
  Eye,
  Filter,
  Plus,
  ArrowLeft,
  CheckCircle,
  Users,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  Newspaper,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

interface CommunityPost {
  _id: string;
  title: string;
  content: string;
  summary: string;
  category: "knowledge" | "story" | "question" | "tip" | "news";
  tags: string[];
  authorName: string;
  authorImage?: string;
  likes: number;
  views: number;
  commentsCount: number;
  isVerified: boolean;
  isPinned: boolean;
  createdAt: string;
}

const categories = [
  { id: "all", labelEn: "All Posts", labelTh: "ทั้งหมด", icon: BookOpen },
  { id: "knowledge", labelEn: "Knowledge", labelTh: "ความรู้", icon: Lightbulb },
  { id: "story", labelEn: "Stories", labelTh: "เรื่องเล่า", icon: MessageCircle },
  { id: "question", labelEn: "Questions", labelTh: "คำถาม", icon: HelpCircle },
  { id: "tip", labelEn: "Tips", labelTh: "เคล็ดลับ", icon: TrendingUp },
  { id: "news", labelEn: "News", labelTh: "ข่าวสาร", icon: Newspaper },
];

const benefits = [
  {
    icon: Search,
    titleEn: "AI-Powered Search",
    titleTh: "ค้นหาด้วย AI",
    descEn: "Find relevant posts instantly with intelligent search",
    descTh: "ค้นหาโพสต์ที่เกี่ยวข้องได้ทันทีด้วย AI อัจฉริยะ",
  },
  {
    icon: Clock,
    titleEn: "Always Updated",
    titleTh: "อัปเดตเสมอ",
    descEn: "Content stays relevant and verified by experts",
    descTh: "เนื้อหาเป็นปัจจุบันและตรวจสอบโดยผู้เชี่ยวชาญ",
  },
  {
    icon: Zap,
    titleEn: "Instant Answers",
    titleTh: "ตอบทันที",
    descEn: "AI assists you to find related posts immediately",
    descTh: "AI ช่วยค้นหาโพสต์ที่เกี่ยวข้องได้ทันที",
  },
  {
    icon: Shield,
    titleEn: "Verified Content",
    titleTh: "เนื้อหาตรวจสอบแล้ว",
    descEn: "Expert-verified posts marked with badges",
    descTh: "โพสต์ที่ตรวจสอบโดยผู้เชี่ยวชาญมีป้ายกำกับ",
  },
];

export default function CommunityPage() {
  const { language } = useLanguage();
  const { data: session } = useSession();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState<CommunityPost[]>([]);
  const [isAISearch, setIsAISearch] = useState(false);

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      params.append("limit", "20");

      const response = await fetch(`/api/community/posts?${params}`);
      const data = await response.json();
      setPosts(data.posts || []);
      setIsAISearch(false);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }

    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      params.append("search", searchQuery);
      params.append("aiSearch", "true");
      params.append("limit", "10");

      const response = await fetch(`/api/community/posts?${params}`);
      const data = await response.json();
      setAiSearchResults(data.posts || []);
      setIsAISearch(true);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const displayPosts = isAISearch ? aiSearchResults : posts;

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.icon || BookOpen;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return language === "th" ? "วันนี้" : "Today";
    } else if (diffDays === 1) {
      return language === "th" ? "เมื่อวาน" : "Yesterday";
    } else if (diffDays < 7) {
      return language === "th" ? `${diffDays} วันที่แล้ว` : `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            {language === "th" ? "กลับหน้าหลัก" : "Back to Home"}
          </Link>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm">
              <Users className="w-4 h-4" />
              <span className="font-medium">
                {language === "th" ? "ชุมชน InsureAI" : "InsureAI Community"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {language === "th"
                ? "ชุมชนแบ่งปันความรู้ประกัน"
                : "Insurance Knowledge Community"}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              {language === "th"
                ? "แบ่งปันประสบการณ์ เรียนรู้จากผู้เชี่ยวชาญ ค้นหาคำตอบด้วย AI"
                : "Share experiences, learn from experts, find answers with AI"}
            </p>
          </motion.div>

          {/* AI Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === "th"
                    ? "ค้นหาด้วย AI... เช่น 'วิธีเคลมประกัน' หรือ 'ประกันสุขภาพที่ดี'"
                    : "Search with AI... e.g. 'how to claim insurance' or 'best health plans'"
                }
                className="w-full pl-12 pr-28 py-4 rounded-full text-gray-900 placeholder-gray-400 shadow-lg focus:ring-2 focus:ring-green-300 focus:outline-none"
              />
              <Button
                type="submit"
                disabled={isSearching}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    {language === "th" ? "ค้นหา" : "Search"}
                  </span>
                )}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-3">
                <benefit.icon className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {language === "th" ? benefit.titleTh : benefit.titleEn}
              </h3>
              <p className="text-xs text-gray-500">
                {language === "th" ? benefit.descTh : benefit.descEn}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setIsAISearch(false);
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {language === "th" ? cat.labelTh : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* AI Search Results Badge */}
        {isAISearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <Sparkles className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">
              {language === "th"
                ? `AI พบ ${aiSearchResults.length} โพสต์ที่เกี่ยวข้องกับ "${searchQuery}"`
                : `AI found ${aiSearchResults.length} posts related to "${searchQuery}"`}
            </span>
            <button
              onClick={() => {
                setIsAISearch(false);
                setSearchQuery("");
                fetchPosts();
              }}
              className="ml-auto text-sm text-green-600 hover:text-green-800"
            >
              {language === "th" ? "ล้างค้นหา" : "Clear search"}
            </button>
          </motion.div>
        )}

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-4" />
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : displayPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === "th" ? "ยังไม่มีโพสต์" : "No posts yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === "th"
                ? "เป็นคนแรกที่แบ่งปันความรู้หรือประสบการณ์"
                : "Be the first to share knowledge or experience"}
            </p>
            {session?.user && (
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {language === "th" ? "สร้างโพสต์ใหม่" : "Create New Post"}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {displayPosts.map((post, index) => {
              const CategoryIcon = getCategoryIcon(post.category);
              return (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            post.category === "knowledge"
                              ? "bg-blue-100 text-blue-700"
                              : post.category === "story"
                              ? "bg-purple-100 text-purple-700"
                              : post.category === "question"
                              ? "bg-orange-100 text-orange-700"
                              : post.category === "tip"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            <CategoryIcon className="w-3 h-3" />
                            {language === "th"
                              ? categories.find((c) => c.id === post.category)?.labelTh
                              : categories.find((c) => c.id === post.category)?.labelEn}
                          </span>
                          {post.isVerified && (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <BadgeCheck className="w-4 h-4" />
                              {language === "th" ? "ตรวจสอบแล้ว" : "Verified"}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {post.summary}
                      </p>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {post.authorName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span>{post.authorName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            {post.commentsCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {post.views}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Create Post CTA */}
        {session?.user ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-6 right-6"
          >
            <Button size="lg" className="rounded-full shadow-lg gap-2">
              <Plus className="w-5 h-5" />
              {language === "th" ? "สร้างโพสต์" : "Create Post"}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === "th" ? "เข้าร่วมชุมชน" : "Join the Community"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === "th"
                    ? "เข้าสู่ระบบเพื่อโพสต์ ถูกใจ และแสดงความคิดเห็น"
                    : "Sign in to post, like, and comment"}
                </p>
                <Link href="/login">
                  <Button className="w-full">
                    {language === "th" ? "เข้าสู่ระบบ" : "Sign In"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
