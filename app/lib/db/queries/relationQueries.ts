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
              tasks: true,
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  const households = user.householdData.map((m) => m.household);

  return {
    id: user.id,
    userName: user.userName,
    completedTasks: user.completedTasks,
    household: households[0],
  };
}
