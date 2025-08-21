import jwt, { Secret } from "jsonwebtoken";

import { NextResponse } from "next/server";
import { getUser } from "../../../lib/db/queries/user";
import { insertRefreshToken } from "@/app/lib/db/queries/refreshToken";
import { env } from "@/app/lib/config/config";
import { genSaltSync, hashSync, compare } from "bcrypt-ts";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const user = await getUser(username.trim());

  if (!user) {
    return NextResponse.json({ error: "User does not exist" }, { status: 401 });
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const payload: Record<string, string | number> = {
    userId: user.id,
    username: user.userName,
  };

  const secret: Secret = env.JWT_SECRET;

  const accessToken = jwt.sign(payload, secret, { expiresIn: "1h" });

  const refreshToken = jwt.sign(payload, secret, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
  const salt = genSaltSync(10);
  const hash = hashSync(refreshToken, salt);

  const response = NextResponse.json({ message: "Login successful" });

  await insertRefreshToken(String(payload.username), 86400, hash);

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600,
    path: "/",
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: env.JWT_EXPIRES_IN,
    path: "/",
  });

  return response;
}
