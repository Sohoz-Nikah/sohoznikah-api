import { pgTable, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { auditFields } from "./auditField.schema";
import { biodatas } from "./biodatas.schema";

export const biodataPrimaryInfos = pgTable("biodataPrimaryInfos", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  biodataId: varchar("biodataId", { length: 36 })
    .notNull()
    .references(() => biodatas.id, { onDelete: "cascade" }),
  biodataType: varchar("biodataType"),
  biodataFor: varchar("biodataFor"),
  fullName: varchar("fullName"),
  fatherName: varchar("fatherName"),
  motherName: varchar("motherName"),
  email: varchar("email"),
  phoneNumber: varchar("phoneNumber"),
  ...auditFields,
});
