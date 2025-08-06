import { NextResponse } from "next/server";
import { parseAuthCookie, verifyJwt } from "@/app/lib/utils/jwt";
import { getUserInfo } from "@/app/lib/db/queries/relationQueries";

export async function GET(request: Request) {
  const tokens = parseAuthCookie(request.headers.get("cookie"));
  const accessToken = tokens?.accessToken;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access Denied. No access token provided." },
      { status: 401 },
    );
  }
  const user = await verifyJwt(accessToken);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid access token." },
      { status: 401 },
    );
  }
  const userInfo = await getUserInfo(user.username);

  if (!userInfo) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: userInfo }, { status: 200 });
}
