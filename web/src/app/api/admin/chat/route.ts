import { NextRequest, NextResponse } from "next/server";
import {
  getAgentRequestedConversations,
  getChatConversations,
  adminRespondToConversation,
} from "@/lib/mongodb";

// Get conversations (with optional filter for agent-requested)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");
    const limit = parseInt(searchParams.get("limit") || "50");

    let conversations;
    if (filter === "agent-requested") {
      conversations = await getAgentRequestedConversations(limit);
    } else {
      conversations = await getChatConversations(limit);
    }

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Get conversations error:", error);
    return NextResponse.json(
      { error: "Failed to get conversations" },
      { status: 500 }
    );
  }
}

// Admin responds to a conversation
export async function POST(request: NextRequest) {
  try {
    const { sessionId, response } = await request.json();

    if (!sessionId || !response) {
      return NextResponse.json(
        { error: "Session ID and response are required" },
        { status: 400 }
      );
    }

    const result = await adminRespondToConversation(sessionId, response);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Response sent successfully",
      });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to send response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Admin respond error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
