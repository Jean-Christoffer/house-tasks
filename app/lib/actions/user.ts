import { getUserInfo } from "../db/queries/relationQueries";
import { requireUser } from "../auth/require-user";

export async function userInfo() {
  const user = await requireUser();
  return getUserInfo(user.userId);
}
