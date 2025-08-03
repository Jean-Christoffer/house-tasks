import { NextResponse } from "next/server";
import { parseAuthCookie, verifyJwt } from "./app/lib/utils/jwt";

import type { NextRequest } from "next/server";

const redirectToLogin = (request: NextRequest) => {
  try {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  } catch (err) {
    console.error(err);
  }
};

export async function middleware(request: NextRequest) {
  const tokens = parseAuthCookie(request.headers.get("cookie"));

  const accessToken = tokens?.accessToken;
  const refreshToken = tokens?.refreshToken;

  const isProtectedRoute = !request.nextUrl.pathname.startsWith("/login");

  if (isProtectedRoute) {
    if (!accessToken && !refreshToken) {
      return redirectToLogin(request);
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
        return redirectToLogin(request);
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
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
