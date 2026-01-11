import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCommunityPostById, likeCommunityPost, addCommunityComment, getPostComments } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await getCommunityPostById(id);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Get comments - first check embedded comments in post, then fallback to collection
    let comments = post.comments || [];

    // If no embedded comments, try the separate collection
    if (comments.length === 0) {
      const collectionComments = await getPostComments(id);
      comments = collectionComments.map((c) => ({
        ...c,
        _id: c._id?.toString(),
      }));
    }

    return NextResponse.json({
      post: {
        ...post,
        _id: post._id?.toString(),
      },
      comments,
    });
  } catch (error) {
    console.error("Get community post error:", error);
    return NextResponse.json(
      { error: "Failed to get post" },
      { status: 500 }
    );
  }
}
