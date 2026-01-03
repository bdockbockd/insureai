import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { insurancePlans, getPlanById } from "@/data/plans-config";

// Get the markdown directory path (outside web folder)
function getMarkdownBasePath(): string {
  // In development, the markdown files are in the parent directory
  return path.join(process.cwd(), "..", "data", "markdown");
}

// GET - List all plans with their markdown content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId");

    // If a specific plan is requested
    if (planId) {
      const plan = getPlanById(planId);
      if (!plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
      }

      // Build the markdown file path
      const markdownPath = path.join(
        getMarkdownBasePath(),
        plan.markdown_path.replace(/^\/data\/markdown\//, "")
      );

      let content = "";
      let exists = false;

      try {
        content = await fs.readFile(markdownPath, "utf-8");
        exists = true;
      } catch {
        exists = false;
      }

      return NextResponse.json({
        plan,
        markdown: {
          path: markdownPath,
          content,
          exists,
        },
      });
    }

    // List all plans with markdown status
    const plansWithStatus = await Promise.all(
      insurancePlans.map(async (plan) => {
        const markdownPath = path.join(
          getMarkdownBasePath(),
          plan.markdown_path.replace(/^\/data\/markdown\//, "")
        );

        let exists = false;
        let wordCount = 0;
        let lastModified: string | null = null;

        try {
          const content = await fs.readFile(markdownPath, "utf-8");
          exists = true;
          wordCount = content.split(/\s+/).length;
          const stats = await fs.stat(markdownPath);
          lastModified = stats.mtime.toISOString();
        } catch {
          exists = false;
        }

        return {
          ...plan,
          markdown_status: {
            exists,
            wordCount,
            lastModified,
            path: markdownPath,
          },
        };
      })
    );

    return NextResponse.json({ plans: plansWithStatus });
  } catch (error) {
    console.error("Error reading plans:", error);
    return NextResponse.json(
      { error: "Failed to read plans" },
      { status: 500 }
    );
  }
}

// PUT - Update markdown content for a plan
export async function PUT(request: NextRequest) {
  try {
    const { planId, content } = await request.json();

    if (!planId || content === undefined) {
      return NextResponse.json(
        { error: "planId and content are required" },
        { status: 400 }
      );
    }

    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const markdownPath = path.join(
      getMarkdownBasePath(),
      plan.markdown_path.replace(/^\/data\/markdown\//, "")
    );

    // Ensure directory exists
    const dir = path.dirname(markdownPath);
    await fs.mkdir(dir, { recursive: true });

    // Write the file
    await fs.writeFile(markdownPath, content, "utf-8");

    return NextResponse.json({
      success: true,
      message: "Markdown updated successfully",
      path: markdownPath,
    });
  } catch (error) {
    console.error("Error updating markdown:", error);
    return NextResponse.json(
      { error: "Failed to update markdown" },
      { status: 500 }
    );
  }
}
