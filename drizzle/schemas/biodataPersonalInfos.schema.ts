import { pgTable, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { auditFields } from "./auditField.schema";
import { biodatas } from "./biodatas.schema";

export const biodataPersonalInfos = pgTable("biodataPersonalInfos", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  biodataId: varchar("biodataId", { length: 36 })
    .notNull()
    .references(() => biodatas.id, { onDelete: "cascade" }),
  beardStatus: varchar("beardStatus"),
  preferredOutfit: varchar("preferredOutfit"),
  entertainmentPreferences: varchar("entertainmentPreferences"),
  healthConditions: varchar("healthConditions"),
  personalTraits: varchar("personalTraits"),
  genderEqualityView: varchar("genderEqualityView"),
  lgbtqOpinion: varchar("lgbtqOpinion"),
  specialConditions: varchar("specialConditions"),
  ...auditFields,
});
