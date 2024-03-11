import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: varchar("id").primaryKey(),
  googleId: varchar("google_id").notNull().unique(),
  username: varchar("username").notNull(),
  image: varchar("image"),
});

export const userRelations = relations(users, ({ many }) => ({
  gmailAccounts: many(gmailAccounts),
  sessions: many(sessions),
  apiKeys: many(apiKeys),
}));

export const sessions = pgTable("session", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const gmailAccountStatus = pgEnum("gmailAccountStatus", [
  "active",
  "access revoked",
]);

export const gmailAccounts = pgTable("gmail_account", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  email: varchar("email").notNull().unique(),
  refreshToken: varchar("refresh_token").notNull(),
  status: gmailAccountStatus("status").notNull().default("active"),
});

export const gmailAccountRelations = relations(gmailAccounts, ({ one }) => ({
  user: one(users, {
    fields: [gmailAccounts.userId],
    references: [users.id],
  }),
}));

export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  gmailAccount: varchar("gmail_id")
    .notNull()
    .references(() => gmailAccounts.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  prefix: varchar("prefix").notNull().unique(),
  apiKey: varchar("api_key").notNull().unique(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
  gmailAccount: one(gmailAccounts, {
    fields: [apiKeys.gmailAccount],
    references: [gmailAccounts.id],
  }),
}));
