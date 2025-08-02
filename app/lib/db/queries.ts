import { genSaltSync, hashSync } from "bcrypt-ts";
import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";

export async function createUser(userName: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  try {
    await db.insert(users).values({ userName, password: hash });
  } catch (err) {
    console.error(err);
  }
}

export async function getUser(userName: string) {
  try {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.userName, userName));

    const user = results[0] ?? null;
    return user;
  } catch (err) {
    console.error(err);
  }
}
