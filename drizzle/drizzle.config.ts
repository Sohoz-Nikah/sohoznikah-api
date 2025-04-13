import { config } from "dotenv";
config();

export default {
  dialect: "postgresql",
  schema: "./drizzle/schemas/",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
