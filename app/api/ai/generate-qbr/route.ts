import { NextRequest, NextResponse } from "next/server";
import { generateQBR } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await generateQBR(data);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "QBR generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
