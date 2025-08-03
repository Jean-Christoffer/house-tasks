import { NextResponse } from "next/server";
import { parseAuthCookie, verifyJwt } from "./app/lib/utils/jwt";

import type { NextRequest } from "next/server";

const redirectToLogin = (request: NextRequest) => {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
};

export async function middleware(request: NextRequest) {
  const tokens = parseAuthCookie(request.headers.get("cookie"));

  const accessToken = tokens?.accessToken;
  const refreshToken = tokens?.refreshToken;

  if (!accessToken && !refreshToken) {
    redirectToLogin(request);
  }

  if (accessToken) {
    const payload = await verifyJwt(accessToken);
    if (payload) {
      return NextResponse.next();
    }
  }

  if (refreshToken) {
    const payload = await verifyJwt(refreshToken);

    if (!payload) {
      redirectToLogin(request);
    }

    const refreshResponse = await fetch(
      `${request.nextUrl.origin}/api/auth/refresh`,
      {
        method: "POST",
        headers: { cookie: `refreshToken=${refreshToken}` },
      },
    );

    if (!refreshResponse.ok && process.env.NODE_ENV !== "production") {
      console.error("Refresh token failed", await refreshResponse.json());
    }

    if (refreshResponse.ok) {
      const response = NextResponse.next();

      const setCookieHeaders = refreshResponse.headers.getSetCookie();

      if (setCookieHeaders.length > 0) {
        for (const cookie of setCookieHeaders) {
          response.headers.append("set-cookie", cookie);
        }

        return response;
      } else {
        return NextResponse.json(
          { message: "something went wrong" },
          { status: 401 },
        );
      }
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
