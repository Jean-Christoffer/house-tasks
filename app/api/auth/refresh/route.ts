import { parseAuthCookie, verifyJwt } from "@/app/lib/utils/jwt";
import { NextResponse } from "next/server";
import jwt, { Secret } from "jsonwebtoken";
import { env } from "@/app/lib/config/config";
import { compareTokens } from "../../../lib/utils/compareTokens";

export async function POST(req: Request) {
  const tokens = parseAuthCookie(req.headers.get("cookie"));

  const refreshToken = tokens?.refreshToken;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Access Denied. No refresh token provided." },
      { status: 401 },
    );
  }

  const currentPayload = await verifyJwt(refreshToken);

  if (!currentPayload) {
    return NextResponse.json(
      { error: "Invalid refresh token." },
      { status: 401 },
    );
  }

  const payload: Record<string, string | number> = {
    userId: currentPayload.userId,
    username: currentPayload.username,
  };

  const tokenMatchesDb = await compareTokens(refreshToken);

  if (!tokenMatchesDb) {
    return NextResponse.json(
      { error: "Token does not match the db." },
      { status: 401 },
    );
  }

  const secret: Secret = env.JWT_SECRET;

  const accessToken = jwt.sign(payload, secret, { expiresIn: 3600 });

  const response = NextResponse.json(
    { message: "New accessToken generated" },
    { status: 200 },
  );

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600,
    path: "/",
  });

  return response;
}
