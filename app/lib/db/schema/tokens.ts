import { pgTable, integer, timestamp, text } from "drizzle-orm/pg-core";

import { users } from "./users";

export const tokens = pgTable("tokens", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").references(() => users.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});
