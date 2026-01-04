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
  messages: ChatMessage[];
  planId?: string;
  planName?: string;
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
  userMessage: string;
  assistantResponse: string;
  planId?: string;
  planName?: string;
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
    await collection.updateOne(
      { sessionId: data.sessionId },
      {
        $push: {
          messages: {
            $each: [
              { role: "user", content: data.userMessage, timestamp: now },
              { role: "assistant", content: data.assistantResponse, timestamp: now },
            ],
          },
        } as any,
        $set: {
          updatedAt: now,
          "metadata.model": data.metadata.model,
        },
      }
    );
  } else {
    // Create new conversation
    await collection.insertOne({
      sessionId: data.sessionId,
      messages: [
        { role: "user", content: data.userMessage, timestamp: now },
        { role: "assistant", content: data.assistantResponse, timestamp: now },
      ],
      planId: data.planId,
      planName: data.planName,
      metadata: data.metadata,
      createdAt: now,
      updatedAt: now,
    });
  }

  return { success: true };
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

export default clientPromise;
