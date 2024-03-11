import { relations } from "drizzle-orm";

import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  primaryKey,
  integer,
  serial,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  appleUserId: varchar("apple_user_id", { length: 255 }).notNull().unique(),
  refreshToken: varchar("refresh_token", { length: 255 }).notNull(),
  isBlocked: boolean("is_blocked").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const comment = pgTable("comment", {
  id: serial("id").primaryKey(),
  text: varchar("text", { length: 255 }).notNull(),
  isApproved: boolean("is_approved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  requestId: integer("request_id").references(() => request.id),
  userId: integer("user_id").references(() => user.id),
});

export const requestUpvote = pgTable(
  "request_upvote",
  {
    userId: integer("user_id").references(() => user.id),
    requestId: integer("request_id").references(() => request.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.requestId] }),
    };
  }
);

export const requestType = pgTable("request_type", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 15 }).notNull(),
});

export const requestState = pgTable("request_state", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 15 }).notNull(),
});

export const request = pgTable("request", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 50 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastActivityAt: timestamp("last_activity_at").notNull().defaultNow(),
  stateId: integer("state_id").references(() => requestState.id),
  typeId: integer("type_id").references(() => requestType.id),
  userId: integer("user_id").notNull(),
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
  request: one(request, {
    fields: [comment.requestId],
    references: [request.id],
  }),
}));

export const upvoteRelations = relations(requestUpvote, ({ one }) => ({
  user: one(user, {
    fields: [requestUpvote.userId],
    references: [user.id],
  }),
  request: one(request, {
    fields: [requestUpvote.requestId],
    references: [request.id],
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
  upvotes: many(requestUpvote),
}));
