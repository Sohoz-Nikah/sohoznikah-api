import { pgTable, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { auditFields } from "./auditField.schema";
import { biodatas } from "./biodatas.schema";

export const biodataSpousePreferenceInfos = pgTable(
  "biodataSpousePreferenceInfos",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    biodataId: varchar("biodataId", { length: 36 })
      .notNull()
      .references(() => biodatas.id, { onDelete: "cascade" }),
    age: varchar("age"),
    skinTone: varchar("skinTone"),
    height: varchar("height"),
    educationalQualification: varchar("educationalQualification"),
    religiousEducationalQualification: varchar(
      "religiousEducationalQualification"
    ),
    address: varchar("address"),
    maritalStatus: varchar("maritalStatus"),
    specialCategory: varchar("specialCategory"),
    religiousType: varchar("religiousType"),
    occupation: varchar("occupation"),
    familyBackground: varchar("familyBackground"),
    secondMarrige: varchar("secondMarrige"),
    location: varchar("location"),
    qualities: varchar("qualities"),
    ...auditFields,
  }
);
