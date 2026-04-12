import { NextRequest, NextResponse } from "next/server";
import { chatAssistant } from "@/lib/claude";
import { z } from "zod";
import xss from "xss";

const ChatSchema = z.object({
  question: z.string().min(1).max(1000).transform(str => xss(str)),
  context: z.string().max(5000).optional().transform(str => str ? xss(str) : ""),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const validatedData = ChatSchema.parse(rawData);
    
    const result = await chatAssistant(validatedData.question, validatedData.context);
    return NextResponse.json({ response: result });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid Input Data", issues: (error as any).errors }, { status: 400 });
    }
    // Prevent leaking stack traces; return generic message to clients
    return NextResponse.json({ error: "Internal Server Error during chat processing" }, { status: 500 });
  }
}
