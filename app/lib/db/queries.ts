import { genSaltSync, hashSync, compare } from "bcrypt-ts";
import { db } from "./db";
import { users, tokens } from "./schema";
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

export async function getUser(username: string) {
  try {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.userName, username));

    const user = results[0] ?? null;
    return user;
  } catch (err) {
    console.error(err);
  }
}

export async function insertRefreshToken(
  username: string,
  expires: number,
  refreshToken: string,
) {
  await db.transaction(async (tx) => {
    const user = await tx
      .select()
      .from(users)
      .where(eq(users.userName, username));

    await tx.insert(tokens).values({
      userId: user[0].id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + expires * 1000),
    });
  });
}

export async function getRefreshToken(tokenValue: string) {
  try {
    const foundTokens = await db.select({ token: tokens.token }).from(tokens);

    for (const dbToken of foundTokens) {
      const matches = await compare(tokenValue, dbToken.token);
      if (matches) {
        return dbToken.token;
      }
    }

    const refreshToken = foundTokens[0]?.token ?? null;

    return refreshToken;
  } catch (err) {
    console.error(err);
    return null;
  }
}
