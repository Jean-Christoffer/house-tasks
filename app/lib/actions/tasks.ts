"use server";

import { revalidatePath } from "next/cache";
import { createTask, completeTask, assignTask } from "../db/queries/queries";

import { requireUser } from "../auth/require-user";

export async function completeCurrentTask(taskId: number) {
  const user = await requireUser();
  await completeTask(user.userId, taskId);
  revalidatePath("/");
}

export async function assignSelectedTask(taskId: number, householdId: number) {
  const user = await requireUser();
  await assignTask(user.userId, taskId, householdId);
  revalidatePath("/");
}

export async function createTaskAction(
  taskName: string,
  taskDescription: string,
  householdId: number,
) {
  const user = await requireUser();

  await createTask(user.userId, taskName, taskDescription, householdId);
  revalidatePath("/");
}
