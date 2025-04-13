import { pgTable, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { auditFields } from "./auditField.schema";
import { biodatas } from "./biodatas.schema";

export const biodataAddressInfos = pgTable("biodataAddressInfos", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  biodataId: varchar("biodataId", { length: 36 })
    .notNull()
    .references(() => biodatas.id, { onDelete: "cascade" }),
  type: varchar("type"),
  location: varchar("location"),
  state: varchar("state"),
  city: varchar("city"),
  detail: varchar("detail"),
  country: varchar("country"),
  cityzenshipStatus: varchar("cityzenshipStatus"),
  ...auditFields,
});
