import { NextRequest, NextResponse } from "next/server";
import { generateQBR } from "@/lib/claude";
import { GenerateQBRSchema } from "@/lib/schemas";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const validatedData = GenerateQBRSchema.parse(rawData);
    
    // Fallback if no API key is provided for strict local testing:
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        executiveSummary: `Generated Review for ${validatedData.name}`,
        keyMetrics: [{ label: "MRR", value: `$${validatedData.mrr}`, trend: "up" }],
        wins: [`Great feature adoption for ${validatedData.name}`],
        risks: ["Some support tickets pending"],
        recommendations: ["Upgrade to enterprise tier"],
        nextSteps: ["Schedule sync next week"]
      });
    }

    const result = await generateQBR(validatedData);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid Input Data", issues: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error during QBR generation" }, { status: 500 });
  }
}
