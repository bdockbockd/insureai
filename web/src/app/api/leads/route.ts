import { NextRequest, NextResponse } from "next/server";

// In production, this would connect to MongoDB
// For now, we'll use in-memory storage for demo

interface Lead {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  lineId?: string;
  preferredContact: "email" | "phone" | "line";
  source: string;
  createdAt: Date;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  userProfile?: {
    insuranceType?: string;
    insuranceFor?: string;
    age?: number;
    budget?: { min: number; max: number };
  };
}

// Temporary in-memory storage (replace with MongoDB in production)
const leads: Lead[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.fullName) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    // At least one contact method required
    if (!body.email && !body.phone && !body.lineId) {
      return NextResponse.json(
        { error: "At least one contact method is required" },
        { status: 400 }
      );
    }

    // Create lead object
    const lead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fullName: body.fullName,
      email: body.email || undefined,
      phone: body.phone || undefined,
      lineId: body.lineId || undefined,
      preferredContact: body.preferredContact || "line",
      source: body.source || "website",
      createdAt: new Date(),
      status: "new",
      userProfile: body.userProfile || undefined,
    };

    // Store lead (in production, save to MongoDB)
    leads.push(lead);

    // TODO: In production, send notification to sales team
    // - Send LINE notification
    // - Send email to sales@insureai.com
    // - Create CRM entry

    console.log("New lead captured:", lead);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Our advisor will contact you shortly.",
        leadId: lead.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // In production, this would be protected and require authentication
  return NextResponse.json({
    total: leads.length,
    leads: leads.slice(-10), // Return last 10 leads
  });
}
