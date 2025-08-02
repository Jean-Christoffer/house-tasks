import jwt, { Secret, SignOptions } from "jsonwebtoken";

import { NextResponse } from "next/server";
import { compare } from "bcrypt-ts";
import { getUser } from "../../../lib/db/queries";

import { env } from "@/app/lib/config/config";

export async function POST(req: Request) {
  const { userName, password } = await req.json();

  const user = await getUser(userName);

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

  const signOptions: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN,
  };

  const token = jwt.sign(payload, secret, signOptions);

  const response = NextResponse.json({ message: "Login successful" });

  response.cookies.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Number(process.env.JWT_EXPIRES_IN),
    path: "/",
  });

  return response;
}
