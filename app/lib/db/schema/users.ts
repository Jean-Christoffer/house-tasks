import { relations } from "drizzle-orm";
import { pgTable, integer, uniqueIndex, varchar } from "drizzle-orm/pg-core";

import { household, householdMembers } from "./household";
import { tasks } from "./tasks";

export const users = pgTable(
  "users",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userName: varchar("userName", { length: 256 }).notNull().unique(),
    password: varchar("password", { length: 64 }).notNull(),
    completedTasks: integer("completed_tasks").notNull().default(0),
  },
  (table) => [uniqueIndex("userName_idx").on(table.userName)],
);

export const usersRelations = relations(users, ({ many }) => ({
  createdTasks: many(tasks, { relationName: "createdTasks" }),
  assignedTasks: many(tasks, { relationName: "assignedTasks" }),

  household: many(household),
  householdData: many(householdMembers),
}));
