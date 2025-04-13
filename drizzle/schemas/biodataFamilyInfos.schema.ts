import { pgTable, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { auditFields } from "./auditField.schema";
import { biodatas } from "./biodatas.schema";

export const biodataFamilyInfos = pgTable("biodataFamilyInfos", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  biodataId: varchar("biodataId", { length: 36 })
    .notNull()
    .references(() => biodatas.id, { onDelete: "cascade" }),
  parentsAlive: varchar("parentsAlive"),
  fatherOccupation: varchar("fatherOccupation"),
  motherOccupation: varchar("motherOccupation"),
  fatherSideDetail: varchar("fatherSideDetail"),
  motherSideDetail: varchar("motherSideDetail"),
  familyType: varchar("familyType"),
  familyBackground: varchar("familyBackground"),
  livingCondition: varchar("livingCondition"),
  wealthDescription: varchar("wealthDescription"),
  ...auditFields,
});
