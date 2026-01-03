"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Edit3,
  Trash2,
  Search,
  Sparkles,
  Languages,
  Globe,
  FileText,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogPosts, BlogPost } from "@/data/blog-posts";
import { AdminProvider, useAdmin } from "@/contexts/admin-context";

function LoginForm() {
  const { login } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(username, password);
    if (!success) {
      setError("Invalid username or password");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Admin Access
            </CardTitle>
            <p className="text-white/60 text-sm mt-2">
              InsureAI Blog Management System
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <Link href="/blog">
                <Button
                  variant="ghost"
                  className="w-full text-white/60 hover:text-white hover:bg-white/10"
                >
                  Back to Blog
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function AdminDashboard() {
  const { logout } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: blogPosts.length,
    health: blogPosts.filter((p) => p.category === "Health Insurance").length,
    life: blogPosts.filter((p) => p.category === "Life Insurance").length,
    withThai: blogPosts.filter((p) => p.titleTh).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Blog Admin
                </h1>
                <p className="text-xs text-gray-500">InsureAI Content Management</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/blog" target="_blank">
                <Button variant="outline" size="sm">
                  <Globe className="w-4 h-4 mr-2" />
                  View Blog
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <p className="text-blue-100 text-sm">Total Posts</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <p className="text-green-100 text-sm">Health Insurance</p>
              <p className="text-3xl font-bold">{stats.health}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <p className="text-purple-100 text-sm">Life Insurance</p>
              <p className="text-3xl font-bold">{stats.life}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <p className="text-orange-100 text-sm">With Thai Content</p>
              <p className="text-3xl font-bold">{stats.withThai}</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setSelectedPost(null);
                setShowEditor(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Posts List */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg">All Posts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-20 h-14 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${post.coverImage})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-1">
                            {post.title}
                          </h3>
                          {post.titleTh && (
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {post.titleTh}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                              {post.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readTime} min
                            </span>
                            {post.contentTh ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <Languages className="w-3 h-3" />
                                TH
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-orange-500">
                                <Languages className="w-3 h-3" />
                                EN only
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPost(post);
                              setShowEditor(true);
                            }}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            onClick={() => {
                              setSelectedPost(post);
                              setShowEditor(true);
                            }}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Editor Modal */}
      {showEditor && (
        <BlogEditor
          post={selectedPost}
          onClose={() => {
            setShowEditor(false);
            setSelectedPost(null);
          }}
        />
      )}
    </div>
  );
}

interface BlogEditorProps {
  post: BlogPost | null;
  onClose: () => void;
}

function BlogEditor({ post, onClose }: BlogEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "ai">("edit");
  const [title, setTitle] = useState(post?.title || "");
  const [titleTh, setTitleTh] = useState(post?.titleTh || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [excerptTh, setExcerptTh] = useState(post?.excerptTh || "");
  const [content, setContent] = useState(post?.content || "");
  const [contentTh, setContentTh] = useState(post?.contentTh || "");
  const [category, setCategory] = useState(post?.category || "Health Insurance");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [language, setLanguage] = useState<"en" | "th">("en");

  const categories = [
    "Health Insurance",
    "Life Insurance",
    "Travel Insurance",
    "Motor Insurance",
    "Industry News",
    "Financial Planning",
    "Tax Planning",
  ];

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiResponse("");

    // Simulate AI response (in production, call Gemini/OpenAI API)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResponse = `Here's the refined content based on your request:

${aiPrompt.includes("translate") ? `
**Thai Translation:**

${title ? `หัวข้อ: ${title.replace(/health/gi, "สุขภาพ").replace(/insurance/gi, "ประกัน")}` : ""}

${excerpt ? `บทสรุป: ${excerpt.substring(0, 100)}...` : ""}

(Full translation would be generated by actual AI API)
` : `
**Improved Content:**

The content has been enhanced with:
- Better readability and flow
- SEO-optimized structure
- Engaging introduction
- Clear call-to-action

(Actual AI-refined content would appear here)
`}`;

    setAiResponse(mockResponse);
    setIsGenerating(false);
  };

  const quickPrompts = [
    { label: "Translate to Thai", prompt: "Translate this content to Thai, maintaining insurance terminology accuracy" },
    { label: "Improve SEO", prompt: "Improve this content for SEO, add relevant keywords naturally" },
    { label: "Make More Engaging", prompt: "Make this content more engaging and easier to read" },
    { label: "Add Examples", prompt: "Add practical examples and scenarios to illustrate the points" },
    { label: "Simplify Language", prompt: "Simplify the language for general audience understanding" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4 flex items-start justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
        >
          {/* Editor Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {post ? "Edit Post" : "Create New Post"}
                </h2>
                <p className="text-white/70 text-sm mt-1">
                  Use AI to help refine and translate your content
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                Close
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setActiveTab("edit")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "edit"
                    ? "bg-white text-blue-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Edit3 className="w-4 h-4 inline mr-2" />
                Editor
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "ai"
                    ? "bg-white text-purple-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                AI Assist
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
            {activeTab === "edit" ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Language Toggle */}
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm text-gray-500">Editing:</span>
                  <button
                    onClick={() => setLanguage("en")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      language === "en"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("th")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      language === "th"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    ภาษาไทย
                  </button>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "en" ? "Title (English)" : "Title (Thai)"}
                  </label>
                  <input
                    type="text"
                    value={language === "en" ? title : titleTh}
                    onChange={(e) =>
                      language === "en"
                        ? setTitle(e.target.value)
                        : setTitleTh(e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={
                      language === "en"
                        ? "Enter post title..."
                        : "ใส่หัวข้อบทความ..."
                    }
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "en" ? "Excerpt (English)" : "Excerpt (Thai)"}
                  </label>
                  <textarea
                    value={language === "en" ? excerpt : excerptTh}
                    onChange={(e) =>
                      language === "en"
                        ? setExcerpt(e.target.value)
                        : setExcerptTh(e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={
                      language === "en"
                        ? "Brief summary of the post..."
                        : "สรุปย่อของบทความ..."
                    }
                  />
                </div>

                {/* Category & Cover Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "en" ? "Content (Markdown)" : "Content (Thai - Markdown)"}
                  </label>
                  <textarea
                    value={language === "en" ? content : contentTh}
                    onChange={(e) =>
                      language === "en"
                        ? setContent(e.target.value)
                        : setContentTh(e.target.value)
                    }
                    rows={15}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder={
                      language === "en"
                        ? "Write your content in Markdown..."
                        : "เขียนเนื้อหาในรูปแบบ Markdown..."
                    }
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    {post ? "Save Changes" : "Publish Post"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Quick Prompts */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quick Actions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setAiPrompt(item.prompt)}
                        className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Prompt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe what you want AI to do
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="E.g., Translate this article to Thai while maintaining accurate insurance terminology..."
                  />
                  <Button
                    onClick={handleAiGenerate}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>

                {/* AI Response */}
                {aiResponse && (
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-900">
                        AI Response
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                      {aiResponse}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Apply to content
                          setActiveTab("edit");
                        }}
                      >
                        Apply to Editor
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setAiResponse("")}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                )}

                {/* Current Content Preview */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Current Content Preview
                  </h4>
                  <div className="max-h-60 overflow-y-auto">
                    <p className="text-sm text-gray-600">
                      <strong>Title:</strong> {title || "(empty)"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Thai Title:</strong> {titleTh || "(not translated)"}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Excerpt:</strong> {excerpt.substring(0, 200) || "(empty)"}...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AdminBlogContent() {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <AdminDashboard />;
}

export default function AdminBlogPage() {
  return (
    <AdminProvider>
      <AdminBlogContent />
    </AdminProvider>
  );
}
