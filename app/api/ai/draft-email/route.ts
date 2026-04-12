import { NextRequest, NextResponse } from "next/server";
import { draftEmail } from "@/lib/claude";
import { DraftEmailSchema } from "@/lib/schemas";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const validatedData = DraftEmailSchema.parse(rawData);
    
    // Fallback if no API key is provided for strict local testing:
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        subject: `[MOCK] Check-in: ${validatedData.name} @ ${validatedData.company}`, 
        body: `<p>Hi ${validatedData.name},</p><p>We noticed your usage dropped. Let's chat.</p>`, 
        sendAt: new Date().toISOString(), tone: validatedData.tone 
      });
    }

    const result = await draftEmail(validatedData);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid Input Data", issues: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error during email draft creation" }, { status: 500 });
  }
}
