import { pgTable, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { auditFields } from "./auditField.schema";
import { biodatas } from "./biodatas.schema";

export const biodataReligiousInfos = pgTable("biodataReligiousInfos", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  biodataId: varchar("biodataId", { length: 36 })
    .notNull()
    .references(() => biodatas.id, { onDelete: "cascade" }),
  type: varchar("type"),
  ideology: varchar("ideology"),
  madhab: varchar("madhab"),
  praysFiveTimes: varchar("praysFiveTimes"),
  hasQazaPrayers: varchar("hasQazaPrayers"),
  canReciteQuranProperly: varchar("canReciteQuranProperly"),
  avoidsHaramIncome: varchar("avoidsHaramIncome"),
  modestDressing: varchar("modestDressing"),
  followsMahramRules: varchar("followsMahramRules"),
  beliefAboutPirMurshidAndMazar: varchar("beliefAboutPirMurshidAndMazar"),
  practicingSince: varchar("practicingSince"),
  ...auditFields,
});
