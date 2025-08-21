import { getUserInfo } from "../db/queries/user";
import { requireUser } from "../auth/require-user";

export async function userInfo() {
  const user = await requireUser();
  return getUserInfo(user.userId);
}
