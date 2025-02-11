ALTER TABLE "users" DROP CONSTRAINT "users_university_id_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "registration_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "university_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "university_card";