import { pgTable, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { auditFields } from "./auditField.schema";
import { biodatas } from "./biodatas.schema";

export const biodataFamilyInfoSiblings = pgTable("biodataFamilyInfoSiblings", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  biodataId: varchar("biodataId", { length: 36 })
    .notNull()
    .references(() => biodatas.id, { onDelete: "cascade" }),
  type: varchar("type"),
  occupation: varchar("occupation"),
  maritalStatus: varchar("maritalStatus"),
  children: varchar("children"),
  ...auditFields,
});
