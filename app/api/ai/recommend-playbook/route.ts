import { NextRequest, NextResponse } from "next/server";
import { recommendPlaybook } from "@/lib/claude";
import { RecommendPlaybookSchema } from "@/lib/schemas";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const validatedData = RecommendPlaybookSchema.parse(rawData);
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        playbookName: validatedData.healthScore < 50 ? "Churn Rescue" : "Executive Nudge",
        explanation: `Simulated recommendation for ${validatedData.customerName} based on health score.`
      });
    }

    const result = await recommendPlaybook(validatedData);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid Input Data", issues: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error during playbook generation" }, { status: 500 });
  }
}
