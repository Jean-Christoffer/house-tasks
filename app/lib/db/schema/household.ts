import { relations } from "drizzle-orm";
import {
  pgTable,
  integer,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { tasks } from "./tasks";

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
