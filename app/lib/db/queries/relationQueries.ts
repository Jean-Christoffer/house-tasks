import { db } from "../db";
import { users } from "../schema";
import { eq } from "drizzle-orm";

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
