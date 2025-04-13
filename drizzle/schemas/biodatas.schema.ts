import { pgTable, varchar, boolean } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { auditFields } from "./auditField.schema";
import { users } from "./users.schema";

export const biodatas = pgTable("biodatas", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  userId: varchar("userId", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  preApprovalAcceptTerms: boolean("preApprovalAcceptTerms").default(false),
  preApprovalOathTruthfulInfo: boolean("preApprovalOathTruthfulInfo").default(
    false
  ),
  preApprovalOathLegalResponsibility: boolean(
    "preApprovalOathLegalResponsibility"
  ).default(false),

  postApprovalOathTruthfulInfo: boolean("postApprovalOathTruthfulInfo").default(
    false
  ),
  postApprovalOathNoMisuse: boolean("postApprovalOathNoMisuse").default(false),
  postApprovalOathLegalResponsibility: boolean(
    "postApprovalOathLegalResponsibility"
  ).default(false),
  profilePic: varchar("profilePic"),
  ...auditFields,
});
