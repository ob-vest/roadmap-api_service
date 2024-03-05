import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

const client = new Client({
  host: process.env.PLANETSCALE_DB_HOST,
  username: process.env.PLANETSCALE_DB_USERNAME,
  password: process.env.PLANETSCALE_DB_PASSWORD,
});

const db = drizzle(client);
