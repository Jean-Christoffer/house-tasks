import { pgTable as table } from "drizzle-orm/pg-core";

import * as t from "drizzle-orm/pg-core";

export const users = table(
  "users",
  {
    id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userName: t.varchar("userName", { length: 256 }).notNull().unique(),
    password: t.varchar("password", { length: 64 }).notNull(),
  },
  (table) => [t.uniqueIndex("userName_idx").on(table.userName)],
);

export const tokens = table("tokens", {
  id: t.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: t.integer("user_id").references(() => users.id),
  token: t.text("token").notNull(),
  expiresAt: t.timestamp("expires_at").notNull(),
});
