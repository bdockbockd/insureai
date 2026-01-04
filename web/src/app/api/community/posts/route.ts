import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCommunityPosts, createCommunityPost, searchCommunityForAI } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as "knowledge" | "story" | "question" | "tip" | "news" | undefined;
    const search = searchParams.get("search") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const aiSearch = searchParams.get("aiSearch") === "true";

    // If AI search mode, use the optimized search function
    if (aiSearch && search) {
      const results = await searchCommunityForAI(search, limit);
      return NextResponse.json({ posts: results, isAISearch: true });
    }

    const result = await getCommunityPosts({
      category: category || undefined,
      search,
      limit,
      offset,
    });

    return NextResponse.json({
      posts: result.posts.map((post) => ({
        ...post,
        _id: (post as { _id?: { toString(): string } })._id?.toString(),
      })),
      total: result.total,
    });
  } catch (error) {
    console.error("Get community posts error:", error);
    return NextResponse.json(
      { error: "Failed to get community posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, summary, category, tags } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, category" },
        { status: 400 }
      );
    }

    const postId = await createCommunityPost({
      title,
      content,
      summary: summary || content.substring(0, 200),
      category,
      tags: tags || [],
      authorId: session.user.id,
      authorName: session.user.name || "Anonymous",
      authorImage: session.user.image || undefined,
      isVerified: false,
      isPinned: false,
    });

    return NextResponse.json({ success: true, postId });
  } catch (error) {
    console.error("Create community post error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
