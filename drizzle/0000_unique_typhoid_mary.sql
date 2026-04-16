CREATE TABLE "institution" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"code" varchar(50) NOT NULL,
	"address" text,
	"phone" varchar(15),
	"email" varchar(100),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "institution_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "user_inst_map" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"institution_id" uuid NOT NULL,
	"role" varchar(20) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_login" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"mobile_no" varchar(15) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" varchar(20) DEFAULT 'student',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_login_mobile_no_unique" UNIQUE("mobile_no")
);
