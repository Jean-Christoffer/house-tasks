import { cookies } from "next/headers";
import { verifyJwt } from "../utils/jwt";
import { getUserInfo } from "../db/queries";

export async function verifyAndGetUserServer() {
  const allCookies = await cookies();
  const accessTokenValue = allCookies.get("accessToken")?.value;

  const payload = accessTokenValue ? await verifyJwt(accessTokenValue) : null;

  if (!payload) return false;

  const user = await getUserInfo(payload.username);

  return user;
}

export async function retrieveRefreshToken() {
  const allCookies = await cookies();
  const accessTokenValue = allCookies.get("refreshToken")?.value;

  return accessTokenValue ? accessTokenValue : null;
}
