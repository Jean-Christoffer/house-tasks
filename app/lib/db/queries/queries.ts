import { genSaltSync, hashSync, compare } from "bcrypt-ts";
import { db } from "../db";
import { users, tokens, household, householdMembers, tasks } from "../schema";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

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

export async function createHousehold(userName: string, houseName: string) {
  await db.transaction(async (tx) => {
    const [user] = await tx
      .select()
      .from(users)
      .where(eq(users.userName, userName))
      .limit(1);

    if (!user) throw new Error("User not found");

    const inviteCode = nanoid(12);

    const [newHousehold] = await tx
      .insert(household)
      .values({
        houseName,
        inviteCode,
        createdByUserId: user.id,
      })
      .returning();

    await tx.insert(householdMembers).values({
      householdId: newHousehold.id,
      userId: user.id,
    });
  });
}

export async function createTask(
  userId: number,
  taskName: string,
  taskDescription: string,
  householdId: number,
) {
  try {
    await db.transaction(async (tx) => {
      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) throw new Error("User not found");

      await tx.insert(tasks).values({
        taskName,
        taskDescription,
        createdByUserId: user.id,
        householdId,
      });
    });
  } catch (err) {
    console.error(err);
  }
}

export async function completeTask(userId: number, taskId: number) {
  await db.transaction(async (tx) => {
    await tx.update(tasks).set({ completed: true }).where(eq(tasks.id, taskId));
    await tx
      .update(users)
      .set({ completedTasks: sql`${users.completedTasks} + 1` })
      .where(eq(users.id, userId));
  });
}

export async function assignTask(
  userId: number,
  taskId: number,
  householdId: number,
) {
  await db
    .update(tasks)
    .set({ assignedToUserId: userId, householdId: householdId })
    .where(eq(tasks.id, taskId));
}
