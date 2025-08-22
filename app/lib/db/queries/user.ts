import { genSaltSync, hashSync } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../schema";
import { avatarConfig } from "@/app/components/dashboard/components/config";

export async function createUser(userName: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  try {
    await db
      .insert(users)
      .values({
        userName,
        password: hash,
        avatar:
          avatarConfig[Math.floor(Math.random() * avatarConfig.length - 1)],
      });
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

export async function updateUserAvatar(userId: number, avatar: string) {
  try {
    await db.update(users).set({ avatar }).where(eq(users.id, userId));
  } catch (err) {
    console.error(err);
  }
}

export async function getUserInfo(userId: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { password: false },
    with: {
      householdData: {
        columns: {},
        with: {
          household: {
            columns: { id: true, houseName: true, inviteCode: true },
            with: {
              tasks: {
                columns: {
                  id: true,
                  taskName: true,
                  taskDescription: true,
                  createdAt: true,
                  completed: true,
                  createdByUserId: true,
                  assignedToUserId: true,
                },
                with: {
                  creator: { columns: { id: true, userName: true } },
                  assignee: { columns: { id: true, userName: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  const household = user.householdData.map((m) => m.household)[0];

  const tasks = (household?.tasks ?? []).map((t) => ({
    id: t.id,
    name: t.taskName,
    description: t.taskDescription,
    createdAt: t.createdAt,
    completed: t.completed,
    createdBy: { id: t.creator.id, userName: t.creator.userName },

    assignedTo: t.assignee
      ? { id: t.assignee.id, userName: t.assignee.userName }
      : null,
  }));

  return {
    id: user.id,
    userName: user.userName,
    avatar: user.avatar,
    completedTasks: user.completedTasks,
    household: household
      ? {
        id: household.id,
        houseName: household.houseName,
        inviteCode: household.inviteCode,
        tasks,
      }
      : null,
  };
}
