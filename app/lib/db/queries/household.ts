import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "../db";
import { users, household, householdMembers } from "../schema";

export async function createHousehold(userId: number, houseName: string) {
  await db.transaction(async (tx) => {
    const [user] = await tx
      .select()
      .from(users)
      .where(eq(users.id, userId))
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

export async function joinHousehold(inviteCode: string, userId: number) {
  await db.transaction(async (tx) => {
    const [invitedHousehold] = await tx
      .select()
      .from(household)
      .where(eq(household.inviteCode, inviteCode))
      .limit(1);

    if (!invitedHousehold) throw new Error("household not found");

    await tx
      .insert(householdMembers)
      .values({ userId, householdId: invitedHousehold.id });
  });
}
