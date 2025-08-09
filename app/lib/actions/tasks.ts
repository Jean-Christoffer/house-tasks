"use server";

import { revalidatePath } from "next/cache";
import { createTask, completeTask, assignTask } from "../db/queries/queries";

export async function createTaskAction(
  formData: FormData,
  userName: string,
  householdId: number,
) {
  const taskName = formData.get("taskName") as string;
  const taskDescription = formData.get("taskDescription") as string;
  await createTask(userName, taskName, taskDescription, householdId);
  revalidatePath("/");
}

export async function completeCurrentTask(userId: number, taskId: number) {
  await completeTask(userId, taskId);
  revalidatePath("/");
}
export async function assignSelectedTask(
  userId: number,
  taskId: number,
  householdId: number,
) {
  await assignTask(userId, taskId, householdId);
  revalidatePath("/");
}
