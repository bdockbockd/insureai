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

export default clientPromise;
