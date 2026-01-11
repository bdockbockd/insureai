// Seed script for community posts
// Run with: npx tsx scripts/seed-community.ts

import { MongoClient } from "mongodb";
import { communityPosts } from "../src/data/community-seed-data-real";

const MONGODB_URI = process.env.MONGODB_URI || "";

async function seedCommunity() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI environment variable is not set");
    console.log("Please set it in .env file or export it:");
    console.log('export MONGODB_URI="mongodb+srv://..."');
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("community_posts");

    // Check existing posts
    const existingCount = await collection.countDocuments();
    console.log(`Existing posts: ${existingCount}`);

    if (existingCount > 0) {
      console.log("Community already has posts. Do you want to:");
      console.log("1. Add new posts (skip existing titles)");
      console.log("2. Clear all and re-seed");
      console.log("\nTo clear all posts, run with --clear flag");

      if (process.argv.includes("--clear")) {
        console.log("\nClearing existing posts...");
        await collection.deleteMany({});
        console.log("Cleared!");
      } else {
        // Skip existing titles
        const existingTitles = await collection.distinct("title");
        const newPosts = communityPosts.filter(
          (post) => !existingTitles.includes(post.title)
        );

        if (newPosts.length === 0) {
          console.log("No new posts to add. All posts already exist.");
          await client.close();
          return;
        }

        console.log(`Adding ${newPosts.length} new posts (skipping ${communityPosts.length - newPosts.length} existing)...`);

        const postsToInsert = newPosts.map((post) => ({
          ...post,
          authorId: "system-seed",
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
          updatedAt: new Date(),
        }));

        const result = await collection.insertMany(postsToInsert);
        console.log(`Inserted ${result.insertedCount} posts`);
        await client.close();
        return;
      }
    }

    // Prepare posts with timestamps
    const postsToInsert = communityPosts.map((post, index) => ({
      ...post,
      authorId: "system-seed",
      // Stagger creation dates over the last 30 days
      createdAt: new Date(
        Date.now() - (communityPosts.length - index) * (24 * 60 * 60 * 1000) / 2
      ),
      updatedAt: new Date(),
    }));

    console.log(`Inserting ${postsToInsert.length} posts...`);
    const result = await collection.insertMany(postsToInsert);
    console.log(`Successfully inserted ${result.insertedCount} posts`);

    // Create indexes
    console.log("Creating indexes...");
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ tags: 1 });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ isPinned: -1, createdAt: -1 });
    await collection.createIndex(
      { title: "text", content: "text", summary: "text", tags: "text" },
      { default_language: "none" }
    );
    console.log("Indexes created");

    // Summary
    const categoryCounts = await collection
      .aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    console.log("\nPosts by category:");
    categoryCounts.forEach((cat) => {
      console.log(`  ${cat._id}: ${cat.count}`);
    });

    const totalPosts = await collection.countDocuments();
    console.log(`\nTotal posts: ${totalPosts}`);
  } catch (error) {
    console.error("Error seeding community:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\nDone!");
  }
}

seedCommunity();
