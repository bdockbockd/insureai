"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: "1",
    slug: "health-insurance-guide-thailand-2026",
    title: "Complete Guide to Health Insurance in Thailand 2026",
    excerpt: "Everything you need to know about health insurance in Thailand - from government schemes to private coverage options for expats and locals.",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    category: "Health Insurance",
    tags: ["Thailand", "Health", "Guide"],
    author: {
      name: "Dr. Somchai Prasert",
      avatar: "SP",
    },
    publishedAt: "2026-01-02",
    readTime: 8,
    featured: true,
  },
  {
    id: "2",
    slug: "allianz-bdms-partnership-2026",
    title: "Allianz x BDMS: New Health Insurance Partnership",
    excerpt: "Allianz Ayudhya partners with Bangkok Dusit Medical Services to offer enhanced health coverage for working professionals.",
    coverImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    category: "News",
    tags: ["Allianz", "BDMS", "Partnership"],
    author: {
      name: "InsureAI Team",
      avatar: "IA",
    },
    publishedAt: "2025-12-28",
    readTime: 5,
  },
  {
    id: "3",
    slug: "critical-illness-coverage-young-adults",
    title: "Why Young Adults Need Critical Illness Coverage",
    excerpt: "Think you're too young for critical illness insurance? Here's why millennials and Gen Z should consider it now.",
    coverImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
    category: "Life Insurance",
    tags: ["Critical Illness", "Young Adults", "Prevention"],
    author: {
      name: "Nattaya Suthikul",
      avatar: "NS",
    },
    publishedAt: "2025-12-20",
    readTime: 6,
  },
  {
    id: "4",
    slug: "ai-insurance-industry-transformation",
    title: "How AI is Transforming the Insurance Industry",
    excerpt: "From claims processing to personalized recommendations - discover how artificial intelligence is revolutionizing insurance.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    category: "Technology",
    tags: ["AI", "InsurTech", "Innovation"],
    author: {
      name: "InsureAI Team",
      avatar: "IA",
    },
    publishedAt: "2025-12-15",
    readTime: 7,
  },
  {
    id: "5",
    slug: "family-protection-planning-guide",
    title: "Family Protection Planning: A Complete Guide",
    excerpt: "Secure your family's financial future with proper insurance planning. Learn how to choose the right coverage for your loved ones.",
    coverImage: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80",
    category: "Family Planning",
    tags: ["Family", "Life Insurance", "Financial Planning"],
    author: {
      name: "Dr. Somchai Prasert",
      avatar: "SP",
    },
    publishedAt: "2025-12-10",
    readTime: 10,
  },
  {
    id: "6",
    slug: "expat-insurance-guide-southeast-asia",
    title: "Expat Insurance Guide: Southeast Asia Edition",
    excerpt: "Moving to Thailand, Singapore, or Vietnam? Here's everything expats need to know about health and life insurance in SEA.",
    coverImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80",
    category: "Expat Guide",
    tags: ["Expat", "Southeast Asia", "International"],
    author: {
      name: "Michael Thompson",
      avatar: "MT",
    },
    publishedAt: "2025-12-05",
    readTime: 9,
  },
];

const categories = [
  "All",
  "Health Insurance",
  "Life Insurance",
  "News",
  "Technology",
  "Family Planning",
  "Expat Guide",
];

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            Insurance Insights Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 max-w-2xl mx-auto"
          >
            Expert advice, industry news, and tips to help you make better insurance decisions.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link href={`/blog/${featuredPost.slug}`}>
              <Card hover className="overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div
                    className="h-64 md:h-auto bg-cover bg-center"
                    style={{ backgroundImage: `url(${featuredPost.coverImage})` }}
                  />
                  <CardContent className="p-5 sm:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        Featured
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        {featuredPost.category}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                          {featuredPost.author.avatar}
                        </div>
                        <span>{featuredPost.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime} min read
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </motion.div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card hover className="h-full overflow-hidden">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.coverImage})` }}
                  />
                  <CardContent className="p-5">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-3">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-semibold">
                          {post.author.avatar}
                        </div>
                        <span>{post.author.name}</span>
                      </div>
                      <span>{post.readTime} min read</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Load More Articles
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-3">Stay Updated</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Get the latest insurance tips, news, and exclusive offers delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
