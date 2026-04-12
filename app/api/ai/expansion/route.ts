import { NextRequest, NextResponse } from "next/server";
import { detectExpansionOpportunities } from "@/lib/claude";
import { ExpansionOpportunitySchema } from "@/lib/schemas";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const validatedData = ExpansionOpportunitySchema.parse(rawData);
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json([{ 
        customerId: validatedData[0]?.id || "mock-1",
        opportunityType: "seat_expansion",
        evidence: "High feature usage detected in simulated fallback.",
        estimatedValue: 500,
        suggestedPlay: "Send QBR to highlight team usage limits."
      }]);
    }

    const result = await detectExpansionOpportunities(validatedData);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid Input Data", issues: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error during expansion detection" }, { status: 500 });
  }
}
