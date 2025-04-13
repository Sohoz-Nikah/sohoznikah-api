import { pgTable, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { auditFields } from "./auditField.schema";
import { biodatas } from "./biodatas.schema";

export const biodataMarriageInfos = pgTable("biodataMarriageInfos", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  biodataId: varchar("biodataId", { length: 36 })
    .notNull()
    .references(() => biodatas.id, { onDelete: "cascade" }),
  guardianApproval: varchar("guardianApproval"),
  continueStudy: varchar("continueStudy"),
  careerPlan: varchar("careerPlan"),
  residence: varchar("residence"),
  arrangeHijab: varchar("arrangeHijab"),
  dowryExpectation: varchar("dowryExpectation"),
  allowShowingPhotoOnline: varchar("allowShowingPhotoOnline"),
  additionalMarriageInfo: varchar("additionalMarriageInfo"),
  ...auditFields,
});
