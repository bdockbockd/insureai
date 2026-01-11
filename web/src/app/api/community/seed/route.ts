import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { communityPosts } from "@/data/community-seed-data-real";

export async function POST(request: NextRequest) {
  try {
    // Simple auth check - require a secret header
    const authHeader = request.headers.get("x-seed-secret");
    if (authHeader !== "seed-insureai-2569") {
      return NextResponse.json(
        { error: "Unauthorized. Include x-seed-secret header." },
        { status: 401 }
      );
    }

    const collection = await getCollection("community_posts");
    if (!collection) {
      return NextResponse.json(
        { error: "Database not connected" },
        { status: 500 }
      );
    }

    // Check existing posts
    const existingCount = await collection.countDocuments();

    // Get query param for clear option
    const { searchParams } = new URL(request.url);
    const clearFirst = searchParams.get("clear") === "true";

    if (clearFirst && existingCount > 0) {
      await collection.deleteMany({});
      console.log("Cleared existing community posts");
    }

    // Get existing titles to avoid duplicates
    const existingTitles = await collection.distinct("title");
    const newPosts = communityPosts.filter(
      (post) => !existingTitles.includes(post.title)
    );

    if (newPosts.length === 0) {
      return NextResponse.json({
        message: "No new posts to add. All posts already exist.",
        existingCount,
        added: 0,
      });
    }

    // Prepare posts with timestamps
    const postsToInsert = newPosts.map((post, index) => ({
      ...post,
      authorId: "system-seed",
      // Stagger creation dates over the last 30 days
      createdAt: new Date(
        Date.now() - (newPosts.length - index) * (12 * 60 * 60 * 1000) // 12 hours apart
      ),
      updatedAt: new Date(),
    }));

    const result = await collection.insertMany(postsToInsert);

    // Create indexes
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ tags: 1 });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ isPinned: -1, createdAt: -1 });

    // Get category counts
    const categoryCounts = await collection
      .aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    const totalPosts = await collection.countDocuments();

    return NextResponse.json({
      message: "Community posts seeded successfully",
      added: result.insertedCount,
      skipped: communityPosts.length - newPosts.length,
      totalPosts,
      categoryCounts: categoryCounts.reduce(
        (acc, cat) => ({ ...acc, [cat._id]: cat.count }),
        {}
      ),
    });
  } catch (error) {
    console.error("Seed community error:", error);
    return NextResponse.json(
      { error: "Failed to seed community posts" },
      { status: 500 }
    );
  }
}

// GET to check status
export async function GET() {
  try {
    const collection = await getCollection("community_posts");
    if (!collection) {
      return NextResponse.json(
        { error: "Database not connected", connected: false },
        { status: 500 }
      );
    }

    const totalPosts = await collection.countDocuments();
    const categoryCounts = await collection
      .aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    return NextResponse.json({
      connected: true,
      totalPosts,
      seedDataCount: communityPosts.length,
      categoryCounts: categoryCounts.reduce(
        (acc, cat) => ({ ...acc, [cat._id]: cat.count }),
        {}
      ),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check status", connected: false },
      { status: 500 }
    );
  }
}
