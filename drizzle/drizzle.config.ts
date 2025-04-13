import { config } from "dotenv";
config();

export default {
  dialect: "postgresql",
  schema: "./schemas",
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
