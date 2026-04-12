import { NextRequest, NextResponse } from "next/server";
import { analyzeChurnRisk } from "@/lib/claude";
import { ChurnRiskSchema } from "@/lib/schemas";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const validatedData = ChurnRiskSchema.parse(rawData);
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        riskScore: Math.min(100, Math.max(0, 100 - validatedData.healthScore)),
        riskLevel: validatedData.healthScore < 40 ? "high" : "low",
        topReasons: ["Low usage trend simulated fallback"],
        recommendedAction: "Send targeted check-in",
        urgency: "this_week"
      });
    }

    const result = await analyzeChurnRisk(validatedData);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid Input Data", issues: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error during churn analysis" }, { status: 500 });
  }
}
