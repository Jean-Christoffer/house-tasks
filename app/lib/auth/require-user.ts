"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "../utils/jwt";

export async function requireUser(): Promise<{
  userId: number;
  username: string;
}> {
  const store = await cookies();
  const token = store.get("accessToken")?.value;
  if (!token) redirect("/login");

  const payload = await verifyJwt(token).catch(() => null);

  if (!payload) redirect("/login");

  return {
    userId: Number(payload.userId),
    username: String(payload.username),
  };
}
