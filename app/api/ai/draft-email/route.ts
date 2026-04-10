import { NextRequest, NextResponse } from "next/server";
import { draftEmail } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await draftEmail(data);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Draft failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
