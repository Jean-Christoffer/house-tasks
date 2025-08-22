"use server";

import { revalidatePath } from "next/cache";
import { getUserInfo, updateUserAvatar } from "../db/queries/user";
import { requireUser } from "../auth/require-user";
import { z } from "zod";

export async function userInfo() {
  const user = await requireUser();
  return await getUserInfo(user.userId);
}

const avatarSchema = z.object({ avatarValue: z.url() });

export async function changeAvatar(formData: FormData) {
  try {
    const user = await requireUser();
    const avatarValue = formData.get("avatar-value");
    const result = avatarSchema.safeParse({ avatarValue });

    if (result.success) {
      await updateUserAvatar(user.userId, result.data.avatarValue);
    } else {
      throw result.error;
    }

    revalidatePath("/");
  } catch (err) {
    console.error(err);
  }
}
