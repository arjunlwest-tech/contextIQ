import { NextResponse, type NextRequest } from "next/server";

// Temporarily simplified middleware for Cloudflare compatibility
// TODO: Re-enable Supabase session management with Cloudflare-compatible implementation
export async function middleware(request: NextRequest) {
  // Pass through all requests without auth check for now
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*))"],
};
