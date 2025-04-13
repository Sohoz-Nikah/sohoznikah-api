import { varchar, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const auditFields = {
  createdBy: varchar("createdBy", { length: 36 }).$defaultFn(() => uuidv7()),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedBy: varchar("updatedBy", { length: 36 }),
  updatedAt: timestamp("updatedAt"),
};
