import jwt, { Secret } from "jsonwebtoken";

import { NextResponse } from "next/server";
import { getUser, insertRefreshToken } from "../../../lib/db/queries";
import { env } from "@/app/lib/config/config";
import { genSaltSync, hashSync, compare } from "bcrypt-ts";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const user = await getUser(username);

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

  const accessToken = jwt.sign(payload, secret, { expiresIn: 3600 });
  const refreshToken = jwt.sign(payload, secret, { expiresIn: 86400 });
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

  response.cookies.set("refreshToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 86400,
    path: "/",
  });

  return response;
}
