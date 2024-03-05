import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const requestState = mysqlTable("request_state", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 15 }).notNull(),
});
