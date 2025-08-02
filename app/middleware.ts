import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Authentication logic
  const response = NextResponse.next();
  return response;
}
// Configure the scope of the middleware (example: match all page routes)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
