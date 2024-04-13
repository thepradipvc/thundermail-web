import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  googleId: varchar("google_id").notNull().unique(),
  username: varchar("username").notNull(),
  image: varchar("image"),
});

export const userRelations = relations(users, ({ many }) => ({
  gmailAccounts: many(gmailAccounts),
  sessions: many(sessions),
  apiKeys: many(apiKeys),
  emails: many(emails),
}));

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id").primaryKey(),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (session) => {
    return {
      userIndex: index("user_session_idx").on(session.userId),
    };
  },
);

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const gmailAccountStatus = pgEnum("gmail_account_status", [
  "active",
  "access revoked",
]);

export const gmailAccounts = pgTable(
  "gmail_accounts",
  {
    id: varchar("id").primaryKey(),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    email: varchar("email").notNull().unique(),
    refreshToken: varchar("refresh_token").notNull(),
    status: gmailAccountStatus("status").notNull().default("active"),
  },
  (gmailAccounts) => {
    return {
      emailIndex: uniqueIndex("email_gmailaccount_idx").on(gmailAccounts.email),
      userIndex: index("user_gmailaccount_idx").on(gmailAccounts.userId),
    };
  },
);

export const gmailAccountRelations = relations(gmailAccounts, ({ one }) => ({
  user: one(users, {
    fields: [gmailAccounts.userId],
    references: [users.id],
  }),
}));

export const apiKeys = pgTable(
  "api_keys",
  {
    id: varchar("id").primaryKey(),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name").notNull(),
    prefix: varchar("prefix").notNull().unique(),
    apiKey: varchar("api_key").notNull().unique(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (apiKeys) => {
    return {
      apiKeyIndex: uniqueIndex("api_key_idx").on(apiKeys.apiKey),
      userIndex: index("user_apikey_idx").on(apiKeys.userId),
    };
  },
);

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));

// Emails related schemas
export const emails = pgTable(
  "emails",
  {
    id: varchar("id").primaryKey(),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    apiKeyId: varchar("api_key_id").references(() => apiKeys.id, {
      onDelete: "set null",
    }),
    from: varchar("from").notNull(),
    subject: varchar("subject").notNull(),
    textContent: text("text_content"),
    htmlContent: text("html_content"),
    replyTo: text("reply_to"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (emails) => {
    return {
      userIndex: index("user_email_idx").on(emails.userId),
      apiKeyIndex: index("apikey_email_idx").on(emails.apiKeyId),
      fromIndex: index("from_email_idx").on(emails.from),
      createdAtIndex: index("email_created_at_idx").on(emails.createdAt),
      emailSubjectIndex: index("email_subject_idx").on(emails.subject),
    };
  },
);

export const emailRelations = relations(emails, ({ one, many }) => ({
  user: one(users, {
    fields: [emails.userId],
    references: [users.id],
  }),
  recipients: many(emailRecipients),
}));

export const emailStatus = pgEnum("email_status", [
  "queued",
  "delivered",
  "rejected",
]);
export const recipientType = pgEnum("recipient_type", ["to", "cc", "bcc"]);

export const emailRecipients = pgTable(
  "email_recipients",
  {
    id: varchar("id").primaryKey(),
    emailId: varchar("email_id")
      .notNull()
      .references(() => emails.id, { onDelete: "cascade" }),
    recepientEmail: varchar("recipient_email").notNull(),
    type: recipientType("type").notNull(),
    status: emailStatus("status").notNull().default("queued"),
  },
  (emailRecipients) => {
    return {
      emailIdIndex: index("email_id_recipient_idx").on(emailRecipients.emailId),
      recipientEmailIndex: index("recipient_email_idx").on(
        emailRecipients.recepientEmail,
      ),
    };
  },
);

export const emailRecipientRelations = relations(
  emailRecipients,
  ({ one }) => ({
    email: one(emails, {
      fields: [emailRecipients.emailId],
      references: [emails.id],
    }),
  }),
);

export type EmailStatus = InferSelectModel<typeof emailRecipients>["status"];
export type EmailRecipient = InferInsertModel<typeof emailRecipients>;
