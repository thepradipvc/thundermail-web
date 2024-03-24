DO $$ BEGIN
 CREATE TYPE "email_status" AS ENUM('queued', 'delivered', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "gmail_account_status" AS ENUM('active', 'access revoked');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "recipient_type" AS ENUM('to', 'cc', 'bcc');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_recipients" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email_id" varchar NOT NULL,
	"recipient_email" varchar NOT NULL,
	"type" "recipient_type" NOT NULL,
	"status" "email_status" DEFAULT 'queued' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emails" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"from" varchar NOT NULL,
	"subject" varchar NOT NULL,
	"text_content" text,
	"html_content" text,
	"reply_to" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gmail_account" RENAME TO "gmail_accounts";--> statement-breakpoint
ALTER TABLE "session" RENAME TO "sessions";--> statement-breakpoint
ALTER TABLE "user" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "gmail_accounts" DROP CONSTRAINT "gmail_account_email_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_google_id_unique";--> statement-breakpoint
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_gmail_id_gmail_account_id_fk";
--> statement-breakpoint
ALTER TABLE "gmail_accounts" DROP CONSTRAINT "gmail_account_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "session_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "email_idx";--> statement-breakpoint
ALTER TABLE "gmail_accounts" ALTER COLUMN "status" SET DATA TYPE gmail_account_status;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_id_recipient_idx" ON "email_recipients" ("email_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipient_email_idx" ON "email_recipients" ("recipient_email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "emails" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "from_email_idx" ON "emails" ("from");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_created_at_idx" ON "emails" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_apikey_idx" ON "api_keys" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_gmailaccount_idx" ON "gmail_accounts" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_gmailaccount_idx" ON "gmail_accounts" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_session_idx" ON "sessions" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gmail_accounts" ADD CONSTRAINT "gmail_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "api_keys" DROP COLUMN IF EXISTS "gmail_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_recipients" ADD CONSTRAINT "email_recipients_email_id_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "emails"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emails" ADD CONSTRAINT "emails_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "gmail_accounts" ADD CONSTRAINT "gmail_accounts_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_google_id_unique" UNIQUE("google_id");