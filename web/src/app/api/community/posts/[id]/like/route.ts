import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { likeCommunityPost } from "@/lib/mongodb";

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

    const result = await likeCommunityPost(id, session.user.id);

    return NextResponse.json({
      success: result.success,
      liked: result.liked ?? false,
    });
  } catch (error) {
    console.error("Like post error:", error);
    return NextResponse.json(
      { error: "Failed to like post" },
      { status: 500 }
    );
  }
}
