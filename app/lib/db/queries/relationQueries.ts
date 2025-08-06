import { db } from "../db";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export async function getUserInfo(username: string) {
  try {
    const results = await db.query.users.findFirst({
      where: eq(users.userName, username),
      columns: {
        password: false,
      },
      with: {
        tasks: true,
        household: true,
      },
    });

    const user = results ?? null;
    return user;
  } catch (err) {
    console.error(err);
  }
}
