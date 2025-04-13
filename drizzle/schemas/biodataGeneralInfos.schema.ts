import { pgTable, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { auditFields } from "./auditField.schema";
import { biodatas } from "./biodatas.schema";

export const biodataGeneralInfos = pgTable("biodataGeneralInfos", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  biodataId: varchar("biodataId", { length: 36 })
    .notNull()
    .references(() => biodatas.id, { onDelete: "cascade" }),
  dateOfBirth: varchar("dateOfBirth"),
  maritalStatus: varchar("maritalStatus"),
  skinTone: varchar("skinTone"),
  height: varchar("height"),
  weight: varchar("weight"),
  bloodGroup: varchar("bloodGroup"),
  nationality: varchar("nationality"),
  ...auditFields,
});
