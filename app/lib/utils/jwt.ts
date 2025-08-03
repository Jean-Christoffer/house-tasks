import { jwtVerify } from "jose";
import { parse } from "cookie";
import { env } from "../config/config";

export type JwtPayload = {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
};

export function parseAuthCookie(cookieHeader: string | null) {
  if (!cookieHeader) return null;

  const cookies = parse(cookieHeader);

  const accessToken = cookies?.accessToken;
  const refreshToken = cookies?.refreshToken;

  return { accessToken, refreshToken };
}

export async function verifyJwt(
  token: string | null,
): Promise<JwtPayload | null> {
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);
    return payload as JwtPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
