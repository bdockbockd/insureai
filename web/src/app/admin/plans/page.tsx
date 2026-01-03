"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Lock,
  Eye,
  EyeOff,
  LogOut,
  FileText,
  Check,
  X,
  Search,
  Edit3,
  Save,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminProvider, useAdmin } from "@/contexts/admin-context";
import { planCategories, type InsurancePlan } from "@/data/plans-config";
import ReactMarkdown from "react-markdown";

interface PlanWithStatus extends InsurancePlan {
  markdown_status: {
    exists: boolean;
    wordCount: number;
    lastModified: string | null;
    path: string;
  };
}

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
              InsureAI Plan Management System
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
              <Link href="/admin/blog">
                <Button
                  variant="ghost"
                  className="w-full text-white/60 hover:text-white hover:bg-white/10"
                >
                  Go to Blog Admin
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function PlansDashboard() {
  const { logout } = useAdmin();
  const [plans, setPlans] = useState<PlanWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    planCategories.map((c) => c.id)
  );
  const [selectedPlan, setSelectedPlan] = useState<PlanWithStatus | null>(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/plans");
      const data = await response.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlanMarkdown = async (planId: string) => {
    try {
      const response = await fetch(`/api/admin/plans?planId=${planId}`);
      const data = await response.json();
      setMarkdownContent(data.markdown?.content || "");
    } catch (error) {
      console.error("Failed to fetch markdown:", error);
      setMarkdownContent("");
    }
  };

  const handleSelectPlan = async (plan: PlanWithStatus) => {
    setSelectedPlan(plan);
    setIsEditing(false);
    await fetchPlanMarkdown(plan.id);
  };

  const handleSave = async () => {
    if (!selectedPlan) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          content: markdownContent,
        }),
      });
      if (response.ok) {
        setIsEditing(false);
        await fetchPlans();
      }
    } catch (error) {
      console.error("Failed to save:", error);
    }
    setIsSaving(false);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredCategories = planCategories.map((category) => ({
    ...category,
    plans: plans.filter(
      (plan) =>
        plan.category === category.id &&
        (plan.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plan.name_th.includes(searchQuery))
    ),
  }));

  const stats = {
    total: plans.length,
    withMarkdown: plans.filter((p) => p.markdown_status?.exists).length,
    totalWords: plans.reduce(
      (acc, p) => acc + (p.markdown_status?.wordCount || 0),
      0
    ),
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
                  Plan Documents
                </h1>
                <p className="text-xs text-gray-500">
                  InsureAI Markdown Management
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/admin/blog">
                <Button variant="outline" size="sm">
                  Blog Admin
                </Button>
              </Link>
              <Link href="/ai-assist" target="_blank">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  AI Assist
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
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <p className="text-blue-100 text-sm">Total Plans</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <p className="text-green-100 text-sm">With Markdown</p>
              <p className="text-3xl font-bold">{stats.withMarkdown}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <p className="text-purple-100 text-sm">Total Words</p>
              <p className="text-3xl font-bold">
                {stats.totalWords.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plans List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="border-b py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Insurance Plans</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchPlans}
                    disabled={isLoading}
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Search */}
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search plans..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="max-h-[600px] overflow-y-auto">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="border-b last:border-b-0">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-md bg-gradient-to-br ${category.color} flex items-center justify-center`}
                          >
                            <span className="text-white text-xs font-bold">
                              {category.plans.length}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 text-sm">
                            {category.name_en}
                          </span>
                        </div>
                        {expandedCategories.includes(category.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>

                      {expandedCategories.includes(category.id) && (
                        <div className="bg-gray-50 py-1">
                          {category.plans.map((plan) => (
                            <button
                              key={plan.id}
                              onClick={() => handleSelectPlan(plan)}
                              className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors ${
                                selectedPlan?.id === plan.id
                                  ? "bg-blue-100 border-l-4 border-blue-500"
                                  : ""
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 text-sm truncate">
                                    {plan.short_name_en}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {plan.name_en}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  {plan.markdown_status?.exists ? (
                                    <span className="flex items-center gap-1 text-green-600">
                                      <Check className="w-3.5 h-3.5" />
                                      <span className="text-xs">
                                        {plan.markdown_status.wordCount}w
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-orange-500">
                                      <AlertCircle className="w-3.5 h-3.5" />
                                      <span className="text-xs">Missing</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Markdown Editor/Preview */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              {selectedPlan ? (
                <>
                  <CardHeader className="border-b py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {selectedPlan.name_en}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {selectedPlan.name_th}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Toggle buttons */}
                        <div className="flex border rounded-lg overflow-hidden">
                          <button
                            onClick={() => setShowPreview(true)}
                            className={`px-3 py-1.5 text-sm ${
                              showPreview
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => {
                              setShowPreview(false);
                              setIsEditing(true);
                            }}
                            className={`px-3 py-1.5 text-sm ${
                              !showPreview
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            Edit
                          </button>
                        </div>

                        {isEditing && (
                          <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isSaving ? (
                              <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                              <Save className="w-4 h-4 mr-1" />
                            )}
                            Save
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {showPreview ? (
                      <div className="p-6 max-h-[700px] overflow-y-auto">
                        {markdownContent ? (
                          <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-table:text-sm">
                            <ReactMarkdown>{markdownContent}</ReactMarkdown>
                          </div>
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No markdown content yet</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4"
                              onClick={() => {
                                setShowPreview(false);
                                setIsEditing(true);
                              }}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Create Content
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <textarea
                        value={markdownContent}
                        onChange={(e) => setMarkdownContent(e.target.value)}
                        className="w-full h-[700px] p-6 font-mono text-sm border-0 focus:outline-none focus:ring-0 resize-none"
                        placeholder="# Plan Title&#10;&#10;Write your markdown content here..."
                      />
                    )}
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-[600px] text-gray-500">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">Select a plan</p>
                    <p className="text-sm">
                      Choose a plan from the list to view or edit its markdown
                      content
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminPlansContent() {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <PlansDashboard />;
}

export default function AdminPlansPage() {
  return (
    <AdminProvider>
      <AdminPlansContent />
    </AdminProvider>
  );
}
