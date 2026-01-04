import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addCommunityComment } from "@/lib/mongodb";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    const commentId = await addCommunityComment({
      postId: id,
      authorId: session.user.id,
      authorName: session.user.name || "Anonymous",
      authorImage: session.user.image || undefined,
      content: content.trim(),
      isExpert: false, // Regular users are not experts by default
    });

    return NextResponse.json({
      success: true,
      commentId,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
