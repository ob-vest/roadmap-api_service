import type { Config } from "drizzle-kit";

export default {
  schema: "./src/database/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: process.env.PLANETSCALE_DB_URL ?? "",
  },
  //   out: "./drizzle",
} satisfies Config;
