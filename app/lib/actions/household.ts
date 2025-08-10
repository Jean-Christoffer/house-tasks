"use server";

import { revalidatePath } from "next/cache";
import { joinHousehold, createHousehold } from "../db/queries/queries";
import { requireUser } from "../auth/require-user";

export async function joinHouseholdByInvite(inviteCode: string) {
  try {
    const user = await requireUser();

    await joinHousehold(inviteCode, user.userId);

    revalidatePath("/");
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "household not found")
        return { message: err.message, status: 404 };
    }
    console.error(err);
  }
}
export async function createHouseholdAction(houseName: string) {
  try {
    const user = await requireUser();

    await createHousehold(user.userId, houseName);

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    console.error(err);
  }
}
