import { eq, sql } from "drizzle-orm";

import { db } from "../db";
import { users, tasks } from "../schema";

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
    .set({
      assignedToUserId: userId,
      householdId: householdId,
    })
    .where(eq(tasks.id, taskId));
}
