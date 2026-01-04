import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  console.warn("MONGODB_URI not found. Using in-memory storage.");
}

const uri = process.env.MONGODB_URI || "";
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export async function getDatabase(): Promise<Db | null> {
  if (!clientPromise) {
    console.warn("MongoDB not connected. Using in-memory storage.");
    return null;
  }

  try {
    const client = await clientPromise;
    return client.db("insureai");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return null;
  }
}

export async function getCollection(name: string) {
  const db = await getDatabase();
  if (!db) return null;
  return db.collection(name);
}

// Lead operations
export async function createLead(lead: {
  fullName: string;
  email?: string;
  phone?: string;
  lineId?: string;
  preferredContact: string;
  source: string;
  userProfile?: object;
}) {
  const collection = await getCollection("leads");
  if (!collection) {
    // Fallback to in-memory storage or return mock success
    console.log("Lead captured (in-memory):", lead);
    return { insertedId: `mock_${Date.now()}` };
  }

  const result = await collection.insertOne({
    ...lead,
    createdAt: new Date(),
    status: "new",
  });

  return result;
}

export async function getLeads(limit: number = 100) {
  const collection = await getCollection("leads");
  if (!collection) {
    return [];
  }

  return collection
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

// Blog operations
export async function getBlogPosts(limit: number = 20) {
  const collection = await getCollection("blog_posts");
  if (!collection) {
    return [];
  }

  return collection
    .find({ published: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getBlogPostBySlug(slug: string) {
  const collection = await getCollection("blog_posts");
  if (!collection) {
    return null;
  }

  return collection.findOne({ slug, published: true });
}

// Insurance plans operations
export async function getInsurancePlans(filters?: {
  type?: string;
  minBudget?: number;
  maxBudget?: number;
  age?: number;
}) {
  const collection = await getCollection("insurance_plans");
  if (!collection) {
    return [];
  }

  const query: Record<string, unknown> = { active: true };

  if (filters?.type) {
    query.type = filters.type;
  }

  if (filters?.minBudget !== undefined || filters?.maxBudget !== undefined) {
    query["premium.monthly"] = {};
    if (filters?.minBudget !== undefined) {
      (query["premium.monthly"] as Record<string, number>).$gte = filters.minBudget;
    }
    if (filters?.maxBudget !== undefined) {
      (query["premium.monthly"] as Record<string, number>).$lte = filters.maxBudget;
    }
  }

  if (filters?.age !== undefined) {
    query["eligibility.minAge"] = { $lte: filters.age };
    query["eligibility.maxAge"] = { $gte: filters.age };
  }

  return collection.find(query).sort({ rating: -1 }).toArray();
}

// Chat conversation operations
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatConversation {
  sessionId: string;
  userId?: string; // Linked to authenticated user
  messages: ChatMessage[];
  planId?: string;
  planName?: string;
  // CTA tracking
  ctaTriggered?: boolean;
  ctaReason?: string;
  agentRequested?: boolean;
  agentRequestedAt?: Date;
  // Admin response tracking
  adminResponded?: boolean;
  adminRespondedAt?: Date;
  adminResponse?: string;
  metadata: {
    ip?: string;
    country?: string;
    city?: string;
    userAgent?: string;
    language?: string;
    model?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export async function logChatConversation(data: {
  sessionId: string;
  userId?: string;
  userMessage: string;
  assistantResponse: string;
  planId?: string;
  planName?: string;
  shouldTriggerCta?: boolean;
  ctaReason?: string;
  reasoning?: string;
  metadata: {
    ip?: string;
    country?: string;
    city?: string;
    userAgent?: string;
    language?: string;
    model?: string;
  };
}) {
  const collection = await getCollection("chat_conversations");
  if (!collection) {
    console.log("Chat logged (in-memory):", data.sessionId);
    return null;
  }

  const now = new Date();

  // Try to find existing conversation by sessionId
  const existing = await collection.findOne({ sessionId: data.sessionId });

  if (existing) {
    // Append to existing conversation
    const updateData: Record<string, unknown> = {
      updatedAt: now,
      "metadata.model": data.metadata.model,
    };

    // Update CTA trigger status if this message triggered it
    if (data.shouldTriggerCta) {
      updateData.ctaTriggered = true;
      updateData.ctaReason = data.ctaReason;
    }

    await collection.updateOne(
      { sessionId: data.sessionId },
      {
        $push: {
          messages: {
            $each: [
              { role: "user", content: data.userMessage, timestamp: now },
              {
                role: "assistant",
                content: data.assistantResponse,
                timestamp: now,
                ctaTriggered: data.shouldTriggerCta,
                ctaReason: data.ctaReason,
                reasoning: data.reasoning,
              },
            ],
          },
        } as any,
        $set: updateData,
      }
    );
  } else {
    // Create new conversation
    await collection.insertOne({
      sessionId: data.sessionId,
      userId: data.userId,
      messages: [
        { role: "user", content: data.userMessage, timestamp: now },
        {
          role: "assistant",
          content: data.assistantResponse,
          timestamp: now,
          ctaTriggered: data.shouldTriggerCta,
          ctaReason: data.ctaReason,
          reasoning: data.reasoning,
        },
      ],
      planId: data.planId,
      planName: data.planName,
      ctaTriggered: data.shouldTriggerCta,
      ctaReason: data.ctaReason,
      metadata: data.metadata,
      createdAt: now,
      updatedAt: now,
    });
  }

  return { success: true };
}

// Request agent help for a conversation
export async function requestAgentHelp(sessionId: string) {
  const collection = await getCollection("chat_conversations");
  if (!collection) {
    return { success: false, error: "MongoDB not connected" };
  }

  const result = await collection.updateOne(
    { sessionId },
    {
      $set: {
        agentRequested: true,
        agentRequestedAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );

  return { success: result.modifiedCount > 0 };
}

// Get conversations that need agent attention
export async function getAgentRequestedConversations(limit: number = 50) {
  const collection = await getCollection("chat_conversations");
  if (!collection) {
    return [];
  }

  return collection
    .find({ agentRequested: true, adminResponded: { $ne: true } })
    .sort({ agentRequestedAt: -1 })
    .limit(limit)
    .toArray();
}

// Admin responds to a conversation
export async function adminRespondToConversation(sessionId: string, response: string) {
  const collection = await getCollection("chat_conversations");
  if (!collection) {
    return { success: false, error: "MongoDB not connected" };
  }

  const now = new Date();

  const result = await collection.updateOne(
    { sessionId },
    {
      $set: {
        adminResponded: true,
        adminRespondedAt: now,
        adminResponse: response,
        updatedAt: now,
      },
      $push: {
        messages: {
          role: "admin",
          content: response,
          timestamp: now,
        },
      } as any,
    }
  );

  return { success: result.modifiedCount > 0 };
}

export async function getChatConversations(limit: number = 100) {
  const collection = await getCollection("chat_conversations");
  if (!collection) {
    return [];
  }

  return collection
    .find({})
    .sort({ updatedAt: -1 })
    .limit(limit)
    .toArray();
}

// Get conversations for a specific user
export async function getUserConversations(userId: string, limit: number = 50) {
  const collection = await getCollection("chat_conversations");
  if (!collection) {
    return [];
  }

  return collection
    .find({ userId })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .toArray();
}

// Get a specific conversation by sessionId
export async function getConversationBySessionId(sessionId: string) {
  const collection = await getCollection("chat_conversations");
  if (!collection) {
    return null;
  }

  return collection.findOne({ sessionId });
}

// Link a conversation to a user (when user logs in after starting a conversation)
export async function linkConversationToUser(sessionId: string, userId: string) {
  const collection = await getCollection("chat_conversations");
  if (!collection) {
    return { success: false, error: "MongoDB not connected" };
  }

  const result = await collection.updateOne(
    { sessionId },
    { $set: { userId, updatedAt: new Date() } }
  );

  return { success: result.modifiedCount > 0 };
}

export async function getChatStats() {
  const collection = await getCollection("chat_conversations");
  if (!collection) {
    return null;
  }

  const totalConversations = await collection.countDocuments();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayConversations = await collection.countDocuments({
    createdAt: { $gte: today },
  });

  // Get top questions (aggregate by first user message)
  const topQuestions = await collection
    .aggregate([
      { $unwind: "$messages" },
      { $match: { "messages.role": "user" } },
      { $group: { _id: "$messages.content", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])
    .toArray();

  return {
    totalConversations,
    todayConversations,
    topQuestions,
  };
}

// ==================== IP-Based Rate Limiting ====================
const FREE_CHAT_LIMIT = 3; // Number of free chats for guests

export interface GuestUsage {
  ip: string;
  chatCount: number;
  firstChatAt: Date;
  lastChatAt: Date;
  metadata?: {
    country?: string;
    city?: string;
    userAgent?: string;
  };
}

// Check if IP has remaining free chats
export async function checkGuestRateLimit(ip: string): Promise<{
  allowed: boolean;
  remaining: number;
  total: number;
}> {
  const collection = await getCollection("guest_usage");
  if (!collection) {
    // If no DB, allow usage
    return { allowed: true, remaining: FREE_CHAT_LIMIT, total: FREE_CHAT_LIMIT };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find usage for this IP today
  const usage = await collection.findOne({
    ip,
    firstChatAt: { $gte: today },
  });

  if (!usage) {
    return { allowed: true, remaining: FREE_CHAT_LIMIT, total: FREE_CHAT_LIMIT };
  }

  const remaining = Math.max(0, FREE_CHAT_LIMIT - usage.chatCount);
  return {
    allowed: remaining > 0,
    remaining,
    total: FREE_CHAT_LIMIT,
  };
}

// Increment guest chat count
export async function incrementGuestUsage(
  ip: string,
  metadata?: { country?: string; city?: string; userAgent?: string }
): Promise<{ chatCount: number }> {
  const collection = await getCollection("guest_usage");
  if (!collection) {
    return { chatCount: 1 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const now = new Date();

  // Try to update existing record for today
  const result = await collection.findOneAndUpdate(
    {
      ip,
      firstChatAt: { $gte: today },
    },
    {
      $inc: { chatCount: 1 },
      $set: { lastChatAt: now, metadata },
    },
    { returnDocument: "after" }
  );

  if (result) {
    return { chatCount: result.chatCount };
  }

  // Create new record for today
  await collection.insertOne({
    ip,
    chatCount: 1,
    firstChatAt: now,
    lastChatAt: now,
    metadata,
  });

  return { chatCount: 1 };
}

// ==================== Community Posts ====================
export interface CommunityPost {
  _id?: string;
  title: string;
  content: string;
  summary: string;
  category: "knowledge" | "story" | "question" | "tip" | "news";
  tags: string[];
  authorId?: string;
  authorName: string;
  authorImage?: string;
  likes: number;
  views: number;
  commentsCount: number;
  isVerified: boolean; // Expert-verified post
  isPinned: boolean;
  relatedBlogSlugs?: string[]; // Links to related blog posts
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityComment {
  _id?: string;
  postId: string;
  content: string;
  authorId?: string;
  authorName: string;
  authorImage?: string;
  isExpert: boolean;
  likes: number;
  createdAt: Date;
}

// Get community posts with filters
export async function getCommunityPosts(options: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: "recent" | "popular" | "trending";
}) {
  const collection = await getCollection("community_posts");
  if (!collection) {
    return { posts: [], total: 0 };
  }

  const query: Record<string, unknown> = {};

  if (options.category && options.category !== "all") {
    query.category = options.category;
  }

  if (options.search) {
    query.$or = [
      { title: { $regex: options.search, $options: "i" } },
      { content: { $regex: options.search, $options: "i" } },
      { tags: { $in: [new RegExp(options.search, "i")] } },
    ];
  }

  let sortField: Record<string, 1 | -1> = { createdAt: -1 };
  if (options.sortBy === "popular") {
    sortField = { likes: -1, views: -1 };
  } else if (options.sortBy === "trending") {
    // Trending = recent + popular
    sortField = { views: -1, createdAt: -1 };
  }

  const limit = options.limit || 20;
  const offset = options.offset || 0;

  const [posts, total] = await Promise.all([
    collection
      .find(query)
      .sort({ isPinned: -1, ...sortField })
      .skip(offset)
      .limit(limit)
      .toArray(),
    collection.countDocuments(query),
  ]);

  return { posts, total };
}

// Create a community post
export async function createCommunityPost(
  post: Omit<CommunityPost, "_id" | "createdAt" | "updatedAt" | "likes" | "views" | "commentsCount">
) {
  const collection = await getCollection("community_posts");
  if (!collection) {
    return { success: false, error: "Database not connected" };
  }

  const now = new Date();
  const result = await collection.insertOne({
    ...post,
    likes: 0,
    views: 0,
    commentsCount: 0,
    createdAt: now,
    updatedAt: now,
  });

  return { success: true, postId: result.insertedId.toString() };
}

// Get single post and increment views
export async function getCommunityPostById(postId: string) {
  const collection = await getCollection("community_posts");
  if (!collection) {
    return null;
  }

  const { ObjectId } = await import("mongodb");

  // Increment view count
  await collection.updateOne(
    { _id: new ObjectId(postId) },
    { $inc: { views: 1 } }
  );

  return collection.findOne({ _id: new ObjectId(postId) });
}

// Like a post
export async function likeCommunityPost(postId: string, userId: string) {
  const likesCollection = await getCollection("community_likes");
  const postsCollection = await getCollection("community_posts");
  if (!likesCollection || !postsCollection) {
    return { success: false };
  }

  const { ObjectId } = await import("mongodb");

  // Check if already liked
  const existingLike = await likesCollection.findOne({
    postId,
    userId,
  });

  if (existingLike) {
    // Unlike
    await likesCollection.deleteOne({ postId, userId });
    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $inc: { likes: -1 } }
    );
    return { success: true, liked: false };
  }

  // Like
  await likesCollection.insertOne({
    postId,
    userId,
    createdAt: new Date(),
  });
  await postsCollection.updateOne(
    { _id: new ObjectId(postId) },
    { $inc: { likes: 1 } }
  );

  return { success: true, liked: true };
}

// Add comment to post
export async function addCommunityComment(comment: Omit<CommunityComment, "_id" | "createdAt" | "likes">) {
  const commentsCollection = await getCollection("community_comments");
  const postsCollection = await getCollection("community_posts");
  if (!commentsCollection || !postsCollection) {
    return { success: false };
  }

  const { ObjectId } = await import("mongodb");

  await commentsCollection.insertOne({
    ...comment,
    likes: 0,
    createdAt: new Date(),
  });

  await postsCollection.updateOne(
    { _id: new ObjectId(comment.postId) },
    { $inc: { commentsCount: 1 } }
  );

  return { success: true };
}

// Get comments for a post
export async function getPostComments(postId: string) {
  const collection = await getCollection("community_comments");
  if (!collection) {
    return [];
  }

  return collection
    .find({ postId })
    .sort({ createdAt: -1 })
    .toArray();
}

// Search posts with AI context (for AI to reference)
export async function searchCommunityForAI(query: string, limit: number = 5) {
  const collection = await getCollection("community_posts");
  if (!collection) {
    return [];
  }

  // Search in title, content, and tags
  const posts = await collection
    .find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
      isVerified: true, // Only return verified posts for AI
    })
    .sort({ likes: -1, views: -1 })
    .limit(limit)
    .toArray();

  return posts.map((p) => ({
    title: p.title,
    summary: p.summary,
    category: p.category,
    authorName: p.authorName,
    isVerified: p.isVerified,
  }));
}

export default clientPromise;
