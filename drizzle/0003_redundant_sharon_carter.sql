ALTER TABLE "user" ADD COLUMN "display_name" varchar(25) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_display_name_unique" UNIQUE("display_name");