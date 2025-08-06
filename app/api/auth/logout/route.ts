import { NextResponse } from "next/server";
import { parseAuthCookie } from "@/app/lib/utils/jwt";
import { deleteRefreshToken } from "@/app/lib/db/queries/queries";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));

  const tokens = parseAuthCookie(request.headers.get("cookie"));
  const refreshToken = tokens?.refreshToken;

  if (refreshToken) {
    await deleteRefreshToken(refreshToken);
  }

  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");

  return response;
}
