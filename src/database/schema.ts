import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  primaryKey,
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

export const comment = mysqlTable("comment", {
  id: int("id").autoincrement().primaryKey(),
  text: varchar("text", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  requestId: int("request_id").notNull(),
  userId: int("user_id").notNull(),
});

export const upvote = mysqlTable(
  "upvote",
  {
    userId: int("user_id"),
    requestId: int("request_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.requestId] }),
    };
  }
);

export const requestType = mysqlTable("request_type", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 15 }).notNull(),
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
  typeId: int("type_id").notNull(),
  userId: int("user_id").notNull(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  requests: many(request),
}));

export const commentRelations = relations(comment, ({ one }) => ({
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
}));

export const upvoteRelations = relations(upvote, ({ one }) => ({
  user: one(user, {
    fields: [upvote.userId],
    references: [user.id],
  }),
}));

export const requestTypeRelations = relations(requestType, ({ many }) => ({
  requests: many(request),
}));

export const requestStateRelations = relations(requestState, ({ many }) => ({
  requests: many(request),
}));

export const requestRelations = relations(request, ({ one, many }) => ({
  state: one(requestState, {
    fields: [request.stateId],
    references: [requestState.id],
  }),
  user: one(user, {
    fields: [request.userId],
    references: [user.id],
  }),
  type: one(requestType, {
    fields: [request.typeId],
    references: [requestType.id],
  }),
  comments: many(comment),
  upvotes: many(upvote),
}));
