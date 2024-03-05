import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: int("id").autoincrement().primaryKey(),
  refreshToken: varchar("refresh_token", { length: 255 }).notNull(),
  isBlocked: boolean("is_blocked").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const requestState = mysqlTable("request_state", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 15 }).notNull(),
});

export const request = mysqlTable("request", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 50 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastActivityAt: timestamp("last_activity_at").notNull().defaultNow(),
  stateId: int("state_id").notNull(),
  userId: int("user_id").notNull(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  requests: many(request),
}));

export const requestStateRelations = relations(requestState, ({ many }) => ({
  requests: many(request),
}));

export const requestRelations = relations(request, ({ one }) => ({
  state: one(requestState, {
    fields: [request.stateId],
    references: [requestState.id],
  }),
  user: one(user, {
    fields: [request.userId],
    references: [user.id],
  }),
}));
