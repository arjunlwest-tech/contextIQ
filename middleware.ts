import { NextResponse, type NextRequest } from "next/server";

// Simple in-memory store for IP-based rate limiting
// Note: In a true distributed production environment, we would use Redis (@upstash/ratelimit) here.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const WINDOW_MS = 60 * 1000; // 1 Minute Window
const MAX_REQUESTS_PER_WINDOW = 50; // Strict limit: 50 requests per minute per IP

export async function middleware(request: NextRequest) {
  // 1. IP Extraction
  // Next.js provides request.ip on standard deployments, or we fallback to proxy headers.
  const ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
  
  // 2. Rate Limiting Logic (Only applied to API endpoints to prevent blocking static assets)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    let rateData = rateLimitMap.get(ip);

    if (!rateData || rateData.lastReset < windowStart) {
      // Initialize or reset window
      rateData = { count: 1, lastReset: now };
    } else {
      // Increment count
      rateData.count += 1;
    }
    rateLimitMap.set(ip, rateData);

    const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - rateData.count);

    // 3. Graceful 429 Enforcement
    if (rateData.count > MAX_REQUESTS_PER_WINDOW) {
      return new NextResponse(
        JSON.stringify({ error: "Too Many Requests - Rate limit exceeded. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
            "X-RateLimit-Remaining": "0",
            "Retry-After": Math.ceil((WINDOW_MS - (now - rateData.lastReset)) / 1000).toString(),
          },
        }
      );
    }

    // 4. Attach Rate Limit Headers to successful requests
    const res = NextResponse.next();
    res.headers.set("X-RateLimit-Limit", MAX_REQUESTS_PER_WINDOW.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    return res;
  }

  // Pass through standard requests
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
