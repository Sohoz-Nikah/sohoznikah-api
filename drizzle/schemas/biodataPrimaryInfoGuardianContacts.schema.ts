import { pgTable, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { auditFields } from "./auditField.schema";
import { biodatas } from "./biodatas.schema";

export const biodataPrimaryInfoGuardianContacts = pgTable(
  "biodataPrimaryInfoGuardianContacts",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    biodataId: varchar("biodataId", { length: 36 })
      .notNull()
      .references(() => biodatas.id, { onDelete: "cascade" }),
    relation: varchar("relation"),
    fullName: varchar("fullName"),
    phoneNumber: varchar("phoneNumber"),
    ...auditFields,
  }
);
