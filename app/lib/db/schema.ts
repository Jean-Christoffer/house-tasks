import {
  pgTable,
  integer,
  timestamp,
  uniqueIndex,
  text,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import * as t from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userName: varchar("userName", { length: 256 }).notNull().unique(),
    password: t.varchar("password", { length: 64 }).notNull(),
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

export const household = pgTable("household", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  inviteCode: varchar("invite_code", { length: 32 }).notNull().unique(),
  houseName: varchar("house_name", { length: 254 }).notNull(),
  createdByUserId: integer("created_by_user_id")
    .notNull()
    .references(() => users.id),
});

export const householdMembers = pgTable(
  "household_members",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    householdId: integer("household_id")
      .notNull()
      .references(() => household.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("household_user_idx").on(table.householdId, table.userId),
  ],
);

export const tokens = pgTable("tokens", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").references(() => users.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const householdRelations = relations(household, ({ one, many }) => ({
  creator: one(users, {
    fields: [household.createdByUserId],
    references: [users.id],
  }),

  members: many(householdMembers),
  tasks: many(tasks),
}));

export const householdMembersRelations = relations(
  householdMembers,
  ({ one }) => ({
    household: one(household, {
      fields: [householdMembers.householdId],
      references: [household.id],
    }),
    user: one(users, {
      fields: [householdMembers.userId],
      references: [users.id],
    }),
  }),
);
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
