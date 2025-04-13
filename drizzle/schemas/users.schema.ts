import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { auditFields } from "./auditField.schema";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  emailConfirmed: boolean("emailConfirmed").default(false),
  phoneNumber: text("phoneNumber").notNull().unique(),
  phoneConfirmed: boolean("phoneConfirmed").default(false),
  passwordHash: varchar("passwordHash").notNull(),
  refreshToken: varchar("refreshToken", { length: 36 }),
  refreshTokenExpiryTime: timestamp("refreshTokenExpiryTime"),
  lockoutEnabled: boolean("lockoutEnabled").default(false),
  lockoutEnd: timestamp("lockoutEnd").defaultNow(),
  failedAccessCount: integer("failedAccessCount").default(0),
  ...auditFields,
});
