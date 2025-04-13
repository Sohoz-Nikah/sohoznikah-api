import { pgTable, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { auditFields } from "./auditField.schema";
import { biodatas } from "./biodatas.schema";

export const biodataEducationInfosDegrees = pgTable(
  "biodataEducationInfosDegrees",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    biodataId: varchar("biodataId", { length: 36 })
      .notNull()
      .references(() => biodatas.id, { onDelete: "cascade" }),
    name: varchar("name"),
    passYear: varchar("passYear"),
    group: varchar("group"),
    institute: varchar("institute"),
    ...auditFields,
  }
);
