ALTER TABLE "emails" ADD COLUMN "api_key_id" varchar;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "apikey_email_idx" ON "emails" ("api_key_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_subject_idx" ON "emails" ("subject");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emails" ADD CONSTRAINT "emails_api_key_id_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "api_keys"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
