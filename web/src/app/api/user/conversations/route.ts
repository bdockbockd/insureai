import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserConversations } from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const conversations = await getUserConversations(session.user.id);

    return NextResponse.json({
      conversations: conversations.map((conv) => ({
        ...conv,
        _id: conv._id.toString(),
      })),
    });
  } catch (error) {
    console.error("Get user conversations error:", error);
    return NextResponse.json(
      { error: "Failed to get conversations" },
      { status: 500 }
    );
  }
}
