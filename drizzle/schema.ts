import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  passwordHash: varchar("passwordHash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
