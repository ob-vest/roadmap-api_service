import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./db-connect";

async function main() {
  console.log("Migrating database...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    await pool.end();
    console.log("Database migrated");
  } catch (e) {
    console.error("Error migrating database", e);
  }
}

main();
