import { NextRequest, NextResponse } from "next/server";
import { chatAssistant } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const { question, context } = await req.json();
    const result = await chatAssistant(question, context);
    return NextResponse.json({ response: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
