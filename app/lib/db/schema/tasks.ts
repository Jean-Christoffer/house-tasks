import {
  pgTable,
  integer,
  timestamp,
  text,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { household } from "./household";
import { users } from "./users";

export const tasks = pgTable("tasks", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  householdId: integer("household_id")
    .notNull()
    .references(() => household.id, { onDelete: "cascade" }),
  assignedToUserId: integer("assigned_to_user_id").references(() => users.id),
  createdByUserId: integer("created_by_user_id")
    .notNull()
    .references(() => users.id), // FK to users.id
  taskName: varchar("task_name", { length: 254 }).notNull(),
  taskDescription: text("task_description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completed: boolean("completed").notNull().default(false),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  creator: one(users, {
    fields: [tasks.createdByUserId],
    references: [users.id],
    relationName: "createdTasks",
  }),
  assignee: one(users, {
    fields: [tasks.assignedToUserId],
    references: [users.id],
    relationName: "assignedTasks",
  }),
  household: one(household, {
    fields: [tasks.householdId],
    references: [household.id],
  }),
}));
