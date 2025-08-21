import { eq } from "drizzle-orm";
import { compare } from "bcrypt-ts";

import { db } from "../db";
import { tokens, users } from "../schema";

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

export async function deleteRefreshToken(tokenValue: string) {
  try {
    await db.transaction(async (tx) => {
      const foundTokens = await tx.select({ token: tokens.token }).from(tokens);

      let tokenToDelete;

      for (const dbToken of foundTokens) {
        const matches = await compare(tokenValue, dbToken.token);
        if (matches) {
          tokenToDelete = dbToken.token;
        }
      }

      if (tokenToDelete) {
        await tx.delete(tokens).where(eq(tokens.token, tokenToDelete));
      } else {
        console.error("Deletion failed");
      }
    });
  } catch (err) {
    console.error(err);
  }
}
