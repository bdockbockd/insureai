"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { blogPosts, categories, getFeaturedPost, getPostsByCategory } from "@/data/blog-posts";

const categoryKeys = [
  { key: "blog.all", value: "All" },
  { key: "blog.healthInsurance", value: "Health Insurance" },
  { key: "blog.lifeInsurance", value: "Life Insurance" },
  { key: "blog.travelInsurance", value: "Travel Insurance" },
  { key: "blog.motorInsurance", value: "Motor Insurance" },
  { key: "blog.education", value: "Education" },
  { key: "blog.financialPlanning", value: "Financial Planning" },
  { key: "blog.technology", value: "Technology" },
  { key: "blog.expatGuide", value: "Expat Guide" },
  { key: "blog.news", value: "News" },
];

export default function BlogPage() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visiblePosts, setVisiblePosts] = useState(9);

  const featuredPost = getFeaturedPost();

  // Filter posts by category and search
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch && !post.featured;
  });

  const regularPosts = filteredPosts.slice(0, visiblePosts);
  const hasMorePosts = filteredPosts.length > visiblePosts;

  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + 6);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisiblePosts(9);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-5"
          >
            {t("blog.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            {t("blog.subtitle")}
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={language === "th" ? "ค้นหาบทความ..." : "Search articles..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categoryKeys.map((category) => (
              <button
                key={category.key}
                onClick={() => handleCategoryChange(category.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border"
                }`}
              >
                {t(category.key)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 mb-6"
        >
          {filteredPosts.length + (featuredPost && selectedCategory === "All" && !searchQuery ? 1 : 0)} {language === "th" ? "บทความ" : "articles"} {selectedCategory !== "All" && `in ${selectedCategory}`}
        </motion.p>

        {/* Featured Post - Show only on All category with no search */}
        {featuredPost && selectedCategory === "All" && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-14"
          >
            <Link href={`/blog/${featuredPost.slug}`}>
              <Card hover className="overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div
                    className="h-64 md:h-auto bg-cover bg-center"
                    style={{ backgroundImage: `url(${featuredPost.coverImage})` }}
                  />
                  <CardContent className="p-6 sm:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        {t("blog.featured")}
                      </span>
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full">
                        {featuredPost.category}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 mb-5 leading-relaxed">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-5 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                          {featuredPost.author.avatar}
                        </div>
                        <span>{featuredPost.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(featuredPost.publishedAt).toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime} {t("blog.minRead")}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </motion.div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {regularPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-2 sm:mb-0"
            >
              <Link href={`/blog/${post.slug}`}>
                <Card hover className="h-full overflow-hidden shadow-md">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.coverImage})` }}
                  />
                  <CardContent className="p-6">
                    <span className="inline-block px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full mb-4">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-semibold">
                          {post.author.avatar}
                        </div>
                        <span>{post.author.name}</span>
                      </div>
                      <span>{post.readTime} {t("blog.minRead")}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {hasMorePosts && (
          <div className="text-center mt-16 mb-8">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto py-3 px-8"
              onClick={handleLoadMore}
            >
              {t("blog.loadMore")} ({filteredPosts.length - visiblePosts} {language === "th" ? "เหลืออีก" : "more"})
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-500 text-lg">
              {language === "th"
                ? "ไม่พบบทความที่ตรงกับการค้นหา"
                : "No articles found matching your criteria"}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
            >
              {language === "th" ? "ล้างตัวกรอง" : "Clear filters"}
            </Button>
          </motion.div>
        )}

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-10 sm:p-14 text-center text-white"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t("blog.stayUpdated")}</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto leading-relaxed">
            {t("blog.newsletterText")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t("blog.enterEmail")}
              className="w-full px-5 py-3.5 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 py-3">
              {t("common.subscribe")}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
