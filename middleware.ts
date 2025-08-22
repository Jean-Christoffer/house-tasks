import { NextResponse } from "next/server";
import { parseAuthCookie, verifyJwt } from "./app/lib/utils/jwt";

import type { NextRequest } from "next/server";

import { NextURL } from "next/dist/server/web/next-url";

const redirectToLogin = (request: NextRequest) => {
  const { origin } = request.nextUrl;

  try {
    const loginUrl = new NextURL("/login", origin);
    const response = NextResponse.redirect(loginUrl);

    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch (err) {
    console.error(err);
  }
};

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const tokens = parseAuthCookie(request.headers.get("cookie"));

  const accessToken = tokens?.accessToken;
  const refreshToken = tokens?.refreshToken;

  if (!accessToken && !refreshToken && pathname !== "/login") {
    return redirectToLogin(request);
  }

  if (accessToken) {
    const payload = await verifyJwt(accessToken);
    if (payload) {
      if (pathname === "/login") {
        const homePageUrl = new NextURL("/", origin);
        return NextResponse.redirect(homePageUrl);
      }
      return NextResponse.next();
    }
  }

  if (refreshToken) {
    const payload = await verifyJwt(refreshToken);

    if (!payload && pathname !== "/login") {
      return redirectToLogin(request);
    }

    const refreshResponse = await fetch(
      `${request.nextUrl.origin}/api/auth/refresh`,
      {
        method: "POST",
        headers: { cookie: `refreshToken=${refreshToken}` },
      },
    );

    if (!refreshResponse.ok) {
      console.error("Refresh token failed", await refreshResponse.json());
      if (pathname !== "/login") return redirectToLogin(request);
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
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/"],
};
