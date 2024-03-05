import { relations } from "drizzle-orm";
import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const requestState = mysqlTable("request_state", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 15 }).notNull(),
});

export const request = mysqlTable("request", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 50 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  last_activity_at: timestamp("last_activity_at").notNull().defaultNow(),
  stateId: int("state_id").notNull(),
});

export const requestStateRelations = relations(requestState, ({ many }) => ({
  requests: many(request),
}));

export const requestRelations = relations(request, ({ one }) => ({
  state: one(requestState, {
    fields: [request.stateId],
    references: [requestState.id],
  }),
}));
