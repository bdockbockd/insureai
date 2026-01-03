"use client";

import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Share2, BookmarkPlus, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { getPostBySlug, getRelatedPosts, BlogPost } from "@/data/blog-posts";
import ReactMarkdown from "react-markdown";

export default function BlogPostPage() {
  const params = useParams();
  const { language } = useLanguage();
  const slug = params.slug as string;

  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post, 3);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert(language === "th" ? "คัดลอกลิงก์แล้ว!" : "Link copied!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Image */}
      <div
        className="h-64 sm:h-80 md:h-96 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${post.coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "th" ? "กลับไปยังบทความทั้งหมด" : "Back to all articles"}
          </Link>
          <span className="inline-block px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full mb-3">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Title and Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {language === "th" && post.titleTh ? post.titleTh : post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                {post.author.avatar}
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.author.name}</p>
                {post.author.role && (
                  <p className="text-sm text-gray-500">{post.author.role}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt).toLocaleDateString(
                language === "th" ? "th-TH" : "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime} {language === "th" ? "นาทีอ่าน" : "min read"}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              {language === "th" ? "แชร์" : "Share"}
            </Button>
            <Button variant="outline" size="sm">
              <BookmarkPlus className="w-4 h-4 mr-2" />
              {language === "th" ? "บันทึก" : "Save"}
            </Button>
          </div>
        </motion.div>

        {/* Excerpt */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 leading-relaxed mb-10 border-l-4 border-blue-500 pl-6"
        >
          {language === "th" && post.excerptTh ? post.excerptTh : post.excerpt}
        </motion.p>

        {/* Main Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 prose-strong:text-gray-900 prose-table:text-sm prose-th:bg-gray-100 prose-th:p-3 prose-td:p-3 prose-td:border prose-th:border"
        >
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold mt-8 mb-3 text-gray-900">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-semibold mt-6 mb-2 text-gray-900">
                  {children}
                </h4>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-gray-600 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-600">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="ml-4">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="bg-gray-100 px-4 py-3 text-left font-semibold text-gray-900 border border-gray-200">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 border border-gray-200 text-gray-600">
                  {children}
                </td>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900">{children}</strong>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {children}
                </a>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.article>

        {/* Sources */}
        {post.sources && post.sources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 pt-6 border-t border-gray-200"
          >
            <h3 className="font-semibold text-gray-900 mb-3">
              {language === "th" ? "แหล่งข้อมูล" : "Sources"}
            </h3>
            <ul className="space-y-2">
              {post.sources.map((source, index) => (
                <li key={index}>
                  <a
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {source}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 pt-10 border-t border-gray-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {language === "th" ? "บทความที่เกี่ยวข้อง" : "Related Articles"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <Card hover className="h-full overflow-hidden">
                    <div
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${relatedPost.coverImage})` }}
                    />
                    <CardContent className="p-4">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-2">
                        {relatedPost.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                        {language === "th" && relatedPost.titleTh
                          ? relatedPost.titleTh
                          : relatedPost.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {relatedPost.readTime}{" "}
                        {language === "th" ? "นาที" : "min"}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-10 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">
            {language === "th"
              ? "พร้อมเริ่มต้นกับประกันที่ใช่?"
              : "Ready to find the right insurance?"}
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            {language === "th"
              ? "ให้ AI ช่วยวิเคราะห์และแนะนำแผนประกันที่เหมาะกับคุณ"
              : "Let our AI analyze and recommend the perfect insurance plan for you"}
          </p>
          <Link href="/wizard">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              {language === "th" ? "เริ่มต้นใช้งาน" : "Get Started"}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
