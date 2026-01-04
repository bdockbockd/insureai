import { NextRequest, NextResponse } from "next/server";
import { requestAgentHelp } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const result = await requestAgentHelp(sessionId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Agent has been notified. They will respond soon.",
      });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to request agent" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Request agent error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
