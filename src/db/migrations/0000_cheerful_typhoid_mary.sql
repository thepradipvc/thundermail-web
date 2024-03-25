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
CREATE TABLE IF NOT EXISTS "api_keys" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"prefix" varchar NOT NULL,
	"api_key" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_prefix_unique" UNIQUE("prefix"),
	CONSTRAINT "api_keys_api_key_unique" UNIQUE("api_key")
);
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
CREATE TABLE IF NOT EXISTS "gmail_accounts" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"email" varchar NOT NULL,
	"refresh_token" varchar NOT NULL,
	"status" "gmail_account_status" DEFAULT 'active' NOT NULL,
	CONSTRAINT "gmail_accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"google_id" varchar NOT NULL,
	"username" varchar NOT NULL,
	"image" varchar,
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "api_key_idx" ON "api_keys" ("api_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_apikey_idx" ON "api_keys" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_id_recipient_idx" ON "email_recipients" ("email_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipient_email_idx" ON "email_recipients" ("recipient_email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "emails" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "from_email_idx" ON "emails" ("from");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_created_at_idx" ON "emails" ("created_at");--> statement-breakpoint
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
